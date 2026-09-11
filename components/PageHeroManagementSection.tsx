'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Image as ImageIcon, 
  Upload, 
  Save, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Edit3,
  Eye,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { DEFAULT_PAGE_HEROES } from '@/lib/page-hero';

export interface PageHeroItem {
  pageKey: string;
  pageName: string;
  title: string;
  subtitle: string;
  image: string;
  updatedAt: string | null;
  isCustomized: boolean;
}

const INITIAL_PAGE_HEROES: PageHeroItem[] = Object.values(DEFAULT_PAGE_HEROES).map((item) => ({
  pageKey: item.pageKey,
  pageName: item.pageName,
  title: item.title,
  subtitle: item.subtitle,
  image: item.image,
  updatedAt: null,
  isCustomized: false,
}));

export default function PageHeroManagementSection() {
  const [pageHeroes, setPageHeroes] = useState<PageHeroItem[]>(INITIAL_PAGE_HEROES);
  const [loading, setLoading] = useState(false);
  const [editingHero, setEditingHero] = useState<PageHeroItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPageHeroes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/page-heroes', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPageHeroes(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch page heroes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageHeroes();
  }, []);

  const openEditModal = (hero: PageHeroItem) => {
    setEditingHero(hero);
    setTitle(hero.title);
    setSubtitle(hero.subtitle || '');
    setImageUrl('');
    setImageFile(null);
    setImagePreview(hero.image);
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImageUrl('');
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHero) return;

    if (!title.trim()) {
      setFormError('Hero title is required.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);
      setFormSuccess(null);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('subtitle', subtitle.trim());

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim());
      }

      const res = await fetch(`/api/cms/page-heroes/${editingHero.pageKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update hero banner.');
      }

      setFormSuccess('Hero banner updated and published successfully!');
      await fetchPageHeroes();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 flex items-center gap-2.5">
            <Layout className="w-6 h-6 text-oxford" />
            <span>Inner Pages Hero Banners</span>
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Customize the title, subtitle, and top banner background image for every public page on the site.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={fetchPageHeroes}
          className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-100 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Pages Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Loading page hero configurations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageHeroes.map((hero) => (
            <Card
              key={hero.pageKey}
              className="bg-white border border-slate-200 hover:border-cyan-accent/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Banner Image Preview Container */}
                <div className="relative aspect-[16/8] w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={hero.image}
                    alt={hero.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Page Name Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-oxford font-bold text-xs shadow-sm">
                    {hero.pageName}
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3">
                    {hero.isCustomized ? (
                      <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                        Customized
                      </span>
                    ) : (
                      <span className="bg-slate-700/80 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Overlay Title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-serif font-black text-base sm:text-lg leading-tight line-clamp-1 drop-shadow-md">
                      {hero.title}
                    </h4>
                  </div>
                </div>

                {/* Subtitle / Description preview */}
                <div className="p-5 space-y-2">
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {hero.subtitle || 'No subtitle configured.'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <div className="w-full h-px bg-slate-100 mb-3.5" />
                <Button
                  type="button"
                  onClick={() => openEditModal(hero)}
                  className="w-full flex items-center justify-center gap-2 bg-oxford hover:bg-cyan-accent text-white hover:text-oxford font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit {hero.pageName} Banner</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Banner Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1 pb-2 border-b border-slate-100">
            <DialogTitle className="text-xl sm:text-2xl font-serif font-bold text-oxford">
              Edit Hero Banner — {editingHero?.pageName}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500">
              Update the headline text, tagline description, and top background image for the {editingHero?.pageName} page.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6 pt-3">
            {/* Live Hero Simulation Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Banner Live Preview
              </label>
              <div className="relative aspect-[21/9] min-h-[160px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white space-y-1">
                  <h3 className="font-serif text-lg sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-md">
                    {title || 'PAGE TITLE'}
                  </h3>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-xl font-sans drop-shadow-sm">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="hero-title" className="text-xs font-bold text-slate-700 block">
                Hero Title (Headline) <span className="text-red-500">*</span>
              </label>
              <Input
                id="hero-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ABOUT DEPARTMENT"
                className="rounded-xl border-slate-300 font-semibold"
                required
              />
            </div>

            {/* Subtitle Input */}
            <div className="space-y-2">
              <label htmlFor="hero-subtitle" className="text-xs font-bold text-slate-700 block">
                Hero Subtitle / Description
              </label>
              <textarea
                id="hero-subtitle"
                rows={3}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter a compelling 1-2 sentence overview for this page..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-oxford/20 focus:border-oxford resize-none"
              />
            </div>

            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Background Banner Image
              </label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-cyan-accent rounded-2xl p-5 text-center cursor-pointer hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-slate-400" />
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  <span className="text-cyan-dark font-bold hover:underline">Click to upload banner</span> or drag and drop
                </div>
                <p className="text-[11px] text-slate-400">
                  Recommended: 1920x800 px (PNG, JPG, WebP up to 10MB). Automatically optimized.
                </p>
              </div>

              {/* Or image URL input */}
              <div className="pt-2">
                <label htmlFor="hero-image-url" className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Or Image Web URL / Path:
                </label>
                <Input
                  id="hero-image-url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setImagePreview(e.target.value.trim());
                      setImageFile(null);
                    }
                  }}
                  placeholder="https://images.unsplash.com/... or /campus.jpg"
                  className="rounded-xl border-slate-200 text-xs mt-1"
                />
              </div>
            </div>

            {/* Error / Success Feedback */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Dialog Actions */}
            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-oxford hover:bg-cyan-dark text-white font-bold flex items-center gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving & Publishing...' : 'Save & Publish Banner'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
