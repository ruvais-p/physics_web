/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Tv,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Radio,
  Search,
  AlertCircle,
  CheckCircle2,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface TvEvent {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate?: string;
  start_date?: string;
  date?: string;
  endDate?: string | null;
  end_date?: string | null;
  venue?: string | null;
  applyLink?: string | null;
  apply_link?: string | null;
  brochure?: string | null;
  broadcastToTv?: boolean;
  broadcast_to_tv?: boolean;
  tvDuration?: number;
  tv_duration?: number;
}

interface TvNotice {
  id: string;
  title: string;
  content?: string | null;
  category?: string;
  date: string;
}

interface TvManagementSectionProps {
  onSwitchToNotifications?: () => void;
  onSwitchToEvents?: () => void;
  onEventEdited?: () => void;
}

export default function TvManagementSection({
  onSwitchToNotifications,
  onSwitchToEvents,
  onEventEdited,
}: TvManagementSectionProps) {
  const [allEvents, setAllEvents] = useState<TvEvent[]>([]);
  const [notices, setNotices] = useState<TvNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchPool, setSearchPool] = useState('');

  const displayUrl = typeof window !== 'undefined' ? `${window.location.origin}/display` : '/display';

  // 1. Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [eventsRes, displayRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/display/events', { cache: 'no-store' }),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setAllEvents(Array.isArray(eventsData) ? eventsData : []);
      }

      if (displayRes.ok) {
        const displayData = await displayRes.json();
        if (Array.isArray(displayData.notices)) {
          setNotices(displayData.notices);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to fetch TV signage data:', err);
      setErrorMsg('Failed to fetch TV signage feed data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // Active TV broadcast items
  const activeTvEvents = allEvents.filter(
    (e) => Boolean(e.broadcastToTv ?? e.broadcast_to_tv)
  );

  // Available events not on TV
  const inactiveTvEvents = allEvents.filter(
    (e) => !Boolean(e.broadcastToTv ?? e.broadcast_to_tv)
  );

  // Total cycle time in seconds
  const totalCycleSeconds = activeTvEvents.reduce(
    (acc, curr) => acc + (curr.tvDuration ?? curr.tv_duration ?? 12),
    0
  );

  // 2. Toggle TV Broadcast
  const handleToggleBroadcast = async (eventItem: TvEvent, newStatus: boolean) => {
    setActionLoadingId(eventItem.id);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Optimistic state update
    setAllEvents((prev) =>
      prev.map((e) =>
        e.id === eventItem.id
          ? { ...e, broadcastToTv: newStatus, broadcast_to_tv: newStatus }
          : e
      )
    );

    try {
      const res = await fetch(`/api/events/${eventItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          broadcastToTv: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update TV broadcast status');
      }

      setSuccessMsg(
        newStatus
          ? `"${eventItem.title.slice(0, 30)}..." is now live on TV screen rotation!`
          : `Removed "${eventItem.title.slice(0, 30)}..." from TV screen rotation.`
      );
      setTimeout(() => setSuccessMsg(null), 4000);
      if (onEventEdited) onEventEdited();
    } catch (err: unknown) {
      console.error('Failed to toggle TV broadcast:', err);
      const msg = err instanceof Error ? err.message : 'Could not update broadcast status.';
      setErrorMsg(msg);
      fetchData(); // Rollback
    } finally {
      setActionLoadingId(null);
    }
  };

  // 4. Update TV Duration
  const handleDurationChange = async (eventItem: TvEvent, newDuration: number) => {
    if (newDuration < 5 || newDuration > 120) return;
    setActionLoadingId(eventItem.id);

    // Optimistic update
    setAllEvents((prev) =>
      prev.map((e) =>
        e.id === eventItem.id
          ? { ...e, tvDuration: newDuration, tv_duration: newDuration }
          : e
      )
    );

    try {
      const res = await fetch(`/api/events/${eventItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tvDuration: newDuration,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update slide duration');
      }

      setSuccessMsg(`Display time updated to ${newDuration}s.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      if (onEventEdited) onEventEdited();
    } catch (err) {
      console.error('Failed to update duration:', err);
      fetchData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-10 font-sans">
      {/* 1. Header / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2.5">
            <Tv className="w-8 h-8 text-oxford" />
            <span>TV Display & Kiosk Signage</span>
          </h2>
          <p className="text-slate-600 text-base mt-1">
            Manage real-time digital signage displayed on lobby Smart TVs, kiosk displays, and seminar screens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="h-11 w-11 text-slate-700 hover:text-slate-950"
            title="Refresh TV Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="h-11 px-4 text-slate-700 hover:text-slate-950 font-semibold cursor-pointer rounded-xl flex items-center gap-2"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedLink ? 'Copied!' : 'Copy TV URL'}</span>
          </Button>

          <Button
            variant="default"
            asChild
            className="h-11 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
          >
            <a
              href="/display"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Tv className="w-4 h-4" />
              <span>Launch /display Screen</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </Button>
        </div>
      </div>

      {/* Notifications banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-sm font-semibold animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Top Stats & Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Broadcasts</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-serif text-slate-900 mt-2">
            {activeTvEvents.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeTvEvents.length === 0
              ? 'Showing 3 recent fallback events'
              : 'Explicitly flagged events in rotation'}
          </p>
        </Card>

        <Card className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Cycle Time</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-serif text-slate-900 mt-2">
            {activeTvEvents.length > 0 ? `${totalCycleSeconds}s` : '36s'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeTvEvents.length > 0
              ? `Avg ${(totalCycleSeconds / activeTvEvents.length).toFixed(0)}s per slide`
              : 'Default 12s per fallback slide'}
          </p>
        </Card>

        <Card className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Ticker Notices</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-serif text-slate-900 mt-2">
            {notices.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scrolling ticker notices at bottom
          </p>
          {onSwitchToNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwitchToNotifications}
              className="text-xs text-amber-700 hover:text-amber-800 p-0 h-auto font-semibold flex items-center gap-1 mt-2 cursor-pointer"
            >
              <span>Manage Notices</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          )}
        </Card>

        <Card className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Auto-Sync Interval</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-serif text-slate-900 mt-2">
            30s
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hardware screens poll every 30s
          </p>
        </Card>
      </div>

      {/* 3. Active TV Broadcast Queue */}
      <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <span>Active TV Rotation Queue</span>
              <Badge variant="outline" className="border-slate-300 text-slate-700 bg-slate-50 text-xs ml-1 font-mono">
                {activeTvEvents.length} Active Slides
              </Badge>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Events listed here rotate continuously on every connected Smart TV screen.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Cycle Time: <strong className="text-slate-900">{totalCycleSeconds}s</strong>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {activeTvEvents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Tv className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-base font-semibold text-slate-800">No events currently flagged for TV</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                When no events are explicitly flagged, the TV screen automatically rotates the 3 most recent department events as fallback.
              </p>
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 font-bold">Poster</TableHead>
                  <TableHead className="font-bold">Event Details</TableHead>
                  <TableHead className="font-bold">Event Schedule</TableHead>
                  <TableHead className="font-bold text-center">Slide Duration</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTvEvents.map((ev) => (
                  <TableRow key={ev.id} className="hover:bg-slate-50/60">
                    <TableCell className="py-3.5">
                      <div className="w-16 h-11 rounded-lg bg-slate-950 overflow-hidden border border-slate-200 shrink-0">
                        <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 text-base font-serif truncate" title={ev.title}>
                        {ev.title}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        Event #{ev.id} {ev.venue ? `• ${ev.venue}` : ''}
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 whitespace-nowrap font-mono text-xs text-slate-700">
                      {ev.startDate || ev.start_date || ev.date
                        ? new Date(ev.startDate || ev.start_date || ev.date || '').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </TableCell>

                    {/* Quick Duration Selector */}
                    <TableCell className="py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <select
                          value={ev.tvDuration ?? ev.tv_duration ?? 12}
                          disabled={actionLoadingId === ev.id}
                          onChange={(e) => handleDurationChange(ev, parseInt(e.target.value, 10))}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-oxford"
                        >
                          <option value={8}>8s (Fast)</option>
                          <option value={10}>10s</option>
                          <option value={12}>12s (Standard)</option>
                          <option value={15}>15s</option>
                          <option value={20}>20s</option>
                          <option value={30}>30s (Detailed)</option>
                        </select>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <span>Live on Screen</span>
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionLoadingId === ev.id}
                        onClick={() => handleToggleBroadcast(ev, false)}
                        className="h-8 text-xs font-medium rounded-lg cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      >
                        Remove from TV
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 5. Available Events Pool (Add to TV Broadcast) */}
      <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <span>Department Events Pool</span>
              <Badge variant="outline" className="border-slate-300 text-slate-600 text-xs ml-1 font-mono">
                {inactiveTvEvents.length} Available
              </Badge>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Select any event below to immediately broadcast it to the lobby TV screen rotation.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search available events..."
                value={searchPool}
                onChange={(e) => setSearchPool(e.target.value)}
                className="pl-9 h-10 text-xs"
              />
            </div>
            {onSwitchToEvents && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSwitchToEvents}
                className="h-10 text-xs text-oxford border-oxford/20 hover:bg-oxford/5 font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Add Event</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {inactiveTvEvents.length === 0 ? (
            <div className="p-10 text-center text-slate-500 space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                {searchPool ? 'No matching events found.' : 'All department events are currently broadcasted to TV!'}
              </p>
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 font-bold">Poster</TableHead>
                  <TableHead className="font-bold">Event Title</TableHead>
                  <TableHead className="font-bold">Event Schedule</TableHead>
                  <TableHead className="font-bold">Venue</TableHead>
                  <TableHead className="text-right font-bold">Broadcast Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inactiveTvEvents
                  .filter((ev) => {
                    if (!searchPool.trim()) return true;
                    const term = searchPool.toLowerCase();
                    return (
                      ev.title.toLowerCase().includes(term) ||
                      (ev.venue || '').toLowerCase().includes(term)
                    );
                  })
                  .map((ev) => (
                    <TableRow key={ev.id} className="hover:bg-slate-50/60">
                      <TableCell className="py-3">
                        <div className="w-14 h-10 rounded-lg bg-slate-950 overflow-hidden border border-slate-200 shrink-0">
                          <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>

                      <TableCell className="py-3 max-w-sm">
                        <div className="font-semibold text-slate-900 truncate" title={ev.title}>
                          {ev.title}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">Event #{ev.id}</div>
                      </TableCell>

                      <TableCell className="py-3 whitespace-nowrap font-mono text-xs text-slate-600">
                        {ev.startDate || ev.start_date || ev.date
                          ? new Date(ev.startDate || ev.start_date || ev.date || '').toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </TableCell>

                      <TableCell className="py-3 text-xs text-slate-600">
                        {ev.venue || '—'}
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        <Button
                          variant="default"
                          size="sm"
                          disabled={actionLoadingId === ev.id}
                          onClick={() => handleToggleBroadcast(ev, true)}
                          className="h-8 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5 ml-auto bg-oxford hover:bg-slate-800 text-white"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span>Add to TV</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
