'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LogOut,
  Bell,
  FlaskConical,
  Plus,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  Search,
  RefreshCw,
  LayoutDashboard,
  Users,
  UserPlus,
  KeyRound,
  Mail,
  Lock,
  AlertCircle,
  Edit3
} from 'lucide-react';
import AdminFacultyFullManageModal from '@/components/AdminFacultyFullManageModal';

// Import Shadcn UI elements
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface NotificationItem {
  id: string;
  title: string;
  category: string;
  link: string | null;
  content: string | null;
  isActive: boolean;
  date: string;
  createdAt: string;
}

interface FacultyItem {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  department: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notifications' | 'faculty'>('dashboard');
  const [loggingOut, setLoggingOut] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Notification Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<NotificationItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    link: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Faculty State
  const [facultyList, setFacultyList] = useState<FacultyItem[]>([]);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const [facultySearchTerm, setFacultySearchTerm] = useState('');

  // Faculty Modal State
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyItem | null>(null);
  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: 'Faculty Member',
    department: 'Department of Physics',
    isActive: true,
    newPredefinedPassword: '',
  });
  const [facultySaving, setFacultySaving] = useState(false);
  const [facultyFormError, setFacultyFormError] = useState<string | null>(null);
  const [fullManageFacultyId, setFullManageFacultyId] = useState<string | null>(null);

  // Fetch Notifications
  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  // Fetch Faculty List
  const fetchFaculty = async () => {
    setLoadingFaculty(true);
    try {
      const res = await fetch('/api/admin/faculty');
      if (res.ok) {
        const data = await res.json();
        setFacultyList(data);
      }
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
    } finally {
      setLoadingFaculty(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchFaculty();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // Open Modal for Create or Edit Notification
  const openModal = (notif?: NotificationItem) => {
    setFormError(null);
    if (notif) {
      setEditingNotif(notif);
      setFormData({
        title: notif.title,
        category: notif.category || 'General',
        link: notif.link || '',
        isActive: notif.isActive,
      });
    } else {
      setEditingNotif(null);
      setFormData({
        title: '',
        category: 'General',
        link: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotif(null);
  };

  // Save Notification
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const url = editingNotif
        ? `/api/admin/notifications/${editingNotif.id}`
        : '/api/admin/notifications';
      const method = editingNotif ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save notification');
      }

      await fetchNotifications();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActiveStatus = async (notif: NotificationItem) => {
    try {
      const res = await fetch(`/api/admin/notifications/${notif.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notif,
          isActive: !notif.isActive,
        }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notif.id ? { ...item, isActive: !item.isActive } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle active status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Open Modal for Faculty Create / Edit
  const openFacultyModal = (faculty?: FacultyItem) => {
    setFacultyFormError(null);
    if (faculty) {
      setEditingFaculty(faculty);
      setFacultyFormData({
        name: faculty.name,
        email: faculty.email,
        password: '',
        designation: faculty.designation || 'Faculty Member',
        department: faculty.department || 'Department of Physics',
        isActive: faculty.isActive,
        newPredefinedPassword: '',
      });
    } else {
      setEditingFaculty(null);
      setFacultyFormData({
        name: '',
        email: '',
        password: '',
        designation: 'Professor',
        department: 'Department of Physics',
        isActive: true,
        newPredefinedPassword: '',
      });
    }
    setIsFacultyModalOpen(true);
  };

  const closeFacultyModal = () => {
    setIsFacultyModalOpen(false);
    setEditingFaculty(null);
  };

  // Save Faculty Member
  const handleFacultySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyFormError(null);

    if (!facultyFormData.name.trim()) {
      setFacultyFormError('Faculty Name is required');
      return;
    }

    if (!facultyFormData.email.trim()) {
      setFacultyFormError('Faculty Email is required');
      return;
    }

    if (!editingFaculty && (!facultyFormData.password || facultyFormData.password.length < 6)) {
      setFacultyFormError('Predefined Password must be at least 6 characters long');
      return;
    }

    setFacultySaving(true);

    try {
      const url = editingFaculty
        ? `/api/admin/faculty/${editingFaculty.id}`
        : '/api/admin/faculty';
      const method = editingFaculty ? 'PUT' : 'POST';

      const payload: any = {
        name: facultyFormData.name,
        email: facultyFormData.email,
        designation: facultyFormData.designation,
        department: facultyFormData.department,
        isActive: facultyFormData.isActive,
      };

      if (!editingFaculty) {
        payload.password = facultyFormData.password;
      } else if (facultyFormData.newPredefinedPassword) {
        payload.newPredefinedPassword = facultyFormData.newPredefinedPassword;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save faculty record');
      }

      await fetchFaculty();
      closeFacultyModal();
    } catch (err: any) {
      setFacultyFormError(err.message || 'An error occurred while saving faculty account.');
    } finally {
      setFacultySaving(false);
    }
  };

  // Toggle Faculty Active Status
  const toggleFacultyStatus = async (faculty: FacultyItem) => {
    try {
      const res = await fetch(`/api/admin/faculty/${faculty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !faculty.isActive,
        }),
      });

      if (res.ok) {
        setFacultyList((prev) =>
          prev.map((item) =>
            item.id === faculty.id ? { ...item, isActive: !item.isActive } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle faculty active status:', err);
    }
  };

  // Delete Faculty Record
  const handleDeleteFaculty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty account record?')) return;

    try {
      const res = await fetch(`/api/admin/faculty/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFacultyList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete faculty record:', err);
    }
  };

  const filteredNotifs = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(facultySearchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(facultySearchTerm.toLowerCase()) ||
      (f.designation && f.designation.toLowerCase().includes(facultySearchTerm.toLowerCase()))
  );

  return (
    <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center text-cyan-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-oxford font-serif">Department Management Portal</h1>
            <p className="text-xs text-slate-500">Database Active • Admin Authenticated</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation Tabs */}
          <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
              <Bell className="w-3.5 h-3.5" />
              <span>Notifications ({notifications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
              <Users className="w-3.5 h-3.5" />
              <span>Faculty Accounts ({facultyList.length})</span>
            </TabsTrigger>
          </TabsList>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* OVERVIEW TAB */}
        <TabsContent value="dashboard" className="space-y-8 animate-fadeIn mt-0">
          {/* Welcome Banner */}
          <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <CardHeader className="p-0 mb-3">
              <Badge variant="success" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" /> Database Connection Active
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <CardTitle className="text-2xl font-bold font-serif text-slate-900 leading-none mb-1">Welcome, Administrator</CardTitle>
              <CardDescription className="text-slate-600 text-sm mt-1">
                Manage department announcements, faculty member accounts, and research profiles in real time.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Dashboard Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module 1: Notifications */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/20 flex items-center justify-center">
                    <Bell className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold text-cyan-accent">
                    {notifications.length}
                  </span>
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900 font-serif leading-none">Notifications & Notices</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal">
                  Post department announcements, seminar dates, and urgent student alerts to the marquee ticker.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setActiveTab('notifications')}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Manage Notifications</span>
              </Button>
            </Card>

            {/* Module 2: Faculty Accounts */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-oxford/10 text-oxford border border-oxford/20 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold text-oxford">
                    {facultyList.length}
                  </span>
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900 font-serif leading-none">Faculty Member Accounts</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal">
                  Create faculty logins (Email + Predefined Password), monitor password change status, and update records.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setActiveTab('faculty')}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Manage Faculty Accounts</span>
              </Button>
            </Card>

            {/* Module 3: Research Labs */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs opacity-75">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900 font-serif leading-none">Research Labs</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal">
                  Update lab equipment inventory, faculty heads, and research focus areas.
                </CardDescription>
              </CardContent>
              <Button disabled variant="secondary" className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                <span>Coming Soon</span>
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6 animate-fadeIn mt-0">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <Bell className="w-6 h-6 text-cyan-accent" />
                <span>Notifications Management</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Active notifications are immediately broadcasted to the home page running marquee ticker.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchNotifications}
                className="h-10 w-10 text-slate-700 hover:text-slate-950"
                title="Refresh List"
              >
                <RefreshCw className={`w-4 h-4 ${loadingNotifs ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="default"
                onClick={() => openModal()}
                className="flex items-center gap-2 py-2.5 px-4 font-semibold rounded-xl shadow-xs transition-all text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Notification</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Notifications Data Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {loadingNotifs ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
                <span>Loading notifications...</span>
              </div>
            ) : filteredNotifs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <Bell className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No notifications found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Redirect Link</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifs.map((notif) => (
                    <TableRow key={notif.id}>
                      <TableCell>
                        <Badge
                          variant={notif.isActive ? 'success' : 'inactive'}
                          className="cursor-pointer hover:opacity-85 transition-all py-1 px-2.5 font-bold"
                          onClick={() => toggleActiveStatus(notif)}
                        >
                          {notif.isActive ? (
                            <>
                              <Eye className="w-3 h-3 mr-1.5" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1.5" />
                              <span>Inactive</span>
                            </>
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-medium text-slate-900 max-w-md">
                        <span className="line-clamp-2">{notif.title}</span>
                      </TableCell>

                      <TableCell>
                        <Badge variant="cyan">
                          {notif.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-slate-600">
                        {notif.link ? (
                          <a
                            href={notif.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-cyan-accent hover:underline max-w-[150px] truncate font-medium"
                          >
                            <span>{notif.link}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(notif.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>

                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => openModal(notif)}
                          className="h-8 w-8 text-slate-600 hover:text-slate-900"
                          title="Edit Notification"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(notif.id)}
                          className="h-8 w-8"
                          title="Delete Notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* FACULTY ACCOUNTS TAB */}
        <TabsContent value="faculty" className="space-y-6 animate-fadeIn mt-0">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-oxford" />
                <span>Faculty Account Management</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Create faculty login accounts, specify predefined passwords, and manage permissions. Faculty emails are used as usernames.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchFaculty}
                className="h-10 w-10 text-slate-700 hover:text-slate-950"
                title="Refresh Faculty Records"
              >
                <RefreshCw className={`w-4 h-4 ${loadingFaculty ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="default"
                onClick={() => openFacultyModal()}
                className="flex items-center gap-2 py-2.5 px-4 font-semibold rounded-xl shadow-xs transition-all text-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Faculty Account</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search faculty by name, email (username), or designation..."
              value={facultySearchTerm}
              onChange={(e) => setFacultySearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Faculty Data Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {loadingFaculty ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
                <span>Loading faculty member records...</span>
              </div>
            ) : filteredFaculty.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <Users className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No faculty accounts found</p>
                <p className="text-xs text-slate-500">
                  Click "Create Faculty Account" to register a faculty member with email as username.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty Name & Title</TableHead>
                    <TableHead>Username / Email</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead>First-Time Login Status</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaculty.map((faculty) => (
                    <TableRow key={faculty.id}>
                      {/* Name & Title */}
                      <TableCell>
                        <div className="font-semibold text-slate-900">{faculty.name}</div>
                        <div className="text-xs text-oxford mt-0.5 font-medium">
                          {faculty.designation || 'Faculty Member'}
                        </div>
                      </TableCell>

                      {/* Email / Username */}
                      <TableCell className="font-mono text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{faculty.email}</span>
                        </div>
                      </TableCell>

                      {/* Account Status Badge */}
                      <TableCell>
                        <Badge
                          variant={faculty.isActive ? 'success' : 'destructive'}
                          className="cursor-pointer hover:opacity-85 transition-all py-1 px-2.5 font-bold"
                          onClick={() => toggleFacultyStatus(faculty)}
                        >
                          {faculty.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1.5" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 mr-1.5" />
                              <span>Disabled</span>
                            </>
                          )}
                        </Badge>
                      </TableCell>

                      {/* Must Change Password Status */}
                      <TableCell>
                        {faculty.mustChangePassword ? (
                          <Badge variant="amber" className="py-1 px-2.5 font-medium">
                            <KeyRound className="w-3 h-3 mr-1.5" />
                            <span>Predefined (Pending Change)</span>
                          </Badge>
                        ) : (
                          <Badge variant="cyan" className="py-1 px-2.5 font-medium">
                            <Lock className="w-3 h-3 mr-1.5" />
                            <span>Password Changed</span>
                          </Badge>
                        )}
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(faculty.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFullManageFacultyId(faculty.id)}
                          className="text-oxford bg-oxford/5 hover:bg-oxford/10 hover:text-[#001733] border border-oxford/20 font-semibold"
                          title="Manage Full Profile, Documents, Links & Guided Students"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                          <span>Manage Full Profile</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => openFacultyModal(faculty)}
                          className="h-8 w-8 text-slate-600 hover:text-slate-900"
                          title="Edit Details / Reset Predefined Password"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteFaculty(faculty.id)}
                          className="h-8 w-8"
                          title="Delete Faculty Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </main>

      {/* CREATE / EDIT NOTIFICATION MODAL */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingNotif ? 'Edit Notification' : 'Add New Notification'}
            </DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {formError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Notification Title *
              </label>
              <textarea
                rows={3}
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. MSc Physics Semester 2 Exam Schedule Released"
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Notice">Notice</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Admissions">Admissions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Visibility
                </label>
                <div className="flex items-center h-11">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <span className="ml-3 text-xs font-medium text-slate-700">
                    {formData.isActive ? 'Active (Visible)' : 'Inactive (Hidden)'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Redirect Link (Optional)
              </label>
              <Input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="e.g. /courses or https://cusat.ac.in/notice.pdf"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : editingNotif ? 'Update Notification' : 'Create Notification'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE / EDIT FACULTY ACCOUNT MODAL */}
      <Dialog open={isFacultyModalOpen} onOpenChange={(open) => !open && closeFacultyModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-oxford" />
              <span>{editingFaculty ? 'Manage Faculty Record' : 'Create Faculty Account'}</span>
            </DialogTitle>
          </DialogHeader>

          {facultyFormError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{facultyFormError}</span>
            </div>
          )}

          <form onSubmit={handleFacultySave} className="space-y-4 text-sm">
            {/* Faculty Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Faculty Name *
              </label>
              <Input
                type="text"
                required
                value={facultyFormData.name}
                onChange={(e) => setFacultyFormData({ ...facultyFormData, name: e.target.value })}
                placeholder="e.g. Dr. APJ Abdul Kalam"
              />
            </div>

            {/* Faculty Email (Username) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Faculty Email (Used as Login Username) *
              </label>
              <Input
                type="email"
                required
                value={facultyFormData.email}
                onChange={(e) => setFacultyFormData({ ...facultyFormData, email: e.target.value })}
                placeholder="e.g. kalam@physics.cusat.ac.in"
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This email address will serve as the faculty member's username for logging in.
              </p>
            </div>

            {/* Predefined Password (for New Account) */}
            {!editingFaculty ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Predefined Initial Password *
                </label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={facultyFormData.password}
                  onChange={(e) => setFacultyFormData({ ...facultyFormData, password: e.target.value })}
                  placeholder="Enter initial predefined password"
                  className="font-mono"
                />
                <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 shrink-0" />
                  <span>Faculty will be prompted to change this predefined password after their first login.</span>
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Reset Predefined Password (Optional)
                </label>
                <Input
                  type="password"
                  minLength={6}
                  value={facultyFormData.newPredefinedPassword}
                  onChange={(e) => setFacultyFormData({ ...facultyFormData, newPredefinedPassword: e.target.value })}
                  placeholder="Leave blank to keep current password"
                  className="font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  If set, resets the faculty's password and requires them to change it on their next login.
                </p>
              </div>
            )}

            {/* Designation & Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Designation
                </label>
                <Input
                  type="text"
                  value={facultyFormData.designation}
                  onChange={(e) => setFacultyFormData({ ...facultyFormData, designation: e.target.value })}
                  placeholder="e.g. Associate Professor"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Account Access
                </label>
                <div className="flex items-center h-11">
                  <Switch
                    checked={facultyFormData.isActive}
                    onCheckedChange={(checked) => setFacultyFormData({ ...facultyFormData, isActive: checked })}
                  />
                  <span className="ml-3 text-xs font-medium text-slate-700">
                    {facultyFormData.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeFacultyModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={facultySaving}
              >
                {facultySaving ? 'Saving Account...' : editingFaculty ? 'Update Record' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Full Faculty Management Modal */}
      <AdminFacultyFullManageModal
        facultyId={fullManageFacultyId}
        isOpen={Boolean(fullManageFacultyId)}
        onClose={() => setFullManageFacultyId(null)}
        onFacultyUpdated={fetchFaculty}
      />
    </Tabs>
  );
}
