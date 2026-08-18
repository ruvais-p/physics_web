'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <Card className="w-full max-w-md bg-white border border-[#e8e2d5] rounded-2xl p-4 shadow-xl relative z-10">
      <CardHeader className="text-center space-y-2 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-oxford/5 border border-oxford/10 text-oxford mx-auto flex items-center justify-center shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
          Department Portal Sign In
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Sign in with your registered email address and password.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Email Address (Username)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@physics.cusat.ac.in"
                className="pl-10 text-base h-12 bg-white text-slate-900 border-[#e8e2d5] focus:ring-2 focus:ring-oxford"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 text-base h-12 bg-white text-slate-900 border-[#e8e2d5] focus:ring-2 focus:ring-oxford"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-oxford hover:bg-oxford/90 active:bg-oxford-dark text-white font-semibold text-base rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function UnifiedLoginPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-slate-900 flex items-center justify-center font-serif selection:bg-oxford selection:text-white relative overflow-hidden p-6">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-900/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <Suspense
        fallback = {
          <Card className="w-full max-w-md bg-white border border-[#e8e2d5] rounded-2xl p-12 text-center flex items-center justify-center shadow-xl">
            <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
          </Card>
        }
      >
        <UnifiedLoginForm />
      </Suspense>
    </div>
  );
}
