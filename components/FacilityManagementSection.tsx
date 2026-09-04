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
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="bg-slate-900 border-slate-800 text-white shadow-xl overflow-hidden relative font-sans">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="relative z-10 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2.5">
              <Wrench className="w-6 h-6 text-cyan-400" />
              Central Instrumentation Facilities Management
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm font-sans">
              Add, update, or remove central research instrumentation facilities, technical specifications, hero images, and faculty in-charge assignments.
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={openAddModal}
              size="sm"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-md"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Facility
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-sans">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Facilities Table Card */}
      <Card className="bg-slate-900/90 border-slate-800 text-white shadow-xl font-sans">
        <CardHeader className="pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-200 flex items-center gap-2">
              <span>Department Facilities</span>
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs font-mono">
                {facilities.length} Facilities
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-cyan-400" />
              <p className="text-xs">Loading central facilities...</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Wrench className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No Facilities recorded yet</p>
              <Button
                onClick={openAddModal}
                size="sm"
                className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add First Facility
              </Button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Facility Image</th>
                  <th className="px-6 py-3.5">Facility Name</th>
                  <th className="px-6 py-3.5">Faculty In-Charge / Team</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {facilities.map((facItem) => (
                  <tr key={facItem.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-11 rounded-lg bg-slate-950 overflow-hidden border border-slate-700/60 relative">
                        <img
                          src={facItem.image || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80'}
                          alt={facItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm sm:text-base font-serif">{facItem.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {facItem.faculties && facItem.faculties.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {facItem.faculties.map((f) => (
                            <span
                              key={f.id}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                            >
                              {f.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-xs">No faculty assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <a
                        href="/facilities"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Public Page
                      </a>
                      <Button
                        onClick={() => openEditModal(facItem)}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        onClick={() => setDeletingId(facItem.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Facility Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              {editingFacility ? 'Edit Central Facility' : 'Add New Central Facility'}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Facility Name <span className="text-rose-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Vibrating Sample Magnetometer (VSM) System"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-xs sm:text-sm font-serif"
              />
            </div>

            {/* Cover / Hero Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Facility Image File OR Image URL
              </label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      setFormData({ ...formData, imageFile: file, imageUrl: '' });
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="bg-slate-950 border-slate-800 text-slate-300 text-xs file:bg-cyan-500 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:cursor-pointer hover:file:bg-cyan-600"
                />
                <div className="text-[11px] text-slate-400 text-center font-bold">OR</div>
                <Input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value, imageFile: null });
                    setImagePreview(e.target.value);
                  }}
                  className="bg-slate-950 border-slate-800 text-slate-100 text-xs font-mono"
                />
              </div>

              {imagePreview && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mt-2">
                  <img src={imagePreview} alt="Facility Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Markdown Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Technical Description & Operating Specifications (Markdown Supported) <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={8}
                placeholder="Write facility specifications, measurement ranges, operating guidelines, and booking info using Markdown..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
              />
            </div>

            {/* Associated Faculty Members (Many-to-Many Multi Select) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Faculty In-Charge / Associated Faculty (Many-to-Many Relationship)
              </label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-40 overflow-y-auto space-y-1.5">
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
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-transparent'
                        }`}
                      >
                        <span>{fac.name} ({fac.designation || 'Faculty'})</span>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Facility'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-sm font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Confirm Facility Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to delete this central facility record?
          </p>
          <DialogFooter className="pt-3 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={() => setDeletingId(null)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              {isDeleting ? 'Deleting...' : 'Delete Facility'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
