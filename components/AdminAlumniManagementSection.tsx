'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Gift,
  FileText,
  ExternalLink,
  RotateCw,
  Eye,
  EyeOff,
  UserCheck,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// 1. Interfaces
export interface ExecutiveItem {
  id: string;
  name: string;
  role: string;
  batch: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface AchievementItem {
  id: string;
  awardName: string;
  recipient: string;
  batch: string | null;
  date: string;
  photo: string | null;
  desc: string;
  sortOrder: number;
}

export interface SponsoredProgramItem {
  id: string;
  programName: string;
  nature: 'Award' | 'Donation';
  date: string;
  photo: string | null;
  sponsor: string | null;
  desc: string;
  proofUrl: string | null;
  isRecurring: boolean;
  sortOrder: number;
}

export default function AdminAlumniManagementSection() {
  const [activeSubTab, setActiveSubTab] = useState<'executives' | 'achievements' | 'programs'>('executives');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data collections
  const [executives, setExecutives] = useState<ExecutiveItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [programs, setPrograms] = useState<SponsoredProgramItem[]>([]);

  // Modals & Delete States
  const [isExecModalOpen, setIsExecModalOpen] = useState(false);
  const [editingExec, setEditingExec] = useState<ExecutiveItem | null>(null);

  const [isAchModalOpen, setIsAchModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<AchievementItem | null>(null);

  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<SponsoredProgramItem | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: 'exec' | 'ach' | 'prog';
    id: string;
    title: string;
  }>({ open: false, type: 'exec', id: '', title: '' });

  // Executive Form State
  const [execForm, setExecForm] = useState({
    name: '',
    role: 'President',
    batch: '',
    isActive: true,
    sortOrder: 0,
    imageFile: null as File | null,
    imageUrl: '',
  });
  const [execPreview, setExecPreview] = useState<string | null>(null);
  const execFileRef = useRef<HTMLInputElement>(null);

  // Achievement Form State
  const [achForm, setAchForm] = useState({
    awardName: '',
    recipient: '',
    batch: '',
    date: '',
    desc: '',
    sortOrder: 0,
    photoFile: null as File | null,
    photoUrl: '',
  });
  const [achPreview, setAchPreview] = useState<string | null>(null);
  const achFileRef = useRef<HTMLInputElement>(null);

  // Sponsored Program Form State
  const [progForm, setProgForm] = useState({
    programName: '',
    nature: 'Award' as 'Award' | 'Donation',
    date: '',
    sponsor: '',
    desc: '',
    isRecurring: false,
    sortOrder: 0,
    photoFile: null as File | null,
    photoUrl: '',
    proofFile: null as File | null,
    proofUrl: '',
  });
  const [progPreview, setProgPreview] = useState<string | null>(null);
  const progFileRef = useRef<HTMLInputElement>(null);
  const progProofRef = useRef<HTMLInputElement>(null);

  // Fetch all alumni data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [execRes, achRes, progRes] = await Promise.all([
        fetch('/api/admin/alumni/executives'),
        fetch('/api/admin/alumni/achievements'),
        fetch('/api/admin/alumni/programs'),
      ]);

      if (execRes.ok) setExecutives(await execRes.json());
      if (achRes.ok) setAchievements(await achRes.json());
      if (progRes.ok) setPrograms(await progRes.json());
    } catch (err) {
      console.error('Failed to load alumni data:', err);
      setError('Failed to load alumni records from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Drag-and-drop sorting state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

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

  const handleDrop = async (
    e: React.DragEvent<HTMLTableRowElement>,
    targetIndex: number,
    type: 'executives' | 'achievements' | 'programs'
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    let updatedList: any[] = [];
    if (type === 'executives') {
      updatedList = [...executives];
      const [draggedItem] = updatedList.splice(draggedIndex, 1);
      updatedList.splice(targetIndex, 0, draggedItem);
      const reordered = updatedList.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
      setExecutives(reordered);
    } else if (type === 'achievements') {
      updatedList = [...achievements];
      const [draggedItem] = updatedList.splice(draggedIndex, 1);
      updatedList.splice(targetIndex, 0, draggedItem);
      const reordered = updatedList.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
      setAchievements(reordered);
    } else if (type === 'programs') {
      updatedList = [...programs];
      const [draggedItem] = updatedList.splice(draggedIndex, 1);
      updatedList.splice(targetIndex, 0, draggedItem);
      const reordered = updatedList.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
      setPrograms(reordered);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsReordering(true);

    const itemsToUpdate = updatedList.map((item, idx) => ({
      id: item.id,
      sortOrder: idx + 1,
    }));

    try {
      const res = await fetch('/api/admin/alumni/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, items: itemsToUpdate }),
      });

      if (!res.ok) {
        throw new Error('Failed to save new order');
      }
      showNotification('Ranking order updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reorder';
      setError(msg);
      fetchData();
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveItem = async (
    index: number,
    direction: 'up' | 'down',
    type: 'executives' | 'achievements' | 'programs'
  ) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    let list: any[] = [];
    if (type === 'executives') list = [...executives];
    if (type === 'achievements') list = [...achievements];
    if (type === 'programs') list = [...programs];

    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const reordered = list.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    if (type === 'executives') setExecutives(reordered);
    if (type === 'achievements') setAchievements(reordered);
    if (type === 'programs') setPrograms(reordered);

    setIsReordering(true);
    const itemsToUpdate = reordered.map((item) => ({ id: item.id, sortOrder: item.sortOrder }));

    try {
      const res = await fetch('/api/admin/alumni/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, items: itemsToUpdate }),
      });
      if (!res.ok) throw new Error('Failed to save new order');
      showNotification('Ranking order updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reorder';
      setError(msg);
      fetchData();
    } finally {
      setIsReordering(false);
    }
  };

  // -------------------------------------------------------------
  // Executive Handlers
  // -------------------------------------------------------------
  const openAddExecutive = () => {
    setEditingExec(null);
    setExecForm({
      name: '',
      role: 'President',
      batch: '',
      isActive: true,
      sortOrder: executives.length + 1,
      imageFile: null,
      imageUrl: '',
    });
    setExecPreview(null);
    setIsExecModalOpen(true);
  };

  const openEditExecutive = (item: ExecutiveItem) => {
    setEditingExec(item);
    setExecForm({
      name: item.name,
      role: item.role,
      batch: item.batch || '',
      isActive: item.isActive,
      sortOrder: item.sortOrder,
      imageFile: null,
      imageUrl: item.image || '',
    });
    setExecPreview(item.image || null);
    setIsExecModalOpen(true);
  };

  const handleSaveExecutive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!execForm.name.trim() || !execForm.role.trim()) {
      setError('Officer name and position/role are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', execForm.name.trim());
      formData.append('role', execForm.role.trim());
      formData.append('batch', execForm.batch.trim());
      formData.append('isActive', String(execForm.isActive));
      formData.append('sortOrder', String(execForm.sortOrder));

      if (execForm.imageFile) {
        formData.append('image', execForm.imageFile);
      } else if (execForm.imageUrl) {
        formData.append('imageUrl', execForm.imageUrl);
      }

      const url = editingExec
        ? `/api/admin/alumni/executives/${editingExec.id}`
        : '/api/admin/alumni/executives';
      const method = editingExec ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save executive officer');
      }

      await fetchData();
      setIsExecModalOpen(false);
      showNotification(
        editingExec
          ? `Updated officer "${execForm.name}" successfully.`
          : `Added officer "${execForm.name}" successfully.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save executive';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Achievement Handlers
  // -------------------------------------------------------------
  const openAddAchievement = () => {
    setEditingAch(null);
    setAchForm({
      awardName: '',
      recipient: '',
      batch: '',
      date: '',
      desc: '',
      sortOrder: achievements.length + 1,
      photoFile: null,
      photoUrl: '',
    });
    setAchPreview(null);
    setIsAchModalOpen(true);
  };

  const openEditAchievement = (item: AchievementItem) => {
    setEditingAch(item);
    setAchForm({
      awardName: item.awardName,
      recipient: item.recipient,
      batch: item.batch || '',
      date: item.date,
      desc: item.desc,
      sortOrder: item.sortOrder,
      photoFile: null,
      photoUrl: item.photo || '',
    });
    setAchPreview(item.photo || null);
    setIsAchModalOpen(true);
  };

  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achForm.awardName.trim() || !achForm.recipient.trim() || !achForm.date.trim() || !achForm.desc.trim()) {
      setError('Award name, recipient, date, and description are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('awardName', achForm.awardName.trim());
      formData.append('recipient', achForm.recipient.trim());
      formData.append('batch', achForm.batch.trim());
      formData.append('date', achForm.date.trim());
      formData.append('desc', achForm.desc.trim());
      formData.append('sortOrder', String(achForm.sortOrder));

      if (achForm.photoFile) {
        formData.append('photo', achForm.photoFile);
      } else if (achForm.photoUrl) {
        formData.append('photoUrl', achForm.photoUrl);
      }

      const url = editingAch
        ? `/api/admin/alumni/achievements/${editingAch.id}`
        : '/api/admin/alumni/achievements';
      const method = editingAch ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save achievement');
      }

      await fetchData();
      setIsAchModalOpen(false);
      showNotification(
        editingAch
          ? `Updated achievement "${achForm.awardName}" successfully.`
          : `Added achievement "${achForm.awardName}" successfully.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save achievement';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Sponsored Program Handlers
  // -------------------------------------------------------------
  const openAddProgram = () => {
    setEditingProg(null);
    setProgForm({
      programName: '',
      nature: 'Award',
      date: '',
      sponsor: '',
      desc: '',
      isRecurring: false,
      sortOrder: programs.length + 1,
      photoFile: null,
      photoUrl: '',
      proofFile: null,
      proofUrl: '',
    });
    setProgPreview(null);
    setIsProgModalOpen(true);
  };

  const openEditProgram = (item: SponsoredProgramItem) => {
    setEditingProg(item);
    setProgForm({
      programName: item.programName,
      nature: item.nature,
      date: item.date,
      sponsor: item.sponsor || '',
      desc: item.desc,
      isRecurring: item.isRecurring,
      sortOrder: item.sortOrder,
      photoFile: null,
      photoUrl: item.photo || '',
      proofFile: null,
      proofUrl: item.proofUrl || '',
    });
    setProgPreview(item.photo || null);
    setIsProgModalOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progForm.programName.trim() || !progForm.date.trim() || !progForm.desc.trim()) {
      setError('Program name, date, and description are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('programName', progForm.programName.trim());
      formData.append('nature', progForm.nature);
      formData.append('date', progForm.date.trim());
      formData.append('sponsor', progForm.sponsor.trim());
      formData.append('desc', progForm.desc.trim());
      formData.append('isRecurring', String(progForm.isRecurring));
      formData.append('sortOrder', String(progForm.sortOrder));

      if (progForm.photoFile) {
        formData.append('photo', progForm.photoFile);
      } else if (progForm.photoUrl) {
        formData.append('photoUrl', progForm.photoUrl);
      }

      if (progForm.proofFile) {
        formData.append('proofFile', progForm.proofFile);
      } else if (progForm.proofUrl) {
        formData.append('proofUrl', progForm.proofUrl);
      }

      const url = editingProg
        ? `/api/admin/alumni/programs/${editingProg.id}`
        : '/api/admin/alumni/programs';
      const method = editingProg ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save sponsored program');
      }

      await fetchData();
      setIsProgModalOpen(false);
      showNotification(
        editingProg
          ? `Updated sponsored program "${progForm.programName}" successfully.`
          : `Added sponsored program "${progForm.programName}" successfully.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save program';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Delete Handler
  // -------------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setSaving(true);
    setError(null);

    try {
      let endpoint = '';
      if (deleteConfirm.type === 'exec') endpoint = `/api/admin/alumni/executives/${deleteConfirm.id}`;
      if (deleteConfirm.type === 'ach') endpoint = `/api/admin/alumni/achievements/${deleteConfirm.id}`;
      if (deleteConfirm.type === 'prog') endpoint = `/api/admin/alumni/programs/${deleteConfirm.id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete record');
      }

      await fetchData();
      showNotification(`Deleted "${deleteConfirm.title}" successfully.`);
      setDeleteConfirm({ open: false, type: 'exec', id: '', title: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Filtered Lists
  const filteredExecs = executives.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAchs = achievements.filter(
    (a) =>
      a.awardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProgs = programs.filter(
    (p) =>
      p.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Header Card */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                Alumni Management
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Manage Executive Committee officers, alumni achievements &amp; honors, and sponsored endowments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchData}
              disabled={loading}
              className="h-11 w-11 rounded-xl text-slate-700 hover:text-slate-950"
              title="Refresh Alumni Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            {activeSubTab === 'executives' && (
              <Button
                variant="default"
                onClick={openAddExecutive}
                className="h-11 px-5 rounded-xl bg-oxford hover:bg-oxford/90 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Officer</span>
              </Button>
            )}

            {activeSubTab === 'achievements' && (
              <Button
                variant="default"
                onClick={openAddAchievement}
                className="h-11 px-5 rounded-xl bg-oxford hover:bg-oxford/90 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Achievement</span>
              </Button>
            )}

            {activeSubTab === 'programs' && (
              <Button
                variant="default"
                onClick={openAddProgram}
                className="h-11 px-5 rounded-xl bg-oxford hover:bg-oxford/90 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Program</span>
              </Button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </Card>

      {/* Tabs Bar & Search Filter */}
      <Tabs
        value={activeSubTab}
        onValueChange={(val) => {
          setActiveSubTab(val as 'executives' | 'achievements' | 'programs');
          setSearchTerm('');
        }}
        className="w-full space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-auto flex flex-wrap">
            <TabsTrigger
              value="executives"
              className="rounded-lg px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:shadow-xs flex items-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Executive Committee</span>
              <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {executives.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="achievements"
              className="rounded-lg px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:shadow-xs flex items-center gap-2"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Achievements &amp; Awards</span>
              <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {achievements.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="programs"
              className="rounded-lg px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:shadow-xs flex items-center gap-2"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Sponsored Programs</span>
              <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {programs.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Search Box & Drag Guidance */}
          <div className="flex items-center gap-2.5">
            {isReordering && (
              <span className="text-xs text-oxford font-semibold flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving order...
              </span>
            )}
            {!searchTerm && !isReordering && (
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl font-medium shrink-0">
                <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                <span>Drag rows to reorder</span>
              </div>
            )}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder={`Search ${activeSubTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 rounded-xl border-slate-200 text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 1: Executive Committee */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="executives" className="mt-0">
          <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                  <TableHead className="w-24 font-bold text-slate-700 text-xs">Order</TableHead>
                  <TableHead className="w-16 text-center font-bold text-slate-700 text-xs">Photo</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Name</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Position / Role</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Batch</TableHead>
                  <TableHead className="w-24 text-center font-bold text-slate-700 text-xs">Status</TableHead>
                  <TableHead className="w-24 text-right font-bold text-slate-700 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExecs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                      {searchTerm ? 'No officers match your search.' : 'No executive committee officers found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExecs.map((exec, idx) => {
                    const isDragging = draggedIndex === idx;
                    const isDragOver = dragOverIndex === idx && draggedIndex !== idx;

                    return (
                      <TableRow
                        key={exec.id}
                        draggable={!searchTerm}
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx, 'executives')}
                        onDragEnd={handleDragEnd}
                        className={`transition-all duration-200 select-none border-b border-slate-100 ${
                          isDragging
                            ? 'opacity-30 bg-slate-200 scale-[0.99] border-2 border-dashed border-oxford'
                            : isDragOver
                            ? 'border-t-4 border-oxford bg-oxford/10 shadow-lg'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {/* Drag Handle & Order Controls */}
                        <TableCell className="py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {/* Grip Icon */}
                            <div
                              className={`p-1 rounded transition-colors ${
                                searchTerm
                                  ? 'opacity-30 cursor-not-allowed text-slate-300'
                                  : 'cursor-grab active:cursor-grabbing text-slate-400 hover:text-oxford hover:bg-slate-200/60'
                              }`}
                              title={searchTerm ? 'Clear search filter to reorder' : 'Drag to reorder officer'}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            {/* Order Badge */}
                            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-2xs">
                              #{idx + 1}
                            </span>

                            {/* Quick Move Up/Down Buttons */}
                            {!searchTerm && (
                              <div className="flex flex-col -space-y-0.5 ml-0.5">
                                <button
                                  type="button"
                                  disabled={idx === 0 || isReordering}
                                  onClick={() => moveItem(idx, 'up', 'executives')}
                                  className="text-slate-400 hover:text-oxford disabled:opacity-20 disabled:hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
                                  aria-label={`Move ${exec.name} up`}
                                  title="Move Up"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === filteredExecs.length - 1 || isReordering}
                                  onClick={() => moveItem(idx, 'down', 'executives')}
                                  className="text-slate-400 hover:text-oxford disabled:opacity-20 disabled:hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
                                  aria-label={`Move ${exec.name} down`}
                                  title="Move Down"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 mx-auto relative bg-slate-100">
                            {exec.image ? (
                              <Image
                                src={exec.image}
                                alt={exec.name}
                                fill
                                sizes="44px"
                                className="object-cover object-top"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                                {exec.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 text-sm py-3">
                          {exec.name}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className="font-bold text-xs bg-slate-50 text-oxford border-slate-300"
                          >
                            {exec.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 text-xs py-3">
                          {exec.batch || '—'}
                        </TableCell>
                        <TableCell className="text-center py-3">
                          {exec.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                              <Eye className="w-3 h-3 text-slate-500" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                              <EyeOff className="w-3 h-3 text-slate-400" /> Hidden
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1 whitespace-nowrap py-3">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openEditExecutive(exec)}
                            className="h-8 w-8 text-slate-700 hover:text-slate-950"
                            title="Edit Officer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: 'exec',
                                id: exec.id,
                                title: exec.name,
                              })
                            }
                            className="h-8 w-8"
                            title="Delete Officer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 2: Achievements & Awards */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="achievements" className="mt-0">
          <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                  <TableHead className="w-24 font-bold text-slate-700 text-xs">Order</TableHead>
                  <TableHead className="w-20 text-center font-bold text-slate-700 text-xs">Photo</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Award / Achievement Name</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Recipient</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Batch</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Date of Award</TableHead>
                  <TableHead className="w-24 text-right font-bold text-slate-700 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAchs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                      {searchTerm ? 'No achievements match your search.' : 'No alumni achievements found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAchs.map((ach, idx) => {
                    const isDragging = draggedIndex === idx;
                    const isDragOver = dragOverIndex === idx && draggedIndex !== idx;

                    return (
                      <TableRow
                        key={ach.id}
                        draggable={!searchTerm}
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx, 'achievements')}
                        onDragEnd={handleDragEnd}
                        className={`transition-all duration-200 select-none border-b border-slate-100 ${
                          isDragging
                            ? 'opacity-30 bg-slate-200 scale-[0.99] border-2 border-dashed border-oxford'
                            : isDragOver
                            ? 'border-t-4 border-oxford bg-oxford/10 shadow-lg'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {/* Drag Handle & Order Controls */}
                        <TableCell className="py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {/* Grip Icon */}
                            <div
                              className={`p-1 rounded transition-colors ${
                                searchTerm
                                  ? 'opacity-30 cursor-not-allowed text-slate-300'
                                  : 'cursor-grab active:cursor-grabbing text-slate-400 hover:text-oxford hover:bg-slate-200/60'
                              }`}
                              title={searchTerm ? 'Clear search filter to reorder' : 'Drag to reorder achievement'}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            {/* Order Badge */}
                            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-2xs">
                              #{idx + 1}
                            </span>

                            {/* Quick Move Up/Down Buttons */}
                            {!searchTerm && (
                              <div className="flex flex-col -space-y-0.5 ml-0.5">
                                <button
                                  type="button"
                                  disabled={idx === 0 || isReordering}
                                  onClick={() => moveItem(idx, 'up', 'achievements')}
                                  className="text-slate-400 hover:text-oxford disabled:opacity-20 disabled:hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
                                  aria-label={`Move ${ach.awardName} up`}
                                  title="Move Up"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === filteredAchs.length - 1 || isReordering}
                                  onClick={() => moveItem(idx, 'down', 'achievements')}
                                  className="text-slate-400 hover:text-oxford disabled:opacity-20 disabled:hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
                                  aria-label={`Move ${ach.awardName} down`}
                                  title="Move Down"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 mx-auto relative bg-slate-100">
                            {ach.photo ? (
                              <Image
                                src={ach.photo}
                                alt={ach.awardName}
                                fill
                                sizes="56px"
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                                —
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {ach.awardName}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ach.desc}</p>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-800 text-xs py-3">
                          {ach.recipient}
                        </TableCell>
                        <TableCell className="text-slate-600 text-xs py-3">
                          {ach.batch || '—'}
                        </TableCell>
                        <TableCell className="text-slate-700 text-xs font-medium py-3 whitespace-nowrap">
                          {ach.date}
                        </TableCell>
                        <TableCell className="text-right space-x-1 whitespace-nowrap py-3">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openEditAchievement(ach)}
                            className="h-8 w-8 text-slate-700 hover:text-slate-950"
                            title="Edit Achievement"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: 'ach',
                                id: ach.id,
                                title: ach.awardName,
                              })
                            }
                            className="h-8 w-8"
                            title="Delete Achievement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 3: Sponsored Programs */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="programs" className="mt-0">
          <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                  <TableHead className="w-24 font-bold text-slate-700 text-xs">Order</TableHead>
                  <TableHead className="w-20 text-center font-bold text-slate-700 text-xs">Photo</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Program Name</TableHead>
                  <TableHead className="w-24 text-center font-bold text-slate-700 text-xs">Nature</TableHead>
                  <TableHead className="w-28 text-center font-bold text-slate-700 text-xs">Recurring</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Date / Tenure</TableHead>
                  <TableHead className="w-24 text-center font-bold text-slate-700 text-xs">Proof</TableHead>
                  <TableHead className="w-24 text-right font-bold text-slate-700 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-slate-400 text-sm">
                      {searchTerm ? 'No programs match your search.' : 'No sponsored programs found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProgs.map((prog, idx) => {
                    const isDragging = draggedIndex === idx;
                    const isDragOver = dragOverIndex === idx && draggedIndex !== idx;

                    return (
                      <TableRow
                        key={prog.id}
                        draggable={!searchTerm}
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx, 'programs')}
                        onDragEnd={handleDragEnd}
                        className={`transition-all duration-200 select-none border-b border-slate-100 ${
                          isDragging
                            ? 'opacity-30 bg-slate-200 scale-[0.99] border-2 border-dashed border-oxford'
                            : isDragOver
                            ? 'border-t-4 border-oxford bg-oxford/10 shadow-lg'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {/* Drag Handle & Order Controls */}
                        <TableCell className="py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {/* Grip Icon */}
                            <div
                              className={`p-1 rounded transition-colors ${
                                searchTerm
                                  ? 'opacity-30 cursor-not-allowed text-slate-300'
                                  : 'cursor-grab active:cursor-grabbing text-slate-400 hover:text-oxford hover:bg-slate-200/60'
                              }`}
                              title={searchTerm ? 'Clear search filter to reorder' : 'Drag to reorder program'}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            {/* Order Badge */}
                            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-2xs">
                              #{idx + 1}
                            </span>

                            {/* Quick Move Up/Down Buttons */}
                            {!searchTerm && (
                              <div className="flex flex-col -space-y-0.5 ml-0.5">
                                <button
                                  type="button"
                                  disabled={idx === 0 || isReordering}
                                  onClick={() => moveItem(idx, 'up', 'programs')}
                                  className="text-slate-400 hover:text-oxford disabled:opacity-20 disabled:hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
                                  aria-label={`Move ${prog.programName} up`}
                                  title="Move Up"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === filteredProgs.length - 1 || isReordering}
                                  onClick={() => moveItem(idx, 'down', 'programs')}
                                  className="text-slate-400 hover:text-oxford disabled:opacity-20 disabled:hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
                                  aria-label={`Move ${prog.programName} down`}
                                  title="Move Down"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 mx-auto relative bg-slate-100">
                            {prog.photo ? (
                              <Image
                                src={prog.photo}
                                alt={prog.programName}
                                fill
                                sizes="56px"
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                                —
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {prog.programName}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {prog.sponsor ? `Sponsor: ${prog.sponsor} · ` : ''}{prog.desc}
                          </p>
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <Badge
                            variant="outline"
                            className={`font-semibold text-xs uppercase px-2.5 py-0.5 ${
                              prog.nature === 'Award'
                                ? 'bg-slate-100 text-slate-800 border-slate-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {prog.nature}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center py-3">
                          {prog.isRecurring ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                              <RotateCw className="w-3 h-3 text-slate-500" /> Every Year
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                              One-time
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700 text-xs font-medium py-3 whitespace-nowrap">
                          {prog.date}
                        </TableCell>
                        <TableCell className="text-center py-3">
                          {prog.proofUrl ? (
                            <a
                              href={prog.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-oxford hover:underline"
                              title="View Uploaded Proof"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                              <span>Proof</span>
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1 whitespace-nowrap py-3">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openEditProgram(prog)}
                            className="h-8 w-8 text-slate-700 hover:text-slate-950"
                            title="Edit Program"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: 'prog',
                                id: prog.id,
                                title: prog.programName,
                              })
                            }
                            className="h-8 w-8"
                            title="Delete Program"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================================= */}
      {/* MODAL 1: Add / Edit Executive Officer (No affiliation) */}
      {/* ============================================================= */}
      <Dialog open={isExecModalOpen} onOpenChange={setIsExecModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-serif text-slate-900">
              {editingExec ? 'Edit Executive Officer' : 'Add Executive Officer'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveExecutive} className="space-y-4 font-sans text-sm mt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Officer Name <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={execForm.name}
                onChange={(e) => setExecForm({ ...execForm, name: e.target.value })}
                placeholder="e.g. Dr. S. Prasanth"
                className="rounded-xl border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Position / Role <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={execForm.role}
                onChange={(e) => setExecForm({ ...execForm, role: e.target.value })}
                placeholder="e.g. President, Vice President, Treasurer, etc."
                className="rounded-xl border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Batch / Academic Distinction (Optional)
              </label>
              <Input
                value={execForm.batch}
                onChange={(e) => setExecForm({ ...execForm, batch: e.target.value })}
                placeholder="e.g. Class of 1998 · M.Sc. & Ph.D."
                className="rounded-xl border-slate-200"
              />
            </div>

            {/* Photo Uploader */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Officer Portrait Photo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                  {execPreview ? (
                    <Image src={execPreview} alt="Preview" fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => execFileRef.current?.click()}
                      className="text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{execPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    </Button>

                    {execPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setExecForm({ ...execForm, imageFile: null, imageUrl: '' });
                          setExecPreview(null);
                          if (execFileRef.current) execFileRef.current.value = '';
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={execFileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setExecForm({ ...execForm, imageFile: file, imageUrl: '' });
                        setExecPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, or WebP. Auto-optimized to WebP.</p>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="text-xs font-bold text-slate-700 block mb-1">Public Visibility</label>
              <select
                value={execForm.isActive ? 'true' : 'false'}
                onChange={(e) => setExecForm({ ...execForm, isActive: e.target.value === 'true' })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-oxford"
              >
                <option value="true">Active (Visible)</option>
                <option value="false">Hidden</option>
              </select>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExecModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-oxford hover:bg-oxford/90 text-white font-semibold text-xs"
              >
                {saving ? 'Saving...' : editingExec ? 'Update Officer' : 'Add Officer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================= */}
      {/* MODAL 2: Add / Edit Achievement (No category) */}
      {/* ============================================================= */}
      <Dialog open={isAchModalOpen} onOpenChange={setIsAchModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-serif text-slate-900">
              {editingAch ? 'Edit Achievement / Award' : 'Add Achievement / Award'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveAchievement} className="space-y-4 font-sans text-sm mt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Name of Award / Achievement <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={achForm.awardName}
                onChange={(e) => setAchForm({ ...achForm, awardName: e.target.value })}
                placeholder="e.g. Shanti Swarup Bhatnagar Prize in Physical Sciences"
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Recipient Alumnus <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={achForm.recipient}
                  onChange={(e) => setAchForm({ ...achForm, recipient: e.target.value })}
                  placeholder="e.g. Dr. S. Prasanth"
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Batch / Degree (Optional)
                </label>
                <Input
                  value={achForm.batch}
                  onChange={(e) => setAchForm({ ...achForm, batch: e.target.value })}
                  placeholder="e.g. Class of 1998 · M.Sc."
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Date of Award <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={achForm.date}
                onChange={(e) => setAchForm({ ...achForm, date: e.target.value })}
                placeholder="e.g. 26 September 2025"
                className="rounded-xl border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={achForm.desc}
                onChange={(e) => setAchForm({ ...achForm, desc: e.target.value })}
                placeholder="Describe the significance and breakthrough of the award..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-oxford font-sans"
              />
            </div>

            {/* Photo Uploader */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Award / Ceremony Photo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                  {achPreview ? (
                    <Image src={achPreview} alt="Preview" fill className="object-cover object-center" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => achFileRef.current?.click()}
                      className="text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{achPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    </Button>

                    {achPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAchForm({ ...achForm, photoFile: null, photoUrl: '' });
                          setAchPreview(null);
                          if (achFileRef.current) achFileRef.current.value = '';
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={achFileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAchForm({ ...achForm, photoFile: file, photoUrl: '' });
                        setAchPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, or WebP.</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAchModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-oxford hover:bg-oxford/90 text-white font-semibold text-xs"
              >
                {saving ? 'Saving...' : editingAch ? 'Update Achievement' : 'Add Achievement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================= */}
      {/* MODAL 3: Add / Edit Sponsored Program (with proof & isRecurring) */}
      {/* ============================================================= */}
      <Dialog open={isProgModalOpen} onOpenChange={setIsProgModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-serif text-slate-900">
              {editingProg ? 'Edit Sponsored Program' : 'Add Sponsored Program'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProgram} className="space-y-4 font-sans text-sm mt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Name of Program <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                value={progForm.programName}
                onChange={(e) => setProgForm({ ...progForm, programName: e.target.value })}
                placeholder="e.g. Prof. M. Sabir Memorial Student Excellence Endowment"
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nature of Program <span className="text-rose-500">*</span>
                </label>
                <select
                  value={progForm.nature}
                  onChange={(e) => setProgForm({ ...progForm, nature: e.target.value as 'Award' | 'Donation' })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-oxford"
                >
                  <option value="Award">Award (Scholarship / Medal)</option>
                  <option value="Donation">Donation (Lab Equipment / Facility)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Recurring Program?
                </label>
                <select
                  value={progForm.isRecurring ? 'true' : 'false'}
                  onChange={(e) => setProgForm({ ...progForm, isRecurring: e.target.value === 'true' })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-oxford"
                >
                  <option value="true">Yes — Recurring Every Year</option>
                  <option value="false">No — One-time Initiative</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Date / Tenure <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={progForm.date}
                  onChange={(e) => setProgForm({ ...progForm, date: e.target.value })}
                  placeholder="e.g. Instituted 2024 · Annual"
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sponsoring Alumnus / Batch
                </label>
                <Input
                  value={progForm.sponsor}
                  onChange={(e) => setProgForm({ ...progForm, sponsor: e.target.value })}
                  placeholder="e.g. Physics Alumni Batch of 1985–1995"
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={progForm.desc}
                onChange={(e) => setProgForm({ ...progForm, desc: e.target.value })}
                placeholder="Explain the eligibility, student scholarship impact, or lab infrastructure benefits..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-oxford font-sans"
              />
            </div>

            {/* Photo Uploader */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Program / Facility Display Photo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                  {progPreview ? (
                    <Image src={progPreview} alt="Preview" fill className="object-cover object-center" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => progFileRef.current?.click()}
                      className="text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{progPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    </Button>

                    {progPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProgForm({ ...progForm, photoFile: null, photoUrl: '' });
                          setProgPreview(null);
                          if (progFileRef.current) progFileRef.current.value = '';
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={progFileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProgForm({ ...progForm, photoFile: file, photoUrl: '' });
                        setProgPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, or WebP.</p>
                </div>
              </div>
            </div>

            {/* Upload Proof Document (PDF or Image) */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Upload Proof Document (Brochure / Letter / Certificate)
              </label>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => progProofRef.current?.click()}
                  className="text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>{progForm.proofFile ? progForm.proofFile.name : progForm.proofUrl ? 'Replace Proof' : 'Upload Proof (PDF/Image)'}</span>
                </Button>

                {progForm.proofUrl && !progForm.proofFile && (
                  <a
                    href={progForm.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-oxford hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Current
                  </a>
                )}

                {(progForm.proofFile || progForm.proofUrl) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setProgForm({ ...progForm, proofFile: null, proofUrl: '' });
                      if (progProofRef.current) progProofRef.current.value = '';
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                ref={progProofRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProgForm({ ...progForm, proofFile: file });
                  }
                }}
                className="hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">Accepts PDF documents or proof images.</p>
            </div>


            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProgModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-oxford hover:bg-oxford/90 text-white font-semibold text-xs"
              >
                {saving ? 'Saving...' : editingProg ? 'Update Program' : 'Add Program'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ============================================================= */}
      <Dialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-serif text-slate-900">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete{' '}
            <strong className="text-slate-900">&ldquo;{deleteConfirm.title}&rdquo;</strong>? This
            action cannot be undone.
          </p>

          <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirm({ open: false, type: 'exec', id: '', title: '' })}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={saving}
              onClick={handleConfirmDelete}
              className="rounded-xl text-xs font-semibold"
            >
              {saving ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
