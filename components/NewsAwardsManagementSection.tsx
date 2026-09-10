'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Newspaper,
  Award,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Image as ImageIcon,
  Radio,
  Eye,
  Link as LinkIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  date: string;
  link?: string | null;
  broadcastId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  date: string;
  link?: string | null;
  broadcastId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function NewsAwardsManagementSection() {
  const [activeSubTab, setActiveSubTab] = useState<'news' | 'awards'>('news');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [awardsList, setAwardsList] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | AwardItem | null>(null);
  const [modalType, setModalType] = useState<'news' | 'awards'>('news');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; type: 'news' | 'awards'; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch News & Awards
  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, awardsRes] = await Promise.all([
        fetch('/api/cms/news', { cache: 'no-store' }),
        fetch('/api/cms/awards', { cache: 'no-store' }),
      ]);

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNewsList(Array.isArray(newsData) ? newsData : []);
      }
      if (awardsRes.ok) {
        const awardsData = await awardsRes.json();
        setAwardsList(Array.isArray(awardsData) ? awardsData : []);
      }
    } catch (err) {
      console.error('Failed to fetch news/awards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = (type: 'news' | 'awards') => {
    setModalType(type);
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().slice(0, 10));
    setLink('');
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsItem | AwardItem, type: 'news' | 'awards') => {
    setModalType(type);
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setDate(item.date ? new Date(item.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
    setLink(item.link || '');
    setImageFile(null);
    setImageUrl(item.image || '');
    setImagePreview(item.image || null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!description.trim()) {
      setFormError('Description is required');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const endpoint = modalType === 'news' ? '/api/cms/news' : '/api/cms/awards';
      const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;
      const method = editingItem ? 'PUT' : 'POST';

      let res: Response;

      if (imageFile) {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        if (date) formData.append('date', date);
        if (link.trim()) formData.append('link', link.trim());
        formData.append('image', imageFile);

        res = await fetch(url, {
          method,
          body: formData,
        });
      } else {
        res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            date: date || new Date().toISOString(),
            link: link.trim() || null,
            image: imageUrl.trim() || null,
          }),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to ${editingItem ? 'update' : 'create'} ${modalType}`);
      }

      setSuccessMsg(`${modalType === 'news' ? 'News' : 'Award'} item saved successfully!`);
      setIsModalOpen(false);
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      const endpoint = deleteConfirmItem.type === 'news' ? '/api/cms/news' : '/api/cms/awards';
      const res = await fetch(`${endpoint}/${deleteConfirmItem.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg(`${deleteConfirmItem.type === 'news' ? 'News item' : 'Award'} deleted successfully.`);
        setDeleteConfirmItem(null);
        await fetchData();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting item');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNews = newsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAwards = awardsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCount = newsList.length + awardsList.length;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none font-sans">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-oxford" />
            <span>News & Honors Management</span>
            <Badge variant="outline" className="ml-2 font-mono text-xs border-oxford text-oxford">
              {totalCount} Total Items
            </Badge>
          </h2>
          <p className="text-slate-600 text-base mt-1">
            Add, update, or remove department news, research breakthroughs, press releases, faculty & student honors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            className="h-11 w-11 text-slate-700 hover:text-slate-950 cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="default"
            onClick={() => openAddModal(activeSubTab)}
            className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeSubTab === 'news' ? 'Add News Item' : 'Add Award / Honor'}</span>
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-semibold animate-fadeIn font-sans">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <Button
          variant={activeSubTab === 'news' ? 'default' : 'outline'}
          onClick={() => setActiveSubTab('news')}
          className="rounded-xl font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Newspaper className="w-4 h-4" />
          <span>Department News</span>
          <Badge className={`ml-1 font-mono text-xs ${activeSubTab === 'news' ? 'bg-white text-oxford' : 'bg-slate-100 text-slate-700'}`}>
            {newsList.length}
          </Badge>
        </Button>

        <Button
          variant={activeSubTab === 'awards' ? 'default' : 'outline'}
          onClick={() => setActiveSubTab('awards')}
          className="rounded-xl font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>Honors & Awards</span>
          <Badge className={`ml-1 font-mono text-xs ${activeSubTab === 'awards' ? 'bg-white text-oxford' : 'bg-slate-100 text-slate-700'}`}>
            {awardsList.length}
          </Badge>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
        <Input
          type="text"
          placeholder={`Search ${activeSubTab === 'news' ? 'news articles' : 'honors & awards'} by title or description...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 text-base h-12 bg-white"
        />
      </div>

      {/* Content Table Card */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden font-sans">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            {activeSubTab === 'news' ? (
              <>
                <Newspaper className="w-5 h-5 text-oxford" />
                <span>Department News Articles</span>
                <Badge variant="outline" className="border-oxford/30 text-oxford text-xs ml-1 font-mono">
                  {newsList.length} Articles
                </Badge>
              </>
            ) : (
              <>
                <Award className="w-5 h-5 text-oxford" />
                <span>Honors & Awards Registry</span>
                <Badge variant="outline" className="border-oxford/30 text-oxford text-xs ml-1 font-mono">
                  {awardsList.length} Honors
                </Badge>
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-oxford" />
              <p className="text-xs">Loading {activeSubTab === 'news' ? 'news articles' : 'honors'}...</p>
            </div>
          ) : activeSubTab === 'news' ? (
            filteredNews.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <Newspaper className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-slate-800">No News Items Recorded</p>
                <p className="text-xs text-slate-500">
                  {searchTerm ? 'No news articles match your search filter.' : 'Publish your first department news story.'}
                </p>
                <Button
                  onClick={() => openAddModal('news')}
                  variant="default"
                  size="sm"
                  className="mt-2 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add First News Item
                </Button>
              </div>
            ) : (
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold w-24">Cover Image</TableHead>
                    <TableHead className="font-bold">News Title & Description</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Syndication</TableHead>
                    <TableHead className="font-bold">Link</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/40">
                      <TableCell className="py-4">
                        <div className="w-16 h-11 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 relative shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                              <ImageIcon className="w-4 h-4 opacity-50" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 max-w-md">
                        <div className="font-bold text-slate-900 text-base font-serif line-clamp-1">{item.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.description}</div>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                        {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'}
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        {item.broadcastId ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            <Radio className="w-3 h-3" /> Broadcast
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Direct News</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-oxford hover:underline font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Attached Link
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <a
                          href="/news"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View on Site
                        </a>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => openEditModal(item, 'news')}
                          className="h-9 w-9 text-slate-600 hover:text-slate-900 cursor-pointer"
                          title="Edit News"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeleteConfirmItem({ id: item.id, type: 'news', title: item.title })}
                          className="h-9 w-9 cursor-pointer"
                          title="Delete News"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : (
            filteredAwards.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <Award className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-slate-800">No Honors & Awards Recorded</p>
                <p className="text-xs text-slate-500">
                  {searchTerm ? 'No honors match your search filter.' : 'Add your first faculty or student honor.'}
                </p>
                <Button
                  onClick={() => openAddModal('awards')}
                  variant="default"
                  size="sm"
                  className="mt-2 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add First Award
                </Button>
              </div>
            ) : (
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold w-24">Photo</TableHead>
                    <TableHead className="font-bold">Award Title & Citation</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Syndication</TableHead>
                    <TableHead className="font-bold">Citation / Link</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAwards.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/40">
                      <TableCell className="py-4">
                        <div className="w-16 h-11 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 relative shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-500/60 bg-amber-50/50">
                              <Award className="w-4 h-4 opacity-70" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 max-w-md">
                        <div className="font-bold text-slate-900 text-base font-serif line-clamp-1">{item.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.description}</div>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                        {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'}
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        {item.broadcastId ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Radio className="w-3 h-3" /> Broadcast
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Direct Honor</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-oxford hover:underline font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Citation Link
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <a
                          href="/news"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View on Site
                        </a>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => openEditModal(item, 'awards')}
                          className="h-9 w-9 text-slate-600 hover:text-slate-900 cursor-pointer"
                          title="Edit Award"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeleteConfirmItem({ id: item.id, type: 'awards', title: item.title })}
                          className="h-9 w-9 cursor-pointer"
                          title="Delete Award"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              {modalType === 'news' ? (
                <Newspaper className="w-5 h-5 text-oxford" />
              ) : (
                <Award className="w-5 h-5 text-oxford" />
              )}
              <span>{editingItem ? `Edit ${modalType === 'news' ? 'News' : 'Award'}` : `Add New ${modalType === 'news' ? 'News Article' : 'Honor & Award'}`}</span>
            </DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 font-sans mt-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 pt-4 font-sans">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                {modalType === 'news' ? 'News Headline / Title' : 'Award / Honor Title'} <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder={modalType === 'news' ? 'e.g., Quantum Computing Lab Secures ₹2.5 Cr SERB Grant' : 'e.g., Best Teacher Award 2026 - Dr. A. Sharma'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base font-serif"
                required
              />
            </div>

            {/* Date & Link Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">
                  Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">
                  External Link (Optional)
                </label>
                <Input
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full text-xs font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Description / Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide complete story details, summary, achievements, or citation info..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                required
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">
                Cover Image / Photo (Optional)
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                />
                <div className="text-xs text-slate-400 text-center font-bold font-sans">OR</div>
                <Input
                  type="text"
                  placeholder="https://... or /uploads/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                    setImageFile(null);
                  }}
                  className="w-full text-xs font-mono"
                />
              </div>

              {imagePreview && (
                <div className="mt-2 w-full h-28 rounded-xl border border-slate-200 overflow-hidden relative bg-slate-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImageUrl('');
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-oxford hover:bg-slate-800 text-white font-semibold cursor-pointer"
              >
                {saving ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : editingItem ? (
                  'Save Changes'
                ) : (
                  `Publish ${modalType === 'news' ? 'News Article' : 'Award'}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmItem} onOpenChange={() => setDeleteConfirmItem(null)}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-sans">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm {deleteConfirmItem?.type === 'news' ? 'News' : 'Award'} Deletion</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete &quot;{deleteConfirmItem?.title}&quot;? This action cannot be undone.
          </p>
          <DialogFooter className="pt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmItem(null)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
