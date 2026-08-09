'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Atom, Lock, Mail, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function FacultyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/faculty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your email and password.');
      }

      router.push('/faculty/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while signing in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00142D] text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#00A3C1]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-800/80 bg-[#00142D]/80 backdrop-blur-md relative z-10">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-all">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white tracking-tight block">
              Department of Physics
            </span>
            <span className="text-xs text-indigo-300 font-sans tracking-wide">
              Faculty Portal
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Main Website
        </Link>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-[#002147]/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
              Faculty Portal Sign In
            </h1>
            <p className="text-xs text-slate-400">
              Sign in with your registered faculty email address and password.
            </p>
          </div>

          {/* Alert Message Box */}
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-start gap-2.5 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Faculty Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Faculty Email (Username)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. faculty@physics.cusat.ac.in"
                  className="w-full pl-10 pr-4 py-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                />
              </div>
            </div>

            {/* Hint Notice */}
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 leading-relaxed">
              <span className="font-semibold text-indigo-200 block mb-0.5">First Time Signing In?</span>
              Use the email address and predefined password provided by the Department Administrator. You will be prompted to set a new personal password after signing in.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Faculty Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 relative z-10 border-t border-slate-800/60">
        © {new Date().getFullYear()} Department of Physics, CUSAT. All rights reserved.
      </footer>
    </div>
  );
}
