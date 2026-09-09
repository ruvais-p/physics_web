'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Mail,
  RefreshCw,
  Save,
  Settings,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface GeneralSettingsResponse {
  departmentEmail: string;
  hodEmail: string;
  hasAppPassword: boolean;
  error?: string;
}

export default function GeneralSettingsSection() {
  const [departmentEmail, setDepartmentEmail] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [hasAppPassword, setHasAppPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/settings');
      const data = (await response.json()) as GeneralSettingsResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load general settings.');
      }

      setDepartmentEmail(data.departmentEmail || '');
      setHodEmail(data.hodEmail || '');
      setHasAppPassword(Boolean(data.hasAppPassword));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load general settings.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialSettings() {
      try {
        const response = await fetch('/api/admin/settings');
        const data = (await response.json()) as GeneralSettingsResponse;

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load general settings.');
        }

        setDepartmentEmail(data.departmentEmail || '');
        setHodEmail(data.hodEmail || '');
        setHasAppPassword(Boolean(data.hasAppPassword));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load general settings.',
        );
      } finally {
        setLoading(false);
      }
    }

    void loadInitialSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentEmail, hodEmail, appPassword }),
      });
      const data = (await response.json()) as GeneralSettingsResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save general settings.');
      }

      setDepartmentEmail(data.departmentEmail);
      setHodEmail(data.hodEmail);
      setHasAppPassword(Boolean(data.hasAppPassword));
      setAppPassword('');
      setSuccess('General email settings saved successfully.');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save general settings.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-oxford" />
          <span>General Settings</span>
        </h2>
        <p className="text-slate-600 text-base mt-1 font-sans">
          Configure the department mailbox used for online inquiries and the HOD recipient.
        </p>
      </div>

      <Card className="max-w-3xl bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
              <RefreshCw className="w-7 h-7 animate-spin text-cyan-dark" />
              <p className="text-sm font-semibold">Loading general settings...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              {error && (
                <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="settings-department-email"
                  className="text-sm font-bold text-slate-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-oxford" />
                  Department Email
                </label>
                <Input
                  id="settings-department-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={departmentEmail}
                  onChange={(event) => setDepartmentEmail(event.target.value)}
                  placeholder="department@example.edu"
                  className="h-12 text-base"
                />
                <p className="text-xs text-slate-500">
                  Inquiry and acknowledgment emails are sent from this address.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="settings-app-password"
                  className="text-sm font-bold text-slate-700 flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-oxford" />
                  Department Email App Password
                </label>
                <Input
                  id="settings-app-password"
                  type="password"
                  autoComplete="new-password"
                  required={!hasAppPassword}
                  value={appPassword}
                  onChange={(event) => setAppPassword(event.target.value)}
                  placeholder={
                    hasAppPassword
                      ? 'Leave blank to keep the saved app password'
                      : 'Enter the mailbox app password'
                  }
                  className="h-12 text-base"
                />
                <p className="text-xs text-slate-500">
                  {hasAppPassword
                    ? 'An encrypted app password is saved. Enter a new one only to replace it.'
                    : 'Use an app password for the Google or Google Workspace mailbox.'}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="settings-hod-email"
                  className="text-sm font-bold text-slate-700 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-oxford" />
                  HOD Email
                </label>
                <Input
                  id="settings-hod-email"
                  type="email"
                  required
                  value={hodEmail}
                  onChange={(event) => setHodEmail(event.target.value)}
                  placeholder="hod@example.edu"
                  className="h-12 text-base"
                />
                <p className="text-xs text-slate-500">
                  Every online inquiry is delivered to this address.
                </p>
              </div>

              <div className="pt-5 border-t border-slate-200 flex flex-wrap gap-3">
                <Button type="submit" disabled={saving} className="h-11 px-6">
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => void loadSettings()}
                  className="h-11"
                >
                  Reload
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
