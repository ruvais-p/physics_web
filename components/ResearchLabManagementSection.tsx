'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Check,
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

interface FacultyOption {
  id: string;
  name: string;
  designation?: string | null;
}

interface ResearchLabData {
  id: string;
  name: string;
  category?: string | null;
  description: string;
  image?: string | null;
  faculties?: FacultyOption[];
  createdAt?: string;
}

export default function ResearchLabManagementSection() {
  const [labs, setLabs] = useState<ResearchLabData[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<ResearchLabData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Experimental',
    description: '',
    imageFile: null as File | null,
    imageUrl: '',
    selectedFacultyIds: [] as string[],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [labsRes, facultyRes] = await Promise.all([
        fetch('/api/research'),
        fetch('/api/public/faculty'),
      ]);

      if (labsRes.ok) {
        const data = await labsRes.json();
        setLabs(data || []);
      }

      if (facultyRes.ok) {
        const fData = await facultyRes.json();
        setFacultyList(fData.map((f: any) => ({ id: f.id, name: f.name, designation: f.designation })));
      }
    } catch (err) {
      console.error('Failed to fetch research labs or faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setError(null);
    setEditingLab(null);
    setFormData({
      name: '',
      category: 'Experimental',
      description: '# Laboratory Overview\n\nEnter detailed research objectives, experimental capabilities, and equipment details using Markdown...',
      imageFile: null,
      imageUrl: '',
      selectedFacultyIds: [],
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (labItem: ResearchLabData) => {
    setError(null);
    setEditingLab(labItem);
    setFormData({
      name: labItem.name || '',
      category: labItem.category || 'Experimental',
      description: labItem.description || '',
      imageFile: null,
      imageUrl: labItem.image || '',
      selectedFacultyIds: labItem.faculties ? labItem.faculties.map((f) => f.id) : [],
    });
    setImagePreview(labItem.image || null);
    setIsModalOpen(true);
  };

  const toggleFacultySelection = (facultyId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedFacultyIds.includes(facultyId);
      if (exists) {
        return {
          ...prev,
          selectedFacultyIds: prev.selectedFacultyIds.filter((id) => id !== facultyId),
        };
      } else {
        return {
          ...prev,
          selectedFacultyIds: [...prev.selectedFacultyIds, facultyId],
        };
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!formData.name.trim()) {
      setError('Laboratory Name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Laboratory Description is required');
      return;
    }

    setSaving(true);

    try {
      const isEdit = !!editingLab;
      const url = isEdit ? `/api/research/${editingLab.id}` : '/api/research';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('category', formData.category.trim());
      payload.append('description', formData.description.trim());
      payload.append('facultyIds', JSON.stringify(formData.selectedFacultyIds));

      if (formData.imageFile) {
        payload.append('image', formData.imageFile);
      } else if (formData.imageUrl) {
        payload.append('imageUrl', formData.imageUrl.trim());
      }

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save laboratory record.');
        return;
      }

      setSuccessMsg(isEdit ? 'Research laboratory updated successfully!' : 'New research laboratory created!');
      setIsModalOpen(false);
      await fetchData();

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Error saving laboratory:', err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/research/${deletingId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg('Laboratory deleted successfully.');
        setDeletingId(null);
        await fetchData();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete laboratory.');
      }
    } catch (err) {
      console.error('Failed to delete lab:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-oxford" />
            <span>Research Laboratories</span>
            <Badge variant="outline" className="ml-2 font-mono text-xs border-oxford text-oxford">
              {labs.length} Labs
            </Badge>
          </h2>
          <p className="text-slate-600 text-base mt-1">
            Create, update, and manage research laboratories, Markdown descriptions, hero images, and associated faculty members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            className="h-11 w-11 text-slate-700 hover:text-slate-950"
            title="Refresh Labs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="default"
            onClick={openAddModal}
            className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Laboratory</span>
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Laboratories Table / Grid Card */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <span>Department Research Laboratories</span>
            <Badge variant="outline" className="border-oxford/30 text-oxford text-xs ml-1 font-mono">
              {labs.length} Laboratories
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-oxford" />
              <p className="text-xs">Loading research laboratories...</p>
            </div>
          ) : labs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <FlaskConical className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-800">No Research Laboratories found</p>
              <Button
                onClick={openAddModal}
                variant="default"
                size="sm"
                className="mt-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add First Laboratory
              </Button>
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-24">Hero Image</TableHead>
                  <TableHead className="font-bold">Laboratory Name & Category</TableHead>
                  <TableHead className="font-bold">Associated Faculty</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labs.map((lab) => (
                  <TableRow key={lab.id} className="hover:bg-slate-50/40">
                    <TableCell className="py-4">
                      <div className="w-16 h-11 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 relative shrink-0">
                        <img
                          src={lab.image || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80'}
                          alt={lab.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-bold text-slate-900 text-base font-serif">{lab.name}</div>
                      <div className="text-xs text-cyan-dark font-mono font-medium mt-0.5">{lab.category || 'Experimental'}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      {lab.faculties && lab.faculties.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {lab.faculties.map((f) => (
                            <span
                              key={f.id}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                            >
                              {f.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">No faculty assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <a
                        href={`/research/${lab.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Page
                      </a>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => openEditModal(lab)}
                        className="h-9 w-9 text-slate-600 hover:text-slate-900"
                        title="Edit Laboratory"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeletingId(lab.id)}
                        className="h-9 w-9"
                        title="Delete Laboratory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Laboratory Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white border border-slate-200 text-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl shadow-2xl">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-oxford" />
              <span>{editingLab ? 'Edit Research Laboratory' : 'Add New Research Laboratory'}</span>
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">
                  Laboratory Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Quantum Optics & Photonics Lab"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-base font-serif"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">
                  Research Category
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Materials Science / Photonics / Theoretical"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="text-sm font-sans"
                />
              </div>
            </div>

            {/* Cover / Hero Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">
                Hero Image File OR Image URL
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      setFormData({ ...formData, imageFile: file, imageUrl: '' });
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-oxford file:text-white hover:file:bg-slate-800 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest font-mono">OR Direct Image URL</div>
                <Input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value, imageFile: null });
                    setImagePreview(e.target.value);
                  }}
                  className="text-xs font-mono"
                />
              </div>

              {imagePreview && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
                  <img src={imagePreview} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Markdown Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Full Description (Markdown Supported) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={8}
                placeholder="Write laboratory research themes, key equipment, outcomes using Markdown..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                required
              />
            </div>

            {/* Associated Faculty Members */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Associated Faculty Members
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto space-y-1.5">
                {facultyList.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No faculty members found in database.</p>
                ) : (
                  facultyList.map((fac) => {
                    const isSelected = formData.selectedFacultyIds.includes(fac.id);
                    return (
                      <button
                        key={fac.id}
                        type="button"
                        onClick={() => toggleFacultySelection(fac.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-oxford text-white border border-oxford shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span>{fac.name} ({fac.designation || 'Faculty'})</span>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
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
                ) : editingLab ? (
                  'Save Changes'
                ) : (
                  'Create Laboratory'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Laboratory Deletion</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete this research laboratory? This action cannot be undone.
          </p>
          <DialogFooter className="pt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Laboratory'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
