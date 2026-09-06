'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
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

interface FacilityData {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  faculties?: FacultyOption[];
  createdAt?: string;
}

export default function FacilityManagementSection() {
  const [facilities, setFacilities] = useState<FacilityData[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
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
      const [facilitiesRes, facultyRes] = await Promise.all([
        fetch('/api/facilities'),
        fetch('/api/public/faculty'),
      ]);

      if (facilitiesRes.ok) {
        const data = await facilitiesRes.json();
        setFacilities(data || []);
      }

      if (facultyRes.ok) {
        const fData = await facultyRes.json();
        setFacultyList(fData.map((f: any) => ({ id: f.id, name: f.name, designation: f.designation })));
      }
    } catch (err) {
      console.error('Failed to fetch facilities or faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setError(null);
    setEditingFacility(null);
    setFormData({
      name: '',
      description: '# Facility Specifications\n\nEnter instrumentation specifications, operating guidelines, user booking procedures, and capabilities using Markdown...',
      imageFile: null,
      imageUrl: '',
      selectedFacultyIds: [],
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (facItem: FacilityData) => {
    setError(null);
    setEditingFacility(facItem);
    setFormData({
      name: facItem.name || '',
      description: facItem.description || '',
      imageFile: null,
      imageUrl: facItem.image || '',
      selectedFacultyIds: facItem.faculties ? facItem.faculties.map((f) => f.id) : [],
    });
    setImagePreview(facItem.image || null);
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
      setError('Facility Name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Facility Description is required');
      return;
    }

    setSaving(true);

    try {
      const isEdit = !!editingFacility;
      const url = isEdit ? `/api/facilities/${editingFacility.id}` : '/api/facilities';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = new FormData();
      payload.append('name', formData.name.trim());
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
        setError(data.error || 'Failed to save facility record.');
        return;
      }

      setSuccessMsg(isEdit ? 'Central facility updated successfully!' : 'New central facility added!');
      setIsModalOpen(false);
      await fetchData();

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Error saving facility:', err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/facilities/${deletingId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg('Facility record deleted successfully.');
        setDeletingId(null);
        await fetchData();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete facility.');
      }
    } catch (err) {
      console.error('Failed to delete facility:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none font-sans">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <Wrench className="w-7 h-7 text-oxford" />
            <span>Central Facilities</span>
            <Badge variant="outline" className="ml-2 font-mono text-xs border-oxford text-oxford">
              {facilities.length} Facilities
            </Badge>
          </h2>
          <p className="text-slate-600 text-base mt-1">
            Add, update, or remove central research instrumentation facilities, technical specifications, hero images, and faculty in-charge assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            className="h-11 w-11 text-slate-700 hover:text-slate-950"
            title="Refresh Facilities"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="default"
            onClick={openAddModal}
            className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Facility</span>
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-semibold animate-fadeIn font-sans">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Facilities Table Card */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden font-sans">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <span>Department Facilities & Instrumentation</span>
            <Badge variant="outline" className="border-oxford/30 text-oxford text-xs ml-1 font-mono">
              {facilities.length} Facilities
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-oxford" />
              <p className="text-xs">Loading central facilities...</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Wrench className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-800">No Facilities recorded yet</p>
              <Button
                onClick={openAddModal}
                variant="default"
                size="sm"
                className="mt-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add First Facility
              </Button>
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-24">Facility Image</TableHead>
                  <TableHead className="font-bold">Facility Name</TableHead>
                  <TableHead className="font-bold">Faculty In-Charge / Team</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.map((facItem) => (
                  <TableRow key={facItem.id} className="hover:bg-slate-50/40">
                    <TableCell className="py-4">
                      <div className="w-16 h-11 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 relative shrink-0">
                        <img
                          src={facItem.image || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80'}
                          alt={facItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-bold text-slate-900 text-base font-serif">{facItem.name}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      {facItem.faculties && facItem.faculties.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {facItem.faculties.map((f) => (
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
                        href="/facilities"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Public Page
                      </a>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => openEditModal(facItem)}
                        className="h-9 w-9 text-slate-600 hover:text-slate-900"
                        title="Edit Facility"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeletingId(facItem.id)}
                        className="h-9 w-9"
                        title="Delete Facility"
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

      {/* Add / Edit Facility Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white border border-slate-200 text-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl shadow-2xl font-sans">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-oxford" />
              <span>{editingFacility ? 'Edit Central Facility' : 'Add New Central Facility'}</span>
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5 pt-3">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Facility Name <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Vibrating Sample Magnetometer (VSM) System"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-base font-serif"
                required
              />
            </div>

            {/* Cover / Hero Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">
                Facility Image File OR Image URL
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
                  <img src={imagePreview} alt="Facility Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Markdown Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Technical Description & Operating Specifications (Markdown Supported) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={8}
                placeholder="Write facility specifications, measurement ranges, operating guidelines, and booking info using Markdown..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                required
              />
            </div>

            {/* Associated Faculty Members */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">
                Faculty In-Charge / Associated Faculty
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
                ) : editingFacility ? (
                  'Save Changes'
                ) : (
                  'Create Facility'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-sans">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Facility Deletion</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete this central facility record? This action cannot be undone.
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
              {isDeleting ? 'Deleting...' : 'Delete Facility'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
