'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Check,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Search,
  Upload,
  Image as ImageIcon,
  ExternalLink,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface FacultyOption {
  id: string;
  name: string;
  designation?: string | null;
}

interface CentreData {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  website?: string | null;
  sortOrder?: number;
  faculties?: FacultyOption[];
  createdAt?: string;
}

export default function CentreManagementSection() {
  const [centres, setCentres] = useState<CentreData[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<CentreData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    imageFile: null as File | null,
    imageUrl: '',
    selectedFacultyIds: [] as string[],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reordering states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updatedList = [...centres];
    const [draggedItem] = updatedList.splice(draggedIndex, 1);
    updatedList.splice(targetIndex, 0, draggedItem);

    const itemsToUpdate = updatedList.map((item, idx) => ({
      id: item.id,
      sortOrder: idx + 1,
    }));

    setCentres(updatedList.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsReordering(true);

    try {
      const res = await fetch('/api/admin/centres/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      if (!res.ok) {
        throw new Error('Failed to update order');
      }

      setSuccessMsg('Centres reordered successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to reorder centres:', err);
      setError('Could not save reordered sequence. Reverting...');
      fetchData();
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveStep = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= centres.length) return;

    const updatedList = [...centres];
    const temp = updatedList[index];
    updatedList[index] = updatedList[targetIndex];
    updatedList[targetIndex] = temp;

    const itemsToUpdate = updatedList.map((item, idx) => ({
      id: item.id,
      sortOrder: idx + 1,
    }));

    setCentres(updatedList.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));
    setIsReordering(true);

    try {
      const res = await fetch('/api/admin/centres/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      if (!res.ok) throw new Error('Failed to save order');
      setSuccessMsg('Centres reordered successfully.');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      console.error('Failed to reorder centres:', err);
      fetchData();
    } finally {
      setIsReordering(false);
    }
  };

  // 1. Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [centresRes, facultyRes] = await Promise.all([
        fetch('/api/centres'),
        fetch('/api/public/faculty'),
      ]);

      if (centresRes.ok) {
        const data = await centresRes.json();
        setCentres(data || []);
      }

      if (facultyRes.ok) {
        const fData: FacultyOption[] = await facultyRes.json();
        setFacultyList(fData.map((f) => ({ id: f.id, name: f.name, designation: f.designation })));
      }
    } catch (err) {
      console.error('Failed to fetch centres or faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingCentre(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      imageFile: null,
      imageUrl: '',
      selectedFacultyIds: [],
    });
    setImagePreview(null);
    setRemoveCurrentImage(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (centre: CentreData) => {
    setEditingCentre(centre);
    setFormData({
      name: centre.name || '',
      description: centre.description || '',
      website: centre.website || '',
      imageFile: null,
      imageUrl: centre.image?.startsWith('http') ? centre.image : '',
      selectedFacultyIds: (centre.faculties || []).map((f) => f.id),
    });
    setImagePreview(centre.image || null);
    setRemoveCurrentImage(false);
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemoveCurrentImage(false);
      setFormData((prev) => ({ ...prev, imageFile: file, imageUrl: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageFile: null, imageUrl: '' }));
    setRemoveCurrentImage(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleFacultySelection = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selectedFacultyIds.includes(id);
      return {
        ...prev,
        selectedFacultyIds: exists
          ? prev.selectedFacultyIds.filter((item) => item !== id)
          : [...prev.selectedFacultyIds, id],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Centre Name is required.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Centre Description is required.');
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('description', formData.description.trim());
      data.append('website', formData.website.trim());

      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      } else if (removeCurrentImage) {
        data.append('removeImage', 'true');
      } else if (formData.imageUrl) {
        data.append('imageUrl', formData.imageUrl.trim());
      }

      data.append('facultyIds', JSON.stringify(formData.selectedFacultyIds));

      const isEdit = Boolean(editingCentre);
      const url = isEdit ? `/api/centres/${editingCentre?.id}` : '/api/centres';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to save associated centre.');
      }

      setSuccessMsg(isEdit ? 'Centre updated successfully.' : 'New centre created successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/centres/${deletingId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete centre');
      }

      setSuccessMsg('Centre removed successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
      setDeletingId(null);
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete associated centre.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCentres = centres.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.faculties || []).some((f) => f.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-oxford" />
            <span>Associated Centres</span>
            <Badge variant="secondary" className="ml-2 font-mono text-xs">
              {centres.length} Centres
            </Badge>
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-sans">
            Add, update, or remove interdisciplinary research centres, institutes, and assign faculty coordinators.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            className="h-10 w-10 text-slate-700 hover:text-slate-950"
            title="Refresh Centres"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            onClick={openCreateModal}
            className="bg-oxford hover:bg-slate-800 text-white font-sans text-sm h-10 px-4 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Centre</span>
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-sm font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 text-sm font-sans">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Drag Reorder Guidance */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by centre name or in-charge faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 text-base h-12 w-full"
          />
        </div>
        {!searchTerm && centres.length > 1 && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 border border-indigo-200/80 rounded-xl text-indigo-800 text-xs font-sans font-medium whitespace-nowrap shadow-xs">
            <GripVertical className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Drag rows to reorder public ranking</span>
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-3.5 px-6">
          <CardTitle className="text-base font-serif font-bold text-slate-800 flex items-center justify-between">
            <span>Associated Research Centres &amp; Institutes</span>
            <span className="text-xs text-slate-400 font-mono font-normal">
              {filteredCentres.length} listed
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 mx-auto animate-spin text-oxford" />
              <p className="text-xs">Loading associated centres...</p>
            </div>
          ) : filteredCentres.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-800">No Centres Recorded Yet</p>
              <p className="text-xs text-slate-400">Click &quot;Add Centre&quot; to create your first centre entry.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 bg-slate-50/40 text-slate-600 text-xs">
                  <TableHead className="w-28">Order</TableHead>
                  <TableHead className="w-20">Cover</TableHead>
                  <TableHead>Centre Details</TableHead>
                  <TableHead className="w-56">Faculty In-Charge</TableHead>
                  <TableHead className="w-32 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCentres.map((centre, idx) => {
                  const isDragging = draggedIndex === idx;
                  const isDragOver = dragOverIndex === idx && draggedIndex !== idx;

                  return (
                    <TableRow
                      key={centre.id}
                      draggable={!searchTerm}
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`border-b border-slate-100 transition-all duration-200 select-none ${
                        isDragging
                          ? 'opacity-30 bg-slate-200 scale-[0.99] border-2 border-dashed border-oxford'
                          : isDragOver
                          ? 'border-t-4 border-oxford bg-oxford/10 shadow-lg'
                          : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1 rounded transition-colors ${
                              searchTerm
                                ? 'opacity-30 cursor-not-allowed text-slate-300'
                                : 'cursor-grab active:cursor-grabbing text-slate-400 hover:text-oxford hover:bg-slate-200/60'
                            }`}
                            title={searchTerm ? 'Clear search filter to reorder' : 'Drag to reorder centre'}
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>

                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-2xs">
                            #{idx + 1}
                          </span>

                          {!searchTerm && (
                            <div className="flex flex-col -space-y-0.5 ml-1">
                              <button
                                type="button"
                                disabled={idx === 0 || isReordering}
                                onClick={() => handleMoveStep(idx, 'up')}
                                className="p-0.5 text-slate-400 hover:text-oxford disabled:opacity-20 cursor-pointer"
                                title="Move Up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === filteredCentres.length - 1 || isReordering}
                                onClick={() => handleMoveStep(idx, 'down')}
                                className="p-0.5 text-slate-400 hover:text-oxford disabled:opacity-20 cursor-pointer"
                                title="Move Down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {centre.image ? (
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={centre.image}
                              alt={centre.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <Building2 className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 text-sm hover:text-cyan-accent transition-colors">
                            {centre.name}
                          </div>
                          {centre.website && (
                            <a
                              href={centre.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-cyan-accent hover:underline"
                            >
                              <span>External Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="space-y-1.5">
                          {centre.faculties && centre.faculties.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {centre.faculties.map((f) => (
                                <span
                                  key={f.id}
                                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                                >
                                  {f.name}
                                </span>
                              ))}
                            </div>
                          )}
                          {(!centre.faculties || centre.faculties.length === 0) && (
                            <span className="text-slate-400 italic text-xs">None assigned</span>
                          )}
                        </div>
                      </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/centres/${centre.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-cyan-accent hover:bg-slate-100 rounded-md transition-colors"
                          title="View Live Page"
                        >
                          <Eye className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => openEditModal(centre)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Edit Centre"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(centre.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Centre"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* CREATE / EDIT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-sans">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Building2 className="w-5 h-5 text-oxford" />
              <span>{editingCentre ? 'Edit Associated Centre' : 'Create New Associated Centre'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 pt-2">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Centre Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Centre for Advanced Materials &amp; Nanotechnology"
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">External Website / Portal (Optional)</label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://centre.cusat.ac.in"
                  className="bg-white border-slate-200"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Cover Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {imagePreview ? (
                  <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-rose-600 text-white p-1.5 rounded-lg transition-colors cursor-pointer shadow-md"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-40 h-28 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 shrink-0">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">No Image</span>
                  </div>
                )}

                <div className="flex-1 space-y-2.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="centre-image-upload"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs h-9 font-semibold text-oxford border-slate-300 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imagePreview ? 'Change Photo' : 'Upload Image File (WebP, JPG, PNG)'}</span>
                    </Button>

                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemovePhoto}
                        className="text-xs h-9 font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Max size: 10MB. Images are automatically optimized and converted to WebP.
                  </p>
                </div>
              </div>
            </div>

            {/* Description (Markdown) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Centre Description (Markdown Supported) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Use **bold**, lists, headers</span>
              </div>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="### Overview&#10;Describe the centre's mandate, research areas, infrastructure, and ongoing activities..."
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-oxford"
              />
            </div>

            {/* Assign Faculty In-Charge */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Assign Faculty In-Charge / Coordinators</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {formData.selectedFacultyIds.length} selected
                </span>
              </label>
              <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50/50">
                {facultyList.map((fac) => {
                  const isChecked = formData.selectedFacultyIds.includes(fac.id);
                  return (
                    <button
                      type="button"
                      key={fac.id}
                      onClick={() => toggleFacultySelection(fac.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors text-xs cursor-pointer ${
                        isChecked
                          ? 'bg-oxford text-white font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-100'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'border-white bg-white text-oxford' : 'border-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{fac.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-oxford hover:bg-slate-800 text-white text-xs h-9 px-4"
              >
                {saving ? 'Saving...' : editingCentre ? 'Update Centre' : 'Create Centre'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={Boolean(deletingId)} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-sans">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2 text-rose-600">
              <Trash2 className="w-5 h-5" />
              <span>Delete Associated Centre</span>
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-600 py-2">
            Are you sure you want to delete this centre? This will permanently remove the centre details, uploaded cover image, and faculty coordinator associations.
          </p>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingId(null)}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 px-4"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
