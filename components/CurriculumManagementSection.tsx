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
  GraduationCap,
  FileCheck2,
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
  code?: string;
  level: string;
  duration: string;
  eligibility?: string;
  description: string;
  highlights?: string[];
  schemes: SchemeItem[];
}

export default function CurriculumManagementSection() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('c1');

  // Course Modal state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    id: '',
    title: '',
    level: 'MSc',
    duration: '',
    eligibility: '',
    description: '',
  });
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);

  // Scheme Modal state
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<SchemeItem | null>(null);
  const [schemeFormData, setSchemeFormData] = useState({
    year: '',
    scheme: '',
    pdfFile: null as File | null,
    pdfUrl: '',
    sortOrder: 1,
  });
  const [savingScheme, setSavingScheme] = useState(false);
  const [schemeError, setSchemeError] = useState<string | null>(null);

  // Delete states
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);
  const [deletingSchemeId, setDeletingSchemeId] = useState<string | null>(null);
  const [isDeletingScheme, setIsDeletingScheme] = useState(false);

  // Global success alert
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCoursesAndSchemes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        const loadedCourses = data.courses || [];
        setCourses(loadedCourses);
        if (loadedCourses.length > 0 && !loadedCourses.some((c: CourseItem) => c.id === selectedCourseId)) {
          setSelectedCourseId(loadedCourses[0].id);
        }
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

  // ------------------------------------------------------------------
  // COURSE MODAL HANDLERS
  // ------------------------------------------------------------------
  const openAddCourseModal = () => {
    setCourseError(null);
    setEditingCourse(null);
    setCourseFormData({
      id: '',
      title: '',
      level: 'MSc',
      duration: '2 Years (4 Semesters)',
      eligibility: '',
      description: '',
    });
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course: CourseItem) => {
    setCourseError(null);
    setEditingCourse(course);
    setCourseFormData({
      id: course.id,
      title: course.title,
      level: course.level || 'MSc',
      duration: course.duration,
      eligibility: course.eligibility || '',
      description: course.description || '',
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseError(null);

    if (!courseFormData.title.trim()) {
      setCourseError('Course Title is required (e.g. Master of Science in Physics)');
      return;
    }
    if (!courseFormData.duration.trim()) {
      setCourseError('Duration is required (e.g. 2 Years (4 Semesters))');
      return;
    }
    if (!courseFormData.description.trim()) {
      setCourseError('Course Description / Overview is required.');
      return;
    }

    setSavingCourse(true);

    try {
      const isEdit = !!editingCourse;
      const url = isEdit ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: courseFormData.id.trim() || undefined,
          title: courseFormData.title.trim(),
          level: courseFormData.level.trim(),
          duration: courseFormData.duration.trim(),
          eligibility: courseFormData.eligibility.trim(),
          description: courseFormData.description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCourseError(data.error || 'Failed to save course.');
        return;
      }

      setSuccessMsg(isEdit ? 'Course details updated successfully!' : 'New course created successfully!');
      setIsCourseModalOpen(false);
      await fetchCoursesAndSchemes();
      if (data.course?.id) {
        setSelectedCourseId(data.course.id);
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Error saving course:', err);
      setCourseError('An unexpected network error occurred while saving.');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourseId) return;
    setIsDeletingCourse(true);
    try {
      const res = await fetch(`/api/courses/${deletingCourseId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg('Course deleted successfully.');
        setDeletingCourseId(null);
        await fetchCoursesAndSchemes();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete course.');
      }
    } catch (err) {
      console.error('Failed to delete course:', err);
    } finally {
      setIsDeletingCourse(false);
    }
  };

  // ------------------------------------------------------------------
  // SCHEME MODAL HANDLERS
  // ------------------------------------------------------------------
  const openAddSchemeModal = () => {
    setSchemeError(null);
    setEditingScheme(null);
    const existingCount = currentCourse?.schemes?.length || 0;
    setSchemeFormData({
      year: '',
      scheme: '',
      pdfFile: null,
      pdfUrl: '',
      sortOrder: existingCount + 1,
    });
    setIsSchemeModalOpen(true);
  };

  const openEditSchemeModal = (schemeItem: SchemeItem) => {
    setSchemeError(null);
    setEditingScheme(schemeItem);
    setSchemeFormData({
      year: schemeItem.year,
      scheme: schemeItem.scheme,
      pdfFile: null,
      pdfUrl: schemeItem.pdfUrl || '',
      sortOrder: schemeItem.sortOrder || 1,
    });
    setIsSchemeModalOpen(true);
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchemeError(null);

    if (!schemeFormData.year.trim()) {
      setSchemeError('Year / Level title is required (e.g. First Year / Semesters 1 & 2)');
      return;
    }
    if (!schemeFormData.scheme.trim()) {
      setSchemeError('Curriculum Scheme name is required (e.g. 2024 CBCS Scheme)');
      return;
    }

    setSavingScheme(true);

    try {
      const isEdit = !!editingScheme;
      const url = isEdit ? `/api/courses/schemes/${editingScheme.id}` : '/api/courses/schemes';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = new FormData();
      if (!isEdit) {
        payload.append('courseId', selectedCourseId);
      }
      payload.append('year', schemeFormData.year.trim());
      payload.append('scheme', schemeFormData.scheme.trim());
      payload.append('sortOrder', schemeFormData.sortOrder.toString());

      if (schemeFormData.pdfFile) {
        payload.append('pdf', schemeFormData.pdfFile);
      } else if (schemeFormData.pdfUrl) {
        payload.append('pdfUrl', schemeFormData.pdfUrl.trim());
      }

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setSchemeError(data.error || 'Failed to save curriculum scheme record.');
        return;
      }

      setSuccessMsg(isEdit ? 'Curriculum scheme updated successfully!' : 'New curriculum scheme attached!');
      setIsSchemeModalOpen(false);
      await fetchCoursesAndSchemes();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Error saving scheme:', err);
      setSchemeError('An unexpected error occurred while saving.');
    } finally {
      setSavingScheme(false);
    }
  };

  const handleDeleteScheme = async () => {
    if (!deletingSchemeId) return;
    setIsDeletingScheme(true);
    try {
      const res = await fetch(`/api/courses/schemes/${deletingSchemeId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg('Scheme deleted successfully.');
        setDeletingSchemeId(null);
        await fetchCoursesAndSchemes();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete scheme.');
      }
    } catch (err) {
      console.error('Failed to delete scheme:', err);
    } finally {
      setIsDeletingScheme(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header Card / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-oxford" />
            <span>Academic Courses & Curriculum</span>
            <Badge variant="outline" className="ml-2 font-mono text-xs border-oxford text-oxford">
              {courses.length} Courses
            </Badge>
          </h2>
          <p className="text-slate-600 text-base mt-1">
            Add and edit course titles, descriptions, eligibility criteria, and upload official syllabus & regulation PDFs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCoursesAndSchemes}
            className="h-11 w-11 text-slate-700 hover:text-slate-950"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="default"
            onClick={openAddCourseModal}
            className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </Button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Dynamic Course Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 pt-1">
        {courses.map((course) => {
          const isActive = selectedCourseId === course.id;
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => setSelectedCourseId(course.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-oxford text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{course.title || course.id}</span>
            </button>
          );
        })}
      </div>

      {/* Course Overview & Description Card */}
      {currentCourse && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  {currentCourse.title}
                </h2>
                <Badge variant="secondary" className="text-xs font-semibold text-slate-700">
                  {currentCourse.level}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Duration: {currentCourse.duration}</span>
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-slate-400">
                  ID: {currentCourse.id}
                </span>
              </div>
            </div>

            {/* Course Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditCourseModal(currentCourse)}
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold border-slate-300 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-4 h-4 text-slate-600" />
                <span>Edit Course Details</span>
              </Button>
              {courses.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingCourseId(currentCourse.id)}
                  className="text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Course</span>
                </Button>
              )}
            </div>
          </div>

          {/* Description Content */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Course Description &amp; Overview
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              {currentCourse.description || 'No description provided yet. Click "Edit Course Details" to add a comprehensive overview.'}
            </p>
          </div>

          {/* Eligibility Criteria */}
          {currentCourse.eligibility && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Admission / Minimum Eligibility Criteria
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-amber-50/40 p-4 rounded-xl border border-amber-200/50">
                {currentCourse.eligibility}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Curriculum Schemes & Syllabus Table */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-oxford" />
              <span>Curriculum Schemes &amp; Syllabus PDFs</span>
              <Badge variant="outline" className="border-oxford/30 text-oxford text-xs ml-1 font-mono">
                {currentCourse?.schemes?.length || 0} Entries
              </Badge>
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs sm:text-sm">
              Upload, link, and organize the regulation schemes and syllabus PDFs for {currentCourse?.title || selectedCourseId}.
            </CardDescription>
          </div>
          <Button
            variant="default"
            onClick={openAddSchemeModal}
            size="sm"
            className="mt-3 sm:mt-0 flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Scheme / Syllabus PDF
          </Button>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-oxford" />
              <p className="text-xs">Loading curriculum schemes...</p>
            </div>
          ) : !currentCourse?.schemes || currentCourse.schemes.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-800">No Curriculum Schemes added yet</p>
              <p className="text-xs text-slate-500">
                Click "Add Scheme / Syllabus PDF" to attach regulation schemes or syllabus documents.
              </p>
              <Button
                onClick={openAddSchemeModal}
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add First Scheme
              </Button>
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-16">Sort</TableHead>
                  <TableHead className="font-bold">Year / Level</TableHead>
                  <TableHead className="font-bold">Curriculum Scheme Title</TableHead>
                  <TableHead className="font-bold">Syllabus PDF Document</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCourse.schemes.map((schemeItem, idx) => (
                  <TableRow key={schemeItem.id} className="hover:bg-slate-50/40">
                    <TableCell className="font-mono text-slate-500 font-bold py-4">
                      #{schemeItem.sortOrder ?? idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 py-4">
                      {schemeItem.year}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-cyan-700 border border-sky-200">
                        {schemeItem.scheme}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {schemeItem.pdfUrl ? (
                        <a
                          href={schemeItem.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-cyan-accent hover:underline font-medium max-w-[200px] truncate"
                          title={schemeItem.pdfUrl}
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="truncate">{schemeItem.pdfUrl.split('/').pop()}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No PDF attached</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap py-4">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => openEditSchemeModal(schemeItem)}
                        className="h-9 w-9 text-slate-600 hover:text-slate-900"
                        title="Edit Scheme"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeletingSchemeId(schemeItem.id)}
                        className="h-9 w-9"
                        title="Delete Scheme"
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

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT COURSE */}
      {/* ========================================================= */}
      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent className="max-w-2xl bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-oxford" />
              <span>{editingCourse ? 'Edit Academic Course Data' : 'Add New Academic Course'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveCourse} className="space-y-5 pt-4">
            {courseError && (
              <div className="p-3.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{courseError}</span>
              </div>
            )}

            {/* Course Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Course Title *</label>
              <Input
                type="text"
                placeholder="e.g. Master of Science (M.Sc.) in Physics"
                value={courseFormData.title}
                onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                className="w-full text-base font-serif"
                required
              />
            </div>

            {/* Level & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Degree Level *</label>
                <select
                  value={courseFormData.level}
                  onChange={(e) => setCourseFormData({ ...courseFormData, level: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="MSc">MSc (Postgraduate)</option>
                  <option value="PhD">PhD (Doctoral)</option>
                  <option value="Integrated">Integrated MSc</option>
                  <option value="BSc">BSc (Undergraduate)</option>
                  <option value="MTech">MTech</option>
                  <option value="Diploma">Diploma / Certificate</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Duration *</label>
                <Input
                  type="text"
                  placeholder="e.g. 2 Years (4 Semesters)"
                  value={courseFormData.duration}
                  onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                  className="w-full text-sm font-sans"
                  required
                />
              </div>
            </div>

            {/* Course Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Course Description &amp; Overview *</label>
              <textarea
                rows={6}
                placeholder="Enter a comprehensive description of the academic program, goals, pedagogy, and research scope..."
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                className="w-full text-sm p-3.5 rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
                required
              />
            </div>

            {/* Minimum Eligibility */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Minimum Eligibility Criteria (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. B.Sc. Degree in Physics with Mathematics with minimum 55% marks..."
                value={courseFormData.eligibility}
                onChange={(e) => setCourseFormData({ ...courseFormData, eligibility: e.target.value })}
                className="w-full text-sm p-3.5 rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCourseModalOpen(false)}
                disabled={savingCourse}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingCourse}
                className="bg-oxford hover:bg-slate-800 text-white font-semibold cursor-pointer"
              >
                {savingCourse ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Course...</span>
                  </span>
                ) : editingCourse ? (
                  'Save Changes'
                ) : (
                  'Create Course'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT SCHEME & SYLLABUS PDF */}
      {/* ========================================================= */}
      <Dialog open={isSchemeModalOpen} onOpenChange={setIsSchemeModalOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl text-slate-900">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              <span>{editingScheme ? 'Edit Curriculum Scheme' : 'Add Curriculum Scheme'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveScheme} className="space-y-4 pt-3">
            {schemeError && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{schemeError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Year / Level Classification *</label>
              <Input
                type="text"
                placeholder="e.g. First Year (Semesters 1 & 2)"
                value={schemeFormData.year}
                onChange={(e) => setSchemeFormData({ ...schemeFormData, year: e.target.value })}
                className="text-sm font-sans"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Curriculum Scheme Title *</label>
              <Input
                type="text"
                placeholder="e.g. 2024 CBCS Scheme"
                value={schemeFormData.scheme}
                onChange={(e) => setSchemeFormData({ ...schemeFormData, scheme: e.target.value })}
                className="text-sm font-sans"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Display Sort Order</label>
              <Input
                type="number"
                min={1}
                value={schemeFormData.sortOrder}
                onChange={(e) => setSchemeFormData({ ...schemeFormData, sortOrder: parseInt(e.target.value, 10) || 1 })}
                className="text-sm font-mono"
              />
            </div>

            {/* PDF File Upload or URL */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">Upload Syllabus PDF File (Max 15MB)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSchemeFormData({ ...schemeFormData, pdfFile: file, pdfUrl: '' });
                  }
                }}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-oxford file:text-white hover:file:bg-cyan-600 transition-all cursor-pointer"
              />

              <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-mono">OR External PDF URL</div>

              <Input
                type="text"
                placeholder="https://... or /cvs/syllabus.pdf"
                value={schemeFormData.pdfUrl}
                onChange={(e) => setSchemeFormData({ ...schemeFormData, pdfUrl: e.target.value, pdfFile: null })}
                className="text-xs font-mono"
              />
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSchemeModalOpen(false)}
                disabled={savingScheme}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={savingScheme}
                className="bg-oxford hover:bg-slate-800 text-white font-semibold cursor-pointer"
              >
                {savingScheme ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Save Scheme'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 3: DELETE COURSE CONFIRMATION */}
      {/* ========================================================= */}
      <Dialog open={!!deletingCourseId} onOpenChange={() => setDeletingCourseId(null)}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Delete Course</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete this course and all associated curriculum schemes? This action cannot be undone.
          </p>
          <DialogFooter className="pt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingCourseId(null)}
              disabled={isDeletingCourse}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteCourse}
              disabled={isDeletingCourse}
            >
              {isDeletingCourse ? 'Deleting...' : 'Delete Course'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 4: DELETE SCHEME CONFIRMATION */}
      {/* ========================================================= */}
      <Dialog open={!!deletingSchemeId} onOpenChange={() => setDeletingSchemeId(null)}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Delete Scheme</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete this curriculum scheme entry?
          </p>
          <DialogFooter className="pt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingSchemeId(null)}
              disabled={isDeletingScheme}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteScheme}
              disabled={isDeletingScheme}
            >
              {isDeletingScheme ? 'Deleting...' : 'Delete Scheme'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
