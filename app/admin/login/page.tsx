'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Redirect to dashboard or return url
      const from = searchParams.get('from') || '/admin/dashboard';
      router.push(from);
      router.refresh();
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00142D] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white selection:bg-[#00A3C1] selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00A3C1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#002147]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#002147] border border-[#00A3C1]/40 text-[#00A3C1] mb-4 shadow-lg shadow-[#00A3C1]/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-serif">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Department of Physics — CUSAT
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#002147]/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@physics.cusat.ac.in"
                  className="w-full pl-11 pr-4 py-3 bg-[#00142D]/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00A3C1] focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[#00142D]/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00A3C1] focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#00A3C1] hover:bg-[#008ca7] disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-[#00A3C1]/20 flex items-center justify-center gap-2 transition-all group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-400">
              Default Seed Email: <code className="text-[#00A3C1] bg-slate-900/60 px-1.5 py-0.5 rounded">admin@physics.cusat.ac.in</code>
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Secure Authentication • Connected to Local PostgreSQL
        </div>
      </div>
    </div>
  );
}
