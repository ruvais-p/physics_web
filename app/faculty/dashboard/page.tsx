'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Atom,
  LogOut,
  UserCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap
} from 'lucide-react';

interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  department: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
}

export default function FacultyDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/faculty/me');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (data.mustChangePassword) {
          setShowPasswordModal(true);
        }
      } else {
        router.push('/faculty/login');
      }
    } catch (err) {
      console.error('Failed to load faculty profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/faculty/logout', { method: 'POST' });
      router.push('/faculty/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch('/api/faculty/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setPasswordSuccess('Password updated successfully! Your account is now secure.');
      setProfile((prev) => (prev ? { ...prev, mustChangePassword: false } : null));

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'An error occurred.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00142D] text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading Faculty Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00142D] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="bg-[#002147] border-b border-slate-700/60 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif text-white">Department of Physics</h1>
            <p className="text-xs text-indigo-300">Faculty Portal • Logged in as {profile?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setPasswordError(null);
              setPasswordSuccess(null);
              setNewPassword('');
              setConfirmPassword('');
              setShowPasswordModal(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Warning Banner if Predefined Password hasn't been changed yet */}
      {profile?.mustChangePassword && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between text-amber-200 text-xs">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Security Notice:</strong> You are currently using a predefined initial password. Please update your password to maintain account security.
            </span>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-oxford-dark font-bold rounded-lg text-xs transition-all shadow"
          >
            Change Password Now
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#002147] to-[#003366] border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <UserCheck className="w-3.5 h-3.5" /> Authenticated Faculty Account
            </span>
            <h2 className="text-2xl font-bold font-serif text-white">
              Welcome, {profile?.name}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm">
              {profile?.designation || 'Faculty Member'} • {profile?.department || 'Department of Physics, CUSAT'}
            </p>
          </div>
        </div>

        {/* Placeholder Faculty Portal Modules (Empty for now as requested) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#002147]/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all opacity-80">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white font-serif">Profile & Biography</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Update personal biography, office hours, academic degrees, and contact details.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 font-medium">
              Faculty Module Coming Soon
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#002147]/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all opacity-80">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white font-serif">Research & Publications</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit research paper titles, journal citations, patents, and active lab projects.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 font-medium">
              Faculty Module Coming Soon
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#002147]/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all opacity-80">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white font-serif">Courses & Scholars</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage assigned MSc/Ph.D. courses, syllabus uploads, and guided research scholars.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 font-medium">
              Faculty Module Coming Soon
            </div>
          </div>
        </div>
      </main>

      {/* Mandatory / Required Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#002147] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  {profile?.mustChangePassword ? 'First Login: Change Password' : 'Update Password'}
                </h3>
              </div>

              {!profile?.mustChangePassword && (
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {profile?.mustChangePassword && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  As part of department security, you must update your predefined password to a new personal password on initial login.
                </span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  New Personal Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-700/60">
                {!profile?.mustChangePassword && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  {changingPassword ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Password & Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
