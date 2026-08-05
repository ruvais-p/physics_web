'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LogOut,
  Bell,
  FlaskConical,
  Quote,
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
  LayoutDashboard
} from 'lucide-react';

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notifications'>('dashboard');
  const [loggingOut, setLoggingOut] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
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

  // Fetch Notifications from DB
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // Open Modal for Create or Edit
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

  // Save Notification (Create or Edit)
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

  // Quick Toggle Active State
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

  // Delete Notification
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

  const filteredNotifs = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#00142D] text-slate-100 flex flex-col font-sans selection:bg-[#00A3C1] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-[#002147] border-b border-slate-700/60 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00A3C1]/20 border border-[#00A3C1]/40 flex items-center justify-center text-[#00A3C1]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif text-white">Department Management Portal</h1>
            <p className="text-xs text-slate-400">PostgreSQL Active • Admin Authenticated</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation Tabs */}
          <nav className="flex items-center bg-[#00142D] p-1 rounded-xl border border-slate-700/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#00A3C1] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'notifications'
                  ? 'bg-[#00A3C1] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifications ({notifications.length})</span>
            </button>
          </nav>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#002147] to-[#003366] border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00A3C1]/20 text-[#00A3C1] border border-[#00A3C1]/30 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Database Connection Active
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-white">Welcome, Administrator</h2>
                  <p className="text-slate-300 text-sm mt-1">
                    Manage department announcements, research lab profiles, and student testimonials in real time.
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Module 1: Notifications */}
              <div className="bg-[#002147]/70 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#00A3C1]/50 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-[#00A3C1] border border-[#00A3C1]/30 flex items-center justify-center">
                      <Bell className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold text-[#00A3C1]">
                      {notifications.length}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white font-serif">Notifications & Notices</h3>
                  <p className="text-sm text-slate-400">
                    Post department announcements, seminar dates, and urgent student alerts to the marquee ticker.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="w-full py-2.5 px-4 bg-[#00142D] hover:bg-[#00A3C1] text-slate-200 hover:text-white border border-slate-700 hover:border-[#00A3C1] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manage Notifications</span>
                </button>
              </div>

              {/* Module 2: Research Labs */}
              <div className="bg-[#002147]/70 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#00A3C1]/50 transition-all opacity-80">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-serif">Research Labs</h3>
                  <p className="text-sm text-slate-400">
                    Update lab equipment inventory, faculty heads, and research focus areas.
                  </p>
                </div>
                <button disabled className="w-full py-2.5 px-4 bg-[#00142D] text-slate-500 border border-slate-800 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                  <span>Coming Soon</span>
                </button>
              </div>

              {/* Module 3: Testimonials */}
              <div className="bg-[#002147]/70 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#00A3C1]/50 transition-all opacity-80">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Quote className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-serif">Testimonials</h3>
                  <p className="text-sm text-slate-400">
                    Add and review quotes from alumni, visiting scholars, and student researchers.
                  </p>
                </div>
                <button disabled className="w-full py-2.5 px-4 bg-[#00142D] text-slate-500 border border-slate-800 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                  <span>Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#002147] p-6 rounded-2xl border border-slate-700/60 shadow-xl">
              <div>
                <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
                  <Bell className="w-6 h-6 text-[#00A3C1]" />
                  <span>Notifications Management</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Active notifications are immediately broadcasted to the home page running marquee ticker.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchNotifications}
                  className="p-2.5 bg-[#00142D] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl transition-all"
                  title="Refresh List"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingNotifs ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => openModal()}
                  className="flex items-center gap-2 py-2.5 px-4 bg-[#00A3C1] hover:bg-[#008ca7] text-white font-semibold rounded-xl shadow-lg shadow-[#00A3C1]/20 transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Notification</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#002147]/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00A3C1] text-sm"
              />
            </div>

            {/* Notifications Data Table */}
            <div className="bg-[#002147]/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
              {loadingNotifs ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-[#00A3C1] border-t-transparent rounded-full animate-spin" />
                  <span>Loading PostgreSQL notifications...</span>
                </div>
              ) : filteredNotifs.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <Bell className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-base font-semibold">No notifications found</p>
                  <p className="text-xs text-slate-500">
                    Click "Add Notification" to create your first announcement!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#00142D] border-b border-slate-700/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6">Title</th>
                        <th className="py-3.5 px-6">Category</th>
                        <th className="py-3.5 px-6">Redirect Link</th>
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredNotifs.map((notif) => (
                        <tr key={notif.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Status Toggle Badge */}
                          <td className="py-4 px-6">
                            <button
                              onClick={() => toggleActiveStatus(notif)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                                notif.isActive
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                  : 'bg-slate-700/40 text-slate-400 border border-slate-600 hover:bg-slate-700/60'
                              }`}
                            >
                              {notif.isActive ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Title */}
                          <td className="py-4 px-6 font-medium text-white max-w-md">
                            <span className="line-clamp-2">{notif.title}</span>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-6">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-950 text-cyan-300 border border-sky-800">
                              {notif.category}
                            </span>
                          </td>

                          {/* Redirect Link */}
                          <td className="py-4 px-6 text-slate-400">
                            {notif.link ? (
                              <a
                                href={notif.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#00A3C1] hover:underline max-w-[150px] truncate"
                              >
                                <span>{notif.link}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-600">—</span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-4 px-6 text-xs text-slate-400 whitespace-nowrap">
                            {new Date(notif.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => openModal(notif)}
                              className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 rounded-lg transition-all"
                              title="Edit Notification"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(notif.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                              title="Delete Notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#002147] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <h3 className="text-xl font-bold font-serif text-white">
                {editingNotif ? 'Edit Notification' : 'Add New Notification'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Notification Title *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. MSc Physics Semester 2 Exam Schedule Released"
                  className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00A3C1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00A3C1]"
                  >
                    <option value="General">General</option>
                    <option value="Notice">Notice</option>
                    <option value="Event">Event</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Admissions">Admissions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Visibility
                  </label>
                  <div className="flex items-center h-11">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A3C1]"></div>
                      <span className="ml-3 text-xs font-medium text-slate-300">
                        {formData.isActive ? 'Active (Visible)' : 'Inactive (Hidden)'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Redirect Link (Optional)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="e.g. /courses or https://cusat.ac.in/notice.pdf"
                  className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00A3C1]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={closeModal}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 px-5 bg-[#00A3C1] hover:bg-[#008ca7] text-white rounded-xl font-semibold text-xs shadow-lg shadow-[#00A3C1]/20 transition-all flex items-center gap-2"
                >
                  {saving ? 'Saving...' : editingNotif ? 'Update Notification' : 'Create Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
