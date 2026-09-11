'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Radio,
  Bell,
  Newspaper,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertCircle,
  ExternalLink,
  Upload,
  MapPin,
  Clock,
} from 'lucide-react';

interface MultiChannelBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublished?: () => void;
}

export default function MultiChannelBroadcastModal({
  open,
  onOpenChange,
  onPublished,
}: MultiChannelBroadcastModalProps) {
  // Target Channels State
  const [selectedTargets, setSelectedTargets] = useState<string[]>([
    'notifications',
    'news',
    'events',
  ]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [notificationCategory, setNotificationCategory] = useState('Event');

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const toggleTarget = (targetKey: string) => {
    setError(null);
    if (selectedTargets.includes(targetKey)) {
      setSelectedTargets(selectedTargets.filter((t) => t !== targetKey));
    } else {
      setSelectedTargets([...selectedTargets, targetKey]);
    }
  };

  const isEventSelected = selectedTargets.includes('events');
  const isNewsSelected = selectedTargets.includes('news');
  const isNotifSelected = selectedTargets.includes('notifications');

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date().toISOString().slice(0, 16));
    setEndDate('');
    setVenue('');
    setApplyLink('');
    setNotificationCategory('Event');
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (selectedTargets.length === 0) {
      setError('Please select at least one publish destination.');
      return;
    }

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    if (isEventSelected && !startDate.trim()) {
      setError('Event Start Date & Time is required.');
      return;
    }

    if ((isEventSelected || isNewsSelected) && !imageFile && !imageUrl.trim()) {
      setError('A cover image (upload or URL) is required when publishing to News or Events.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('startDate', startDate);
      if (endDate.trim()) formData.append('endDate', endDate);
      if (venue.trim()) formData.append('venue', venue.trim());
      if (applyLink.trim()) formData.append('apply_link', applyLink.trim());
      formData.append('notificationCategory', notificationCategory);
      formData.append('targets', JSON.stringify(selectedTargets));

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim());
      }

      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish multi-channel broadcast.');
      }

      setSuccessMsg(`Published successfully to ${selectedTargets.length} channel(s)!`);
      if (onPublished) onPublished();

      setTimeout(() => {
        handleResetForm();
        onOpenChange(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during broadcasting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-slate-200 p-6 rounded-3xl shadow-2xl font-serif text-slate-900 max-h-[92vh] overflow-y-auto">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-cyan-accent mb-1">
            <Radio className="w-5 h-5 text-oxford animate-pulse" />
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-oxford">
              Universal Syndication Engine
            </span>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            Multi-Channel Broadcast
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 font-sans">
            Compose your post once and choose which public channels and portals it broadcasts to.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-3">
          {error && (
            <div className="p-3.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: TARGET CHANNELS SELECTOR */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-sans">
              1. Select Publish Channels ({selectedTargets.length} Active)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Channel 1: Notifications */}
              <button
                type="button"
                onClick={() => toggleTarget('notifications')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isNotifSelected
                    ? 'bg-oxford/5 border-oxford text-oxford shadow-xs ring-2 ring-oxford/20'
                    : 'bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isNotifSelected ? 'bg-oxford text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isNotifSelected ? 'border-oxford bg-oxford text-white' : 'border-slate-300'}`}>
                    {isNotifSelected && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold font-sans">Notifications</div>
                  <div className="text-[11px] text-slate-500 font-sans mt-0.5">Ticker &amp; Announcements</div>
                </div>
              </button>

              {/* Channel 2: News */}
              <button
                type="button"
                onClick={() => toggleTarget('news')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isNewsSelected
                    ? 'bg-oxford/5 border-oxford text-oxford shadow-xs ring-2 ring-oxford/20'
                    : 'bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isNewsSelected ? 'bg-oxford text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isNewsSelected ? 'border-oxford bg-oxford text-white' : 'border-slate-300'}`}>
                    {isNewsSelected && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold font-sans">Department News</div>
                  <div className="text-[11px] text-slate-500 font-sans mt-0.5">/news Feed Story</div>
                </div>
              </button>

              {/* Channel 3: Events */}
              <button
                type="button"
                onClick={() => toggleTarget('events')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isEventSelected
                    ? 'bg-oxford/5 border-oxford text-oxford shadow-xs ring-2 ring-oxford/20'
                    : 'bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isEventSelected ? 'bg-oxford text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isEventSelected ? 'border-oxford bg-oxford text-white' : 'border-slate-300'}`}>
                    {isEventSelected && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold font-sans">Events Calendar</div>
                  <div className="text-[11px] text-slate-500 font-sans mt-0.5">/events &amp; Home Page</div>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: CONTENT DETAILS */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-sans">
              2. Content Details
            </label>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Headline / Title *</label>
              <Input
                type="text"
                placeholder="e.g. International Conference on Quantum Materials & Nanophotonics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base font-serif"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Description / Article Content *</label>
              <textarea
                rows={4}
                placeholder="Write the announcement, schedule, or full summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                required
              />
            </div>

            {/* Date & Time Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Start Date &amp; Time *</span>
                </label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs font-mono"
                  required
                />
              </div>

              {isEventSelected && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>End Date &amp; Time (Optional)</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs font-mono"
                  />
                </div>
              )}
            </div>

            {/* Event Venue */}
            {isEventSelected && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Event Venue / Hall (Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Main Auditorium, Department of Physics, CUSAT"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full text-sm font-sans"
                />
              </div>
            )}

            {/* Notification Category */}
            {isNotifSelected && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-slate-500" />
                  <span>Notification Ticker Category</span>
                </label>
                <select
                  value={notificationCategory}
                  onChange={(e) => setNotificationCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford"
                >
                  <option value="Event">Event</option>
                  <option value="News">News</option>
                  <option value="Notice">Notice</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Academic">Academic</option>
                  <option value="General">General</option>
                </select>
              </div>
            )}

            {/* Action / Apply Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Action / Registration Link (Optional)</span>
              </label>
              <Input
                type="url"
                placeholder={
                  isEventSelected
                    ? 'Leave blank to auto-link to event page, or paste external form URL'
                    : 'https://...'
                }
                value={applyLink}
                onChange={(e) => setApplyLink(e.target.value)}
                className="w-full text-xs font-mono"
              />
            </div>

            {/* Cover Image (if News or Events is selected) */}
            {(isNewsSelected || isEventSelected) && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Cover Image (File Upload or Image URL) *
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImageUrl('');
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-oxford file:text-white hover:file:bg-oxford/90 cursor-pointer"
                  />

                  <div className="text-center text-[11px] text-slate-400 font-sans">OR Image URL</div>

                  <Input
                    type="text"
                    placeholder="/eventssss.jpg or https://..."
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageFile(null);
                      setImagePreview(e.target.value || null);
                    }}
                    className="w-full text-xs font-mono"
                  />

                  {imagePreview && (
                    <div className="relative aspect-[16/9] w-full max-w-sm rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mt-2 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImageUrl('');
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || selectedTargets.length === 0}
              className="bg-oxford hover:bg-oxford/90 text-white font-semibold rounded-xl px-6 py-2.5 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-accent" />
              <span>
                {submitting
                  ? 'Broadcasting...'
                  : `Publish to ${selectedTargets.length} Channel${selectedTargets.length === 1 ? '' : 's'}`}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
