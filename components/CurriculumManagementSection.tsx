'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  FileText,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Layers,
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

interface SchemeItem {
  id: string;
  courseId: string;
  year: string;
  scheme: string;
  pdfUrl: string;
  sortOrder: number;
  updatedAt?: string;
}

interface CourseItem {
  id: string;
  title: string;
  code: string;
  level: string;
  schemes: SchemeItem[];
}

export default function CurriculumManagementSection() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('c1');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<SchemeItem | null>(null);
  const [formData, setFormData] = useState({
    year: '',
    scheme: '',
    pdfFile: null as File | null,
    pdfUrl: '',
    sortOrder: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCoursesAndSchemes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses/schemes');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Failed to fetch courses and schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndSchemes();
  }, []);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const openAddModal = () => {
    setError(null);
    setEditingScheme(null);
    const existingCount = currentCourse?.schemes?.length || 0;
    setFormData({
      year: '',
      scheme: '',
      pdfFile: null,
      pdfUrl: '',
      sortOrder: existingCount + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (schemeItem: SchemeItem) => {
    setError(null);
    setEditingScheme(schemeItem);
    setFormData({
      year: schemeItem.year,
      scheme: schemeItem.scheme,
      pdfFile: null,
      pdfUrl: schemeItem.pdfUrl || '',
      sortOrder: schemeItem.sortOrder || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!formData.year.trim()) {
      setError('Year / Level title is required (e.g., First Year)');
      return;
    }
    if (!formData.scheme.trim()) {
      setError('Curriculum Scheme name is required (e.g., 2024 CBCS Scheme)');
      return;
    }

    setSaving(true);

    try {
      const isEdit = !!editingScheme;
      const url = isEdit ? `/api/courses/schemes/${editingScheme.id}` : '/api/courses/schemes';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = new FormData();
      if (!isEdit) {
        payload.append('courseId', selectedCourseId);
      }
      payload.append('year', formData.year.trim());
      payload.append('scheme', formData.scheme.trim());
      payload.append('sortOrder', formData.sortOrder.toString());

      if (formData.pdfFile) {
        payload.append('pdf', formData.pdfFile);
      } else if (formData.pdfUrl) {
        payload.append('pdfUrl', formData.pdfUrl.trim());
      }

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save curriculum scheme record.');
        return;
      }

      setSuccessMsg(isEdit ? 'Curriculum scheme updated successfully!' : 'New curriculum scheme added!');
      setIsModalOpen(false);
      await fetchCoursesAndSchemes();

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Error saving scheme:', err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/courses/schemes/${deletingId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg('Scheme deleted successfully.');
        setDeletingId(null);
        await fetchCoursesAndSchemes();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete scheme.');
      }
    } catch (err) {
      console.error('Failed to delete scheme:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="bg-slate-900 border-slate-800 text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="relative z-10 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              Curriculum Schemes & Regulations Management
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              Add, update, or replace syllabus PDFs and regulation guidelines displayed on the public Courses page.
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <Button
              onClick={fetchCoursesAndSchemes}
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
              Add Scheme
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          {/* Success Banner */}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Program Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'c1', label: 'M.Sc. Physics', code: 'PHY-MSC-101' },
              { id: 'c2', label: 'Ph.D. Program', code: 'PHY-PHD-900' },
              { id: 'c3', label: 'Integrated M.Sc.', code: 'PHY-INT-501' },
            ].map((program) => {
              const isActive = selectedCourseId === program.id;
              return (
                <button
                  key={program.id}
                  onClick={() => setSelectedCourseId(program.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  {program.label}
                  <span className="text-[10px] opacity-75 font-mono">({program.code})</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Schemes List Table Card */}
      <Card className="bg-slate-900/90 border-slate-800 text-white shadow-xl">
        <CardHeader className="pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-200 flex items-center gap-2">
              <span>Schemes for {currentCourse?.title || selectedCourseId}</span>
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                {currentCourse?.schemes?.length || 0} Entries
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-cyan-400" />
              <p className="text-xs">Loading curriculum schemes...</p>
            </div>
          ) : !currentCourse?.schemes || currentCourse.schemes.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No Curriculum Schemes added yet</p>
              <p className="text-xs text-slate-500">
                Click "Add Scheme" above to attach a regulation scheme or syllabus PDF.
              </p>
              <Button
                onClick={openAddModal}
                size="sm"
                className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add First Scheme
              </Button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Year / Level</th>
                  <th className="px-6 py-3.5">Scheme & Regulations</th>
                  <th className="px-6 py-3.5">Syllabus PDF Document</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentCourse.schemes.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-400">{item.sortOrder || idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-white">{item.year}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {item.scheme}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.pdfUrl ? (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 hover:underline text-xs font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View PDF Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500 italic text-xs">No PDF uploaded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        onClick={() => openEditModal(item)}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        onClick={() => setDeletingId(item.id)}
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

      {/* Add / Edit Scheme Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              {editingScheme ? 'Edit Curriculum Scheme' : 'Add New Curriculum Scheme'}
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
                Year / Level Label <span className="text-rose-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. First Year (Semesters 1 & 2)"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Scheme / Regulation Title <span className="text-rose-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 2024 CBCS Scheme or 2024 PhD Regulations"
                value={formData.scheme}
                onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Upload Syllabus PDF Document
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, pdfFile: file });
                  }}
                  className="bg-slate-950 border-slate-800 text-slate-300 text-xs file:bg-cyan-500 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:cursor-pointer hover:file:bg-cyan-600"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Accepted format: PDF only (Max 15 MB)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Sort Order
              </label>
              <Input
                type="number"
                min="1"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 1 })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-xs sm:text-sm"
              />
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
                  'Save Scheme'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Confirm Scheme Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to delete this curriculum scheme? Any attached PDF file will also be removed from disk.
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
              {isDeleting ? 'Deleting...' : 'Delete Scheme'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
