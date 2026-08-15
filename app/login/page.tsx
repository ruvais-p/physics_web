'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

function UnifiedLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      // Priority redirect: `from` param from URL, or backend default (`redirectTo`)
      const fromParam = searchParams.get('from');
      const targetDestination = fromParam || data.redirectTo || '/';
      
      router.push(targetDestination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while signing in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#002147]/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6 relative z-10">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
          Department Portal Sign In
        </h1>
        <p className="text-xs text-slate-400">
          Sign in with your registered email address and password.
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-start gap-2.5 animate-fadeIn">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Email Address (Username)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. faculty@physics.cusat.ac.in"
              className="w-full pl-10 pr-4 py-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Password Input */}
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
              className="w-full pl-10 pr-4 py-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <>
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function UnifiedLoginPage() {
  return (
    <div className="min-h-screen bg-[#00142D] text-slate-100 flex items-center justify-center font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden p-6">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#00A3C1]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-[#002147]/90 border border-slate-700/80 rounded-2xl p-12 text-center flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <UnifiedLoginForm />
      </Suspense>
    </div>
  );
}
