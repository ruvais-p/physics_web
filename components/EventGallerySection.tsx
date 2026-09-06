'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Images, 
  Upload, 
  Trash2, 
  RefreshCw, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  X, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  FileImage,
  UploadCloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export interface GalleryImage {
  id: number;
  eventId: number;
  imagePath: string;
  sortOrder: number;
  createdAt?: string;
}

interface EventGallerySectionProps {
  eventId: number | null;
}

export default function EventGallerySection({ eventId }: EventGallerySectionProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Queue of selected files & previews for batch upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');

  // Drag & drop highlight state
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Replace State
  const [replacingImageId, setReplacingImageId] = useState<number | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const MAX_PHOTOS = 20;

  useEffect(() => {
    if (eventId) {
      fetchGalleryImages();
    } else {
      setImages([]);
    }
  }, [eventId]);

  const fetchGalleryImages = async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/images`);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to load gallery images');
      }
    } catch (err) {
      console.error('Error loading gallery images:', err);
      setError('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  const addFilesToQueue = (newFiles: File[]) => {
    setError(null);
    setSuccess(null);

    if (newFiles.length === 0) return;

    const validNewFiles: File[] = [];
    const validNewPreviews: string[] = [];

    for (const f of newFiles) {
      const isFormatValid = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type) ||
        /\.(jpg|jpeg|png|webp)$/i.test(f.name);

      if (!isFormatValid) {
        setError(`File "${f.name}" is not a supported format. Please upload JPG, PNG, or WebP images.`);
        return;
      }

      if (f.size > 5 * 1024 * 1024) {
        setError(`File "${f.name}" exceeds maximum 5MB size limit.`);
        return;
      }

      validNewFiles.push(f);
      validNewPreviews.push(URL.createObjectURL(f));
    }

    const currentTotalCount = images.length + selectedFiles.length;
    if (currentTotalCount + validNewFiles.length > MAX_PHOTOS) {
      setError(`Cannot add ${validNewFiles.length} photo(s). Maximum limit of ${MAX_PHOTOS} photos reached (currently ${images.length} uploaded + ${selectedFiles.length} queued).`);
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validNewFiles]);
    setFilePreviews((prev) => [...prev, ...validNewPreviews]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFilesToQueue(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    addFilesToQueue(files);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      const targetUrl = prev[index];
      if (targetUrl) URL.revokeObjectURL(targetUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUploadImages = async () => {
    if (!eventId) return;

    // Parse URL lines if entered
    const urlList = urlInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (selectedFiles.length === 0 && urlList.length === 0) {
      setError('Please select one or more image files or paste image URLs to upload.');
      return;
    }

    const totalIncoming = selectedFiles.length + urlList.length;
    if (images.length + totalIncoming > MAX_PHOTOS) {
      setError(`Gallery limit exceeded! Maximum ${MAX_PHOTOS} photos allowed per event. Currently has ${images.length} photo(s).`);
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
      urlList.forEach((url) => {
        formData.append('imageUrls', url);
      });

      const res = await fetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Batch upload failed');
      }

      const uploadedCount = selectedFiles.length + urlList.length;
      setSuccess(`Successfully uploaded ${uploadedCount} photo(s) to event gallery!`);
      
      // Clean up local preview ObjectURLs
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setFilePreviews([]);
      setUrlInput('');
      
      await fetchGalleryImages();
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading gallery images.');
    } finally {
      setUploading(false);
    }
  };

  // Move / Reorder handler
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!eventId) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Optimistic UI update
    setImages(updated);

    try {
      const imageIds = updated.map((img) => img.id);
      const res = await fetch(`/api/events/${eventId}/images/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to reorder images');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to persist new sort order');
      await fetchGalleryImages(); // Revert on failure
    }
  };

  // Replace handler
  const triggerReplace = (imageId: number) => {
    setReplacingImageId(imageId);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
      replaceFileInputRef.current.click();
    }
  };

  const handleFileReplaceSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!replacingImageId) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Replacement image exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`/api/event-images/${replacingImageId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to replace image');
      }

      setSuccess('Gallery image replaced successfully!');
      await fetchGalleryImages();
    } catch (err: any) {
      setError(err.message || 'Failed to replace image');
    } finally {
      setUploading(false);
      setReplacingImageId(null);
    }
  };

  // Delete handler
  const handleDelete = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this gallery image? This action cannot be undone.')) return;

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/event-images/${imageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete image');
      }

      setSuccess('Gallery image deleted.');
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    }
  };

  if (!eventId) {
    return (
      <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50">
        <Images className="w-8 h-8 mx-auto text-slate-400" />
        <h4 className="text-sm font-bold text-slate-700">Event Gallery Available After Saving</h4>
        <p className="text-xs text-slate-500 font-sans">
          Create and save the event first to upload up to 20 gallery photos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200">
      {/* Hidden File Input for Replace Action */}
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleFileReplaceSelect}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {/* Hidden File Input for Main Batch Selection */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {/* Header & Photo Counter Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Images className="w-5 h-5 text-oxford" />
            <h3 className="font-serif font-bold text-base text-slate-900">Event Photo Gallery</h3>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Upload multiple event photos at once (up to {MAX_PHOTOS} max). Reorder, replace, or preview gallery images.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className={`font-mono text-xs px-3 py-1 font-bold ${
              images.length >= MAX_PHOTOS
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            {images.length}/{MAX_PHOTOS} Photos
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={fetchGalleryImages}
            className="h-8 w-8 text-slate-600"
            title="Refresh Gallery"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Multi-File Upload Dropzone */}
      {images.length < MAX_PHOTOS && (
        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4 font-sans">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-oxford" />
              <span>Upload Multiple Photos Simultaneously</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              Available slots: {MAX_PHOTOS - images.length - selectedFiles.length}
            </span>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDraggingOver
                ? 'border-oxford bg-oxford/5 shadow-inner'
                : 'border-slate-300 hover:border-oxford hover:bg-slate-100/60'
            }`}
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-oxford/10 text-oxford mx-auto flex items-center justify-center border border-oxford/20">
                <FileImage className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Drag & Drop multiple images here, or <span className="text-indigo-600 underline">browse files</span>
                </p>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Select multiple files at once using Ctrl/Cmd or Shift key (JPG, PNG, WebP up to 5MB each)
                </p>
              </div>
            </div>
          </div>

          {/* Selected Batch Files Queue */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>Queued Photos for Upload ({selectedFiles.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    filePreviews.forEach((u) => URL.revokeObjectURL(u));
                    setSelectedFiles([]);
                    setFilePreviews([]);
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:underline"
                >
                  Clear Queue
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-1">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 bg-slate-900 group shadow-xs"
                  >
                    <img
                      src={filePreviews[idx]}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedFile(idx);
                        }}
                        className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 right-1 text-[9px] font-mono text-white truncate bg-black/70 px-1 py-0.5 rounded">
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Image URLs Input */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <label className="text-[11px] font-bold text-slate-700 block">
              Or Paste Direct Image URLs (separated by new lines or commas)
            </label>
            <textarea
              rows={2}
              placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full text-xs font-mono bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-oxford focus:outline-none"
            />
          </div>

          {/* Submit Batch Upload Button */}
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              onClick={handleUploadImages}
              disabled={uploading || (selectedFiles.length === 0 && !urlInput.trim())}
              className="font-semibold text-xs py-2.5 px-6 flex items-center gap-2 rounded-xl cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>
                {uploading
                  ? `Uploading ${selectedFiles.length || 'batch'} photo(s)...`
                  : `Upload ${selectedFiles.length ? selectedFiles.length + ' Selected Photo(s)' : 'Photos'}`}
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="space-y-3 font-sans">
        <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
          <span>Uploaded Gallery Images ({images.length})</span>
          {images.length > 1 && <span className="text-[11px] text-slate-400">Use ▲ ▼ controls to reorder</span>}
        </div>

        {images.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-1">
            <Images className="w-7 h-7 mx-auto text-slate-400" />
            <p className="text-xs font-semibold text-slate-700">No gallery images uploaded yet</p>
            <p className="text-[11px] text-slate-400">Upload multiple event photos above to showcase event highlights on the public website.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all"
              >
                {/* Image Container & Lightbox Trigger */}
                <div
                  className="aspect-[4/3] w-full relative bg-slate-900 cursor-pointer overflow-hidden group/img"
                >
                  <img
                    src={img.imagePath}
                    alt={`Gallery ${idx + 1}`}
                    onClick={() => setLightboxIndex(idx)}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                  />
                  <div 
                    onClick={() => setLightboxIndex(idx)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Eye className="w-6 h-6" />
                  </div>



                  {/* Direct Delete Overlay Button on Top-Right of Card */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all cursor-pointer z-10"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Controls */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1">
                  {/* Reorder Buttons */}
                  <div className="inline-flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30 cursor-pointer"
                      title="Move Left/Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30 cursor-pointer"
                      title="Move Right/Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions: Explicit Replace & Delete Buttons */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => triggerReplace(img.id)}
                      className="h-7 text-[11px] px-2 font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(img.id)}
                      className="h-7 text-[11px] px-2 font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 text-rose-600" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview Dialog */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
          <DialogContent className="max-w-4xl bg-black/95 border-none text-white p-4 shadow-2xl rounded-3xl">
            <div className="relative space-y-4 flex flex-col items-center">
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute -top-2 right-0 p-2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Main Image */}
              <div className="w-full aspect-[16/10] max-h-[70vh] relative overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center">
                <img
                  src={images[lightboxIndex].imagePath}
                  alt={`Preview ${lightboxIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Navigation Controls */}
              <div className="w-full flex items-center justify-between px-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={lightboxIndex === 0}
                  onClick={() => setLightboxIndex(lightboxIndex - 1)}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-300">
                    {lightboxIndex + 1} of {images.length}
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const curId = images[lightboxIndex].id;
                      setLightboxIndex(null);
                      handleDelete(curId);
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3 py-1 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Photo</span>
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={lightboxIndex === images.length - 1}
                  onClick={() => setLightboxIndex(lightboxIndex + 1)}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
