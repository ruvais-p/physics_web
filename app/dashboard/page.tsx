'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LogOut,
  Bell,
  FlaskConical,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  RefreshCw,
  LayoutDashboard,
  Users,
  UserPlus,
  Atom,
  UserCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  GraduationCap,
  Phone,
  Globe,
  BookOpen,
  Share2,
  Sparkles,
  Upload,
  FileCheck,
  FilePlus,
  Image as ImageIcon,
  Download,
  User,
  Heading,
  Bold,
  Italic,
  List,
  Quote as QuoteIcon,
  Code,
  Link as LinkIcon,
  Edit3,
  ChevronUp,
  ChevronDown,
  Sliders,
  Calendar,
} from 'lucide-react';
import AdminFacultyFullManageModal from '@/components/AdminFacultyFullManageModal';
import EventGallerySection from '@/components/EventGallerySection';

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

// Types for Admin View
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

// Types for Faculty View
interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  department: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
  phone?: string | null;
}

interface PredefinedPlatform {
  key: string;
  label: string;
  placeholder: string;
  badgeBg: string;
  badgeText: string;
}

const PREDEFINED_PLATFORMS: PredefinedPlatform[] = [
  {
    key: 'google_scholar',
    label: 'Google Scholar',
    placeholder: 'https://scholar.google.com/citations?user=...',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeText: 'text-blue-400',
  },
  {
    key: 'scopus',
    label: 'Scopus',
    placeholder: 'https://www.scopus.com/authid/detail.uri?authorId=...',
    badgeBg: 'bg-[#FF6C00]/10 border-[#FF6C00]/30',
    badgeText: 'text-[#FF8C33]',
  },
  {
    key: 'orcid',
    label: 'ORCID',
    placeholder: 'https://orcid.org/0000-0000-0000-0000',
    badgeBg: 'bg-[#A6CE39]/10 border-[#A6CE39]/30',
    badgeText: 'text-[#BBE049]',
  },
  {
    key: 'moodle',
    label: 'Moodle',
    placeholder: 'https://moodle.cusat.ac.in/...',
    badgeBg: 'bg-[#F26522]/10 border-[#F26522]/30',
    badgeText: 'text-[#FF7F42]',
  },
  {
    key: 'iqac_profile',
    label: 'IQAC Profile',
    placeholder: 'https://iqac.cusat.ac.in/faculty/...',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeText: 'text-emerald-400',
  },
  {
    key: 'iris',
    label: 'IRIS',
    placeholder: 'https://iris.cusat.ac.in/profile/...',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-300',
  },
  {
    key: 'youtube',
    label: 'YouTube Channel',
    placeholder: 'https://youtube.com/@channel',
    badgeBg: 'bg-red-500/10 border-red-500/30',
    badgeText: 'text-red-400',
  },
  {
    key: 'personal_website',
    label: 'Personal Website',
    placeholder: 'https://www.mywebsite.com',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-cyan-400',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    badgeBg: 'bg-sky-500/10 border-sky-500/30',
    badgeText: 'text-sky-400',
  },
];

interface CustomProfileEntry {
  id: string;
  name: string;
  url: string;
}

interface StudentItem {
  uid: string;
  facultyId: string;
  name: string;
  description: string | null;
  image: string | null;
  createdAt: string;
}

interface ProjectItem {
  id: string;
  facultyId: string;
  title: string;
  description: string | null;
  agency: string | null;
  role: string | null;
  funding: string | null;
  startDate: string | null;
  endDate: string | null;
  externalLink: string | null;
  otherFaculty: string | null;
  status: string | null;
  createdAt: string;
  faculty?: { id: string; name: string; email: string } | null;
}

// Markdown Parser Helper Function for Faculty Description
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-xs text-slate-500 italic">No professional description added yet.</p>;
  }

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul_${elements.length}`} className="list-disc ml-5 space-y-1.5 my-2 text-xs text-slate-300">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol_${elements.length}`} className="list-decimal ml-5 space-y-1.5 my-2 text-xs text-slate-300">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    flushList();

    if (!trimmed) {
      elements.push(<div key={`br_${index}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-xl font-bold font-serif text-white mt-4 mb-2 border-b border-slate-700/60 pb-1">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-lg font-bold font-serif text-indigo-300 mt-3 mb-1.5">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mt-2.5 mb-1">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-2 border-indigo-400 pl-3 py-1.5 text-slate-300 italic text-xs my-2 bg-indigo-500/10 rounded-r-lg">
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={index} className="text-xs text-slate-300 leading-relaxed my-1">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return <div className="space-y-1 font-sans">{elements}</div>;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining) {
    const linkMatch = remaining.match(/^([\s\S]*?)\[([^\]]+)\]\(([^)]+)\)([\s\S]*)$/);
    if (linkMatch) {
      const [, before, label, url, after] = linkMatch;
      if (before) parts.push(parseFormatting(before, keyIdx++));
      parts.push(
        <a key={keyIdx++} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5">
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      );
      remaining = after;
      continue;
    }

    parts.push(parseFormatting(remaining, keyIdx++));
    break;
  }

  return parts;
}

function parseFormatting(text: string, keyPrefix: number): React.ReactNode {
  const elements: React.ReactNode[] = [];
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      elements.push(<strong key={`${keyPrefix}_b_${match.index}`} className="font-bold text-white">{match[2]}</strong>);
    } else if (match[3]) {
      elements.push(<em key={`${keyPrefix}_i_${match.index}`} className="italic text-slate-200">{match[4]}</em>);
    } else if (match[5]) {
      elements.push(<code key={`${keyPrefix}_c_${match.index}`} className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono text-[11px]">{match[6]}</code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 1 ? elements[0] : <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

interface HeroSlideItem {
  id: number;
  image: string;
  title: string;
  description: string;
  is_visible: boolean;
  order: number;
  createdAt: string;
}

export default function UnifiedDashboardPage() {
  const router = useRouter();

  // Unified Session State
  const [loadingSession, setLoadingSession] = useState(true);
  const [role, setRole] = useState<'admin' | 'faculty' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // -------------------------------------------------------------
  // ADMIN DASHBOARD STATES & HANDLERS
  // -------------------------------------------------------------
  const [adminTab, setAdminTab] = useState<'dashboard' | 'about' | 'hero' | 'events' | 'notifications' | 'faculty'>('dashboard');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Events Management States
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    apply_link: '',
    imageFile: null as File | null,
    imageUrl: '',
  });
  const [eventSaving, setEventSaving] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEventsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const openEventModal = (ev?: any) => {
    setEventError(null);
    if (ev) {
      setEditingEvent(ev);
      const d = new Date(ev.date);
      const isoLocal = !isNaN(d.getTime()) ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
      setEventFormData({
        title: ev.title || '',
        description: ev.description || '',
        date: isoLocal,
        venue: ev.venue || '',
        apply_link: ev.apply_link || '',
        imageFile: null,
        imageUrl: ev.image || '',
      });
      setEventImagePreview(ev.image || null);
    } else {
      setEditingEvent(null);
      setEventFormData({
        title: '',
        description: '',
        date: new Date().toISOString().slice(0, 16),
        venue: '',
        apply_link: '',
        imageFile: null,
        imageUrl: '',
      });
      setEventImagePreview(null);
    }
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setEventImagePreview(null);
  };

  const handleEventSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventError(null);

    if (!eventFormData.title.trim()) {
      setEventError('Event Title is required');
      return;
    }
    if (!eventFormData.description.trim()) {
      setEventError('Event Description is required');
      return;
    }
    if (!eventFormData.date.trim()) {
      setEventError('Event Date is required');
      return;
    }
    if (!editingEvent && !eventFormData.imageFile && !eventFormData.imageUrl.trim()) {
      setEventError('Please provide an Image File or Image URL');
      return;
    }

    setEventSaving(true);

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('title', eventFormData.title.trim());
      formData.append('description', eventFormData.description.trim());
      formData.append('date', eventFormData.date);
      formData.append('venue', eventFormData.venue.trim());
      formData.append('apply_link', eventFormData.apply_link.trim());

      if (eventFormData.imageFile) {
        formData.append('image', eventFormData.imageFile);
      } else if (eventFormData.imageUrl) {
        formData.append('imageUrl', eventFormData.imageUrl.trim());
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save event');
      }

      await fetchEvents();
      closeEventModal();
    } catch (err: any) {
      setEventError(err.message || 'An error occurred while saving event.');
    } finally {
      setEventSaving(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEventsList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // About Us CMS States
  const [aboutContent, setAboutContent] = useState('');
  const [aboutImagePath, setAboutImagePath] = useState<string | null>(null);
  const [aboutActiveTab, setAboutActiveTab] = useState<'write' | 'preview'>('write');
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [aboutSuccess, setAboutSuccess] = useState<string | null>(null);
  const [selectedAboutImageFile, setSelectedAboutImageFile] = useState<File | null>(null);
  const [aboutImageUrlInput, setAboutImageUrlInput] = useState('');
  const [aboutImagePreviewUrl, setAboutImagePreviewUrl] = useState<string | null>(null);

  const fetchCmsAbout = async () => {
    setLoadingAbout(true);
    try {
      const res = await fetch('/api/cms/about');
      if (res.ok) {
        const data = await res.json();
        setAboutContent(data.content || '');
        setAboutImagePath(data.image || null);
        setAboutImageUrlInput(data.image || '');
        setAboutImagePreviewUrl(data.image || null);
      }
    } catch (err) {
      console.error('Failed to fetch CMS about us:', err);
    } finally {
      setLoadingAbout(false);
    }
  };

  const insertAboutMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('aboutMarkdownTextarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = aboutContent.substring(start, end) || 'Sample text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = aboutContent.substring(0, start) + replacement + aboutContent.substring(end);
    setAboutContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const handleSaveAboutUs = async (e: React.FormEvent) => {
    e.preventDefault();
    setAboutError(null);
    setAboutSuccess(null);

    if (!aboutContent.trim()) {
      setAboutError('About Us content cannot be empty.');
      return;
    }

    setSavingAbout(true);

    try {
      const formData = new FormData();
      formData.append('content', aboutContent.trim());
      if (selectedAboutImageFile) {
        formData.append('image', selectedAboutImageFile);
      } else if (aboutImageUrlInput.trim()) {
        formData.append('imageUrl', aboutImageUrlInput.trim());
      }

      const res = await fetch('/api/cms/about', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save About Us content.');
      }

      setAboutImagePath(data.data.image || aboutImagePath);
      setSelectedAboutImageFile(null);
      setAboutSuccess('About Us page content and department hero image updated successfully!');
      setTimeout(() => setAboutSuccess(null), 4000);
    } catch (err: any) {
      setAboutError(err.message || 'An error occurred while saving About Us content.');
    } finally {
      setSavingAbout(false);
    }
  };

  // Hero Carousel States
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>([]);
  const [loadingHero, setLoadingHero] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlideItem | null>(null);
  const [heroFormData, setHeroFormData] = useState({
    title: '',
    description: '',
    imageFile: null as File | null,
    imageUrl: '',
    is_visible: true,
  });
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroFormError, setHeroFormError] = useState<string | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

  const fetchHeroSlides = async () => {
    setLoadingHero(true);
    try {
      const res = await fetch('/api/cms/hero');
      if (res.ok) {
        const data = await res.json();
        setHeroSlides(data);
      }
    } catch (err) {
      console.error('Failed to fetch hero slides:', err);
    } finally {
      setLoadingHero(false);
    }
  };

  const openHeroModal = (slide?: HeroSlideItem) => {
    setHeroFormError(null);
    if (slide) {
      setEditingHeroSlide(slide);
      setHeroFormData({
        title: slide.title,
        description: slide.description,
        imageFile: null,
        imageUrl: slide.image,
        is_visible: slide.is_visible,
      });
      setHeroImagePreview(slide.image);
    } else {
      setEditingHeroSlide(null);
      setHeroFormData({
        title: '',
        description: '',
        imageFile: null,
        imageUrl: '',
        is_visible: true,
      });
      setHeroImagePreview(null);
    }
    setIsHeroModalOpen(true);
  };

  const closeHeroModal = () => {
    setIsHeroModalOpen(false);
    setEditingHeroSlide(null);
    setHeroImagePreview(null);
  };

  const handleHeroSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroFormError(null);

    if (!heroFormData.title.trim()) {
      setHeroFormError('Title is required');
      return;
    }

    if (heroFormData.title.trim().length > 80) {
      setHeroFormError('Title cannot exceed 80 characters');
      return;
    }

    if (heroFormData.description.trim().length > 200) {
      setHeroFormError('Description cannot exceed 200 characters');
      return;
    }

    if (!editingHeroSlide && !heroFormData.imageFile && !heroFormData.imageUrl.trim()) {
      setHeroFormError('Please provide an image file or image URL');
      return;
    }

    setHeroSaving(true);

    try {
      const url = editingHeroSlide
        ? `/api/cms/hero/${editingHeroSlide.id}`
        : '/api/cms/hero';
      const method = editingHeroSlide ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('title', heroFormData.title.trim());
      formData.append('description', heroFormData.description.trim());
      formData.append('is_visible', String(heroFormData.is_visible));

      if (heroFormData.imageFile) {
        formData.append('image', heroFormData.imageFile);
      } else if (heroFormData.imageUrl) {
        formData.append('imageUrl', heroFormData.imageUrl.trim());
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save hero slide');
      }

      await fetchHeroSlides();
      closeHeroModal();
    } catch (err: any) {
      setHeroFormError(err.message || 'An error occurred while saving hero slide.');
    } finally {
      setHeroSaving(false);
    }
  };

  const toggleHeroVisibility = async (slide: HeroSlideItem) => {
    try {
      const res = await fetch(`/api/cms/hero/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_visible: !slide.is_visible,
        }),
      });

      if (res.ok) {
        setHeroSlides((prev) =>
          prev.map((item) =>
            item.id === slide.id ? { ...item, is_visible: !item.is_visible } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle hero slide visibility:', err);
    }
  };

  const handleDeleteHeroSlide = async (id: number) => {
    if (!confirm('Are you sure you want to delete this Hero slide?')) return;

    try {
      const res = await fetch(`/api/cms/hero/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHeroSlides((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete hero slide:', err);
    }
  };

  const moveHeroSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;

    const newSlides = [...heroSlides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const itemsToUpdate = newSlides.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    setHeroSlides(newSlides.map((item, idx) => ({ ...item, order: idx + 1 })));

    try {
      await fetch('/api/cms/hero/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });
    } catch (err) {
      console.error('Failed to reorder hero slides:', err);
      fetchHeroSlides();
    }
  };

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

  const [facultyList, setFacultyList] = useState<FacultyItem[]>([]);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const [facultySearchTerm, setFacultySearchTerm] = useState('');

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

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // FACULTY DASHBOARD STATES & HANDLERS
  // -------------------------------------------------------------
  const [facultyTab, setFacultyTab] = useState<'overview' | 'profile' | 'scholars' | 'projects' | 'hero' | 'events'>('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [phone, setPhone] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [platformUrls, setPlatformUrls] = useState<Record<string, string>>({});
  const [otherProfiles, setOtherProfiles] = useState<CustomProfileEntry[]>([]);
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);
  const [savingProfiles, setSavingProfiles] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);
  const [profilesSuccess, setProfilesSuccess] = useState<string | null>(null);

  const [imagePath, setImagePath] = useState<string | null>(null);
  const [cvPath, setCvPath] = useState<string | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [docSuccess, setDocSuccess] = useState<string | null>(null);

  const [markdownContent, setMarkdownContent] = useState('');
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [descActiveTab, setDescActiveTab] = useState<'write' | 'preview'>('write');
  const [savingDesc, setSavingDesc] = useState(false);
  const [descError, setDescError] = useState<string | null>(null);
  const [descSuccess, setDescSuccess] = useState<string | null>(null);

  const [studentsList, setStudentsList] = useState<StudentItem[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentDescription, setStudentDescription] = useState('');
  const [selectedStudentImageFile, setSelectedStudentImageFile] = useState<File | null>(null);
  const [studentImagePreviewUrl, setStudentImagePreviewUrl] = useState<string | null>(null);
  const [deleteStudentImageFlag, setDeleteStudentImageFlag] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentSuccess, setStudentSuccess] = useState<string | null>(null);

  // Faculty Projects State & Handlers
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [allDbFaculty, setAllDbFaculty] = useState<{ id: string; name: string; designation?: string }[]>([]);
  const [selectedCoFacultyNames, setSelectedCoFacultyNames] = useState<string[]>([]);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    role: 'Principal Investigator',
    agency: '',
    funding: '',
    startDate: '',
    endDate: '',
    externalLink: '',
    otherFaculty: '',
  });
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch('/api/faculty/projects');
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch faculty projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const openProjectModal = (proj?: ProjectItem) => {
    setProjectError(null);
    if (proj) {
      setEditingProject(proj);
      setProjectFormData({
        title: proj.title || '',
        description: proj.description || '',
        role: proj.role || 'Principal Investigator',
        agency: proj.agency || '',
        funding: proj.funding || '',
        startDate: proj.startDate ? new Date(proj.startDate).toISOString().slice(0, 10) : '',
        endDate: proj.endDate ? new Date(proj.endDate).toISOString().slice(0, 10) : '',
        externalLink: proj.externalLink || '',
        otherFaculty: proj.otherFaculty || '',
      });

      if (proj.otherFaculty) {
        const parts = proj.otherFaculty.split(',').map((s) => s.trim()).filter(Boolean);
        const dbNames = allDbFaculty.map((f) => f.name);
        const selected = parts.filter((p) => dbNames.includes(p));
        setSelectedCoFacultyNames(selected);
      } else {
        setSelectedCoFacultyNames([]);
      }
    } else {
      setEditingProject(null);
      setProjectFormData({
        title: '',
        description: '',
        role: 'Principal Investigator',
        agency: '',
        funding: '',
        startDate: '',
        endDate: '',
        externalLink: '',
        otherFaculty: '',
      });
      setSelectedCoFacultyNames([]);
    }
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectError(null);

    if (!projectFormData.title.trim()) {
      setProjectError('Project Title is required');
      return;
    }

    setSavingProject(true);

    const combinedCoFaculty = selectedCoFacultyNames.join(', ');

    try {
      const url = editingProject
        ? `/api/faculty/projects/${editingProject.id}`
        : '/api/faculty/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectFormData.title.trim(),
          description: projectFormData.description.trim(),
          role: projectFormData.role.trim(),
          agency: projectFormData.agency.trim(),
          funding: projectFormData.funding.trim(),
          startDate: projectFormData.startDate || null,
          endDate: projectFormData.endDate || null,
          externalLink: projectFormData.externalLink.trim(),
          otherFaculty: combinedCoFaculty,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save research project.');
      }

      await fetchProjects();
      closeProjectModal();
    } catch (err: any) {
      setProjectError(err.message || 'An error occurred while saving project.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research project record?')) return;

    try {
      const res = await fetch(`/api/faculty/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjectsList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete research project:', err);
    }
  };

  // -------------------------------------------------------------
  // INITIAL SESSION FETCH
  // -------------------------------------------------------------
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setRole(data.role);
        setCurrentUser(data.user);

        if (data.role === 'admin') {
          fetchNotifications();
          fetchFaculty();
          fetchHeroSlides();
          fetchCmsAbout();
          fetchEvents();
        } else if (data.role === 'faculty') {
          fetchFacultySelfData(data.user);
          fetchHeroSlides();
          fetchEvents();
        }
      } catch (err) {
        console.error('Session check failed:', err);
        router.push('/login');
      } finally {
        setLoadingSession(false);
      }
    }

    checkAuthSession();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // -------------------------------------------------------------
  // ADMIN FETCH & HANDLERS
  // -------------------------------------------------------------
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

  const handleSaveNotification = async (e: React.FormEvent) => {
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

  const handleDeleteNotification = async (id: string) => {
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

  // -------------------------------------------------------------
  // FACULTY FETCH & HANDLERS
  // -------------------------------------------------------------
  const fetchFacultySelfData = async (userData?: any) => {
    try {
      const [profileRes, docRes, descRes, studentsRes, projectsRes, allFacultyRes] = await Promise.all([
        fetch('/api/faculty/profile'),
        fetch('/api/faculty/documents'),
        fetch('/api/faculty/description'),
        fetch('/api/faculty/students'),
        fetch('/api/faculty/projects'),
        fetch('/api/public/faculty'),
      ]);

      if (userData?.mustChangePassword) {
        setShowPasswordModal(true);
      }

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setPhone(pData.phone || userData?.phone || '');

        const profs = pData.profiles || {};
        const sel = new Set<string>();
        const urls: Record<string, string> = {};

        PREDEFINED_PLATFORMS.forEach((p) => {
          if (profs[p.key]) {
            sel.add(p.key);
            urls[p.key] = profs[p.key];
          }
        });

        setSelectedPlatforms(sel);
        setPlatformUrls(urls);

        if (Array.isArray(profs.other)) {
          setOtherProfiles(
            profs.other.map((item: any, idx: number) => ({
              id: `custom_${idx}_${Date.now()}`,
              name: item.name || '',
              url: item.url || '',
            }))
          );
        } else {
          setOtherProfiles([]);
        }
      }

      if (docRes.ok) {
        const dData = await docRes.json();
        setImagePath(dData.image || null);
        setCvPath(dData.cv || null);
      }

      if (descRes.ok) {
        const descData = await descRes.json();
        setMarkdownContent(descData.description || '');
      }

      if (studentsRes.ok) {
        const stData = await studentsRes.json();
        setStudentsList(stData);
      }

      if (projectsRes.ok) {
        const prData = await projectsRes.json();
        setProjectsList(prData);
      }

      if (allFacultyRes.ok) {
        const afData = await allFacultyRes.json();
        setAllDbFaculty(afData.map((f: any) => ({ id: f.id, name: f.name, designation: f.designation })));
      }
    } catch (err) {
      console.error('Failed to load faculty self data:', err);
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
      setCurrentUser((prev: any) => (prev ? { ...prev, mustChangePassword: false } : null));

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

  const togglePlatform = (key: string) => {
    const next = new Set(selectedPlatforms);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedPlatforms(next);
  };

  const handleUrlChange = (key: string, value: string) => {
    setPlatformUrls((prev) => ({ ...prev, [key]: value }));
  };

  const addCustomProfile = () => {
    setOtherProfiles((prev) => [
      ...prev,
      { id: `custom_${Date.now()}`, name: '', url: '' },
    ]);
  };

  const updateCustomProfile = (id: string, field: 'name' | 'url', value: string) => {
    setOtherProfiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeCustomProfile = (id: string) => {
    setOtherProfiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveProfiles = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilesError(null);
    setProfilesSuccess(null);
    setSavingProfiles(true);

    try {
      const profilesPayload: Record<string, any> = {};

      selectedPlatforms.forEach((key) => {
        const urlVal = (platformUrls[key] || '').trim();
        if (urlVal) {
          profilesPayload[key] = urlVal;
        }
      });

      const validOther = otherProfiles
        .map((op) => ({ name: op.name.trim(), url: op.url.trim() }))
        .filter((op) => op.name && op.url);

      if (validOther.length > 0) {
        profilesPayload.other = validOther;
      }

      const res = await fetch('/api/faculty/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          profiles: profilesPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update contact & public profiles.');
      }

      setProfilesSuccess('Contact details and public profiles updated successfully!');
      setTimeout(() => {
        setIsProfilesModalOpen(false);
        setProfilesSuccess(null);
      }, 1500);
    } catch (err: any) {
      setProfilesError(err.message || 'An error occurred while saving profiles.');
    } finally {
      setSavingProfiles(false);
    }
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setDocError('Invalid image type. Please select a JPG, PNG, or WebP file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setDocError('Image file size exceeds the 5MB limit.');
      return;
    }

    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleCvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setDocError('Invalid CV document format. Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setDocError('CV file size exceeds the 10MB limit.');
      return;
    }

    setSelectedCvFile(file);
  };

  const handleSaveDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocError(null);
    setDocSuccess(null);

    if (!selectedImageFile && !selectedCvFile) {
      setDocError('Please select a profile image or CV PDF file to upload.');
      return;
    }

    setUploadingDocs(true);

    try {
      const formData = new FormData();
      if (selectedImageFile) formData.append('image', selectedImageFile);
      if (selectedCvFile) formData.append('cv', selectedCvFile);

      const res = await fetch('/api/faculty/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload documents.');
      }

      setImagePath(data.image || imagePath);
      setCvPath(data.cv || cvPath);
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setSelectedCvFile(null);

      setDocSuccess('Professional documents uploaded and saved successfully!');
      setTimeout(() => {
        setIsDocModalOpen(false);
        setDocSuccess(null);
      }, 1500);
    } catch (err: any) {
      setDocError(err.message || 'An error occurred during file upload.');
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleDeleteDocument = async (type: 'image' | 'cv') => {
    const typeLabel = type === 'image' ? 'profile image' : 'CV document';
    if (!confirm(`Are you sure you want to delete your current ${typeLabel}?`)) return;

    setDocError(null);
    setDocSuccess(null);

    try {
      const res = await fetch(`/api/faculty/documents?type=${type}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to delete ${typeLabel}.`);
      }

      if (type === 'image') {
        setImagePath(null);
        setSelectedImageFile(null);
        setImagePreviewUrl(null);
      } else {
        setCvPath(null);
        setSelectedCvFile(null);
      }

      setDocSuccess(`Successfully deleted ${typeLabel}.`);
      setTimeout(() => setDocSuccess(null), 2000);
    } catch (err: any) {
      setDocError(err.message || `Failed to delete ${typeLabel}.`);
    }
  };

  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdown-editor-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end) || 'text';

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    setMarkdownContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const handleSaveDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setDescError(null);
    setDescSuccess(null);
    setSavingDesc(true);

    try {
      const res = await fetch('/api/faculty/description', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: markdownContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save professional description.');
      }

      setDescSuccess('Professional description updated and saved successfully!');
      setTimeout(() => {
        setIsDescModalOpen(false);
        setDescSuccess(null);
      }, 1500);
    } catch (err: any) {
      setDescError(err.message || 'An error occurred while saving description.');
    } finally {
      setSavingDesc(false);
    }
  };

  const handleStudentImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setStudentError('Invalid image type. Please select a JPG, PNG, or WebP file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStudentError('Student image file size exceeds the 5MB limit.');
      return;
    }

    setSelectedStudentImageFile(file);
    setStudentImagePreviewUrl(URL.createObjectURL(file));
    setDeleteStudentImageFlag(false);
  };

  const openStudentModal = (student?: StudentItem) => {
    setStudentError(null);
    setStudentSuccess(null);
    if (student) {
      setEditingStudent(student);
      setStudentName(student.name);
      setStudentDescription(student.description || '');
      setSelectedStudentImageFile(null);
      setStudentImagePreviewUrl(student.image || null);
      setDeleteStudentImageFlag(false);
    } else {
      setEditingStudent(null);
      setStudentName('');
      setStudentDescription('');
      setSelectedStudentImageFile(null);
      setStudentImagePreviewUrl(null);
      setDeleteStudentImageFlag(false);
    }
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setEditingStudent(null);
    setSelectedStudentImageFile(null);
    setStudentImagePreviewUrl(null);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);
    setStudentSuccess(null);

    if (!studentName.trim()) {
      setStudentError('Student name is required.');
      return;
    }

    setSavingStudent(true);

    try {
      const formData = new FormData();
      formData.append('name', studentName.trim());
      formData.append('description', studentDescription.trim());

      if (selectedStudentImageFile) {
        formData.append('image', selectedStudentImageFile);
      }

      if (deleteStudentImageFlag) {
        formData.append('deleteImage', 'true');
      }

      const url = editingStudent
        ? `/api/faculty/students/${editingStudent.uid}`
        : '/api/faculty/students';
      const method = editingStudent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save student record.');
      }

      setStudentSuccess(
        editingStudent
          ? 'Student research profile updated successfully!'
          : 'Guided student record created successfully!'
      );

      const fetchStudentsRes = await fetch('/api/faculty/students');
      if (fetchStudentsRes.ok) {
        const stData = await fetchStudentsRes.json();
        setStudentsList(stData);
      }

      setTimeout(() => {
        closeStudentModal();
        setStudentSuccess(null);
      }, 1200);
    } catch (err: any) {
      setStudentError(err.message || 'An error occurred while saving student profile.');
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDeleteStudent = async (uid: string) => {
    if (!confirm('Are you sure you want to remove this guided student from your profile?')) return;

    try {
      const res = await fetch(`/api/faculty/students/${uid}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStudentsList((prev) => prev.filter((s) => s.uid !== uid));
      }
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  // -------------------------------------------------------------
  // RENDER LOADING STATE
  // -------------------------------------------------------------
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center space-y-4 font-serif text-slate-800">
        <div className="w-12 h-12 border-4 border-oxford border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-semibold text-oxford">Verifying Session & Loading Dashboard...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER ADMIN DASHBOARD (IF ROLE IS ADMIN)
  // -------------------------------------------------------------
  if (role === 'admin') {
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
      <Tabs value={adminTab} onValueChange={(val) => setAdminTab(val as any)} className="min-h-screen bg-[#faf7f2] text-slate-900 flex flex-col md:flex-row font-serif selection:bg-oxford selection:text-white">
        {/* Left Sidebar */}
        <aside className="w-full md:w-72 bg-oxford border-r border-[#001833] text-white flex flex-col justify-between shrink-0 min-h-screen p-6 shadow-xl sticky top-0 z-40">
          <div className="space-y-8">
            {/* Portal Branding Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-6">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-accent shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white font-serif leading-tight">Admin Portal</h1>
                  <Badge className="bg-cyan-accent text-oxford font-sans font-bold uppercase tracking-wide text-[9px] px-1.5 py-0.5 rounded">
                    CMS
                  </Badge>
                </div>
                <p className="text-xs text-indigo-200 truncate max-w-[160px]" title={currentUser?.email}>{currentUser?.email || 'System Admin'}</p>
              </div>
            </div>

            {/* Navigation List */}
            <div className="space-y-2">
              <p className="text-[10px] font-sans font-bold text-indigo-300 uppercase tracking-widest px-3 mb-2">Main Navigation</p>
              <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1.5 w-full">
                <TabsTrigger
                  value="dashboard"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="about"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    <span>About Us</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="hero"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Sliders className="w-4 h-4" />
                    <span>Hero Carousel</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent px-2 py-0.5">
                    {heroSlides.length}/10
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value="events"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    <span>Events Management</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent px-2 py-0.5">
                    {eventsList.length}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value="notifications"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent px-2 py-0.5">
                    {notifications.length}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value="faculty"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>Faculty Accounts</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent px-2 py-0.5">
                    {facultyList.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Sidebar Footer / Logout */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <Button
              variant="destructive"
              size="default"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 border-none text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>{loggingOut ? 'Logging out...' : 'Logout Session'}</span>
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-12">
          {/* OVERVIEW TAB */}
          <TabsContent value="dashboard" className="space-y-12 animate-fadeIn mt-0">
            <Card className="bg-transparent border-none rounded-none p-0 shadow-none relative overflow-visible">
              <CardContent className="p-0">
                <CardTitle className="text-3xl font-bold font-serif text-slate-900 leading-none mb-2">Welcome, Administrator ({currentUser?.name || 'Admin'})</CardTitle>
                <CardDescription className="text-slate-600 text-base mt-1">
                  Manage department announcements, faculty member accounts, and research profiles in real time.
                </CardDescription>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Module 1: About Us */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">About Us Page</CardTitle>
                  <CardDescription className="text-base text-slate-600 leading-normal">
                    Manage department history, research text (Markdown), and top hero background banner image.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('about')}
                  className="w-full py-3 px-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Manage About Us</span>
                </Button>
              </Card>

              {/* Module 2: Hero Carousel */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-amber-700">
                      {heroSlides.length}/10
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Hero Carousel</CardTitle>
                  <CardDescription className="text-base text-slate-600 leading-normal">
                    Manage home page background slides with titles, descriptions, visibility toggles, and reordering.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('hero')}
                  className="w-full py-3 px-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Manage Hero</span>
                </Button>
              </Card>

              {/* Module 3: Notifications */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/20 flex items-center justify-center">
                      <Bell className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-cyan-accent">
                      {notifications.length}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Notifications</CardTitle>
                  <CardDescription className="text-base text-slate-600 leading-normal">
                    Post announcements and urgent student alerts to the marquee ticker.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('notifications')}
                  className="w-full py-3 px-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Notifications</span>
                </Button>
              </Card>

              {/* Module 4: Faculty Accounts */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-oxford/10 text-oxford border border-oxford/20 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-oxford">
                      {facultyList.length}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Faculty Accounts</CardTitle>
                  <CardDescription className="text-base text-slate-600 leading-normal">
                    Create faculty logins and monitor account status.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('faculty')}
                  className="w-full py-3 px-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Faculty Accounts</span>
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* ABOUT US TAB */}
          <TabsContent value="about" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <FileText className="w-7 h-7 text-oxford" />
                  <span>About Us Page & Department Hero Banner</span>
                </h2>
                <p className="text-slate-600 text-base mt-1 font-sans">
                  Edit the department overview markdown text and upload the hero background image displayed on the public About page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchCmsAbout}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh Content"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingAbout ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveAboutUs}
                  disabled={savingAbout}
                  className="flex items-center gap-2 py-3 px-6 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{savingAbout ? 'Saving Changes...' : 'Save About Us Page'}</span>
                </Button>
              </div>
            </div>

            {aboutError && (
              <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 font-sans font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{aboutError}</span>
              </div>
            )}

            {aboutSuccess && (
              <div className="p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 font-sans font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{aboutSuccess}</span>
              </div>
            )}

            {/* Department Hero Image Uploader */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-oxford" />
                  <span>Department Banner Image (About Hero Section)</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  This image will be displayed as the main background banner in the hero section of the public About Us page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Upload Image File</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedAboutImageFile(file);
                          setAboutImagePreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                    />
                  </div>

                  <div className="text-xs text-slate-400 text-center font-bold">OR</div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Image URL</label>
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={aboutImageUrlInput}
                      onChange={(e) => {
                        setAboutImageUrlInput(e.target.value);
                        setAboutImagePreviewUrl(e.target.value);
                      }}
                      className="w-full text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block font-sans">Current Hero Banner Preview</label>
                  <div className="w-full h-40 rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden relative shadow-inner">
                    <img
                      src={aboutImagePreviewUrl || '/campus.jpg'}
                      alt="Department Banner Preview"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-oxford/75 mix-blend-multiply flex items-center justify-center">
                      <span className="text-white font-serif font-bold text-2xl tracking-widest uppercase">ABOUT</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Markdown Text Editor & Live Preview */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-oxford" />
                    <span>About Us Content (Markdown Editor)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Use full markdown formatting for paragraphs, headings, bullet lists, bold emphasis, and links.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl font-sans">
                  <button
                    type="button"
                    onClick={() => setAboutActiveTab('write')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      aboutActiveTab === 'write' ? 'bg-white text-oxford shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Write (Markdown)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAboutActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      aboutActiveTab === 'preview' ? 'bg-white text-oxford shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {aboutActiveTab === 'write' ? (
                <div className="space-y-3 font-sans">
                  {/* Markdown Format Insert Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('# ')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('## ')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('**', '**')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold"
                      title="Bold text"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('*', '*')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 italic"
                      title="Italic text"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('- ')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800"
                      title="Bullet list"
                    >
                      Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('[', '](https://example.com)')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800"
                      title="Add link"
                    >
                      Link
                    </button>
                  </div>

                  <textarea
                    id="aboutMarkdownTextarea"
                    rows={16}
                    placeholder="Enter About Us description using Markdown..."
                    value={aboutContent}
                    onChange={(e) => setAboutContent(e.target.value)}
                    className="w-full bg-white border border-[#e8e2d5] rounded-xl p-4 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[360px] text-sm text-slate-800 leading-relaxed font-sans">
                  {renderMarkdown(aboutContent)}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* HERO CAROUSEL TAB */}
          <TabsContent value="hero" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Sliders className="w-7 h-7 text-oxford" />
                  <span>Home Page Hero Carousel</span>
                  <Badge variant="outline" className="ml-2 font-mono text-xs border-oxford text-oxford">
                    {heroSlides.length}/10 Records
                  </Badge>
                </h2>
                <p className="text-slate-600 text-base mt-1">
                  Manage home page hero slides (Max 10 records). Dynamic slides with ON status are displayed on the public site.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchHeroSlides}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh Hero List"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingHero ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  disabled={heroSlides.length >= 10}
                  onClick={() => openHeroModal()}
                  className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>{heroSlides.length >= 10 ? 'Max 10 Limit Reached' : 'Add Hero Item'}</span>
                </Button>
              </div>
            </div>

            {heroSlides.length >= 10 && (
              <div className="p-3.5 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 font-sans font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>Maximum limit of 10 Hero records reached. Delete or edit an existing slide to create space for a new item.</span>
              </div>
            )}

            <div className="bg-transparent border-none overflow-visible shadow-none">
              {loadingHero ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
                  <span>Loading hero slides...</span>
                </div>
              ) : heroSlides.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200">
                  <Sliders className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-base font-semibold text-slate-800">No dynamic hero slides in database</p>
                  <p className="text-xs text-slate-500">
                    The public homepage will display default fallback slides until you create a custom hero slide.
                  </p>
                  <Button onClick={() => openHeroModal()} className="mt-2 text-xs">
                    <Plus className="w-4 h-4 mr-1" /> Add First Hero Slide
                  </Button>
                </div>
              ) : (
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-bold w-16">Order</TableHead>
                      <TableHead className="text-base font-bold">Image Preview</TableHead>
                      <TableHead className="text-base font-bold">Title (Max 80)</TableHead>
                      <TableHead className="text-base font-bold">Description (Max 200)</TableHead>
                      <TableHead className="text-base font-bold">Status (Visibility)</TableHead>
                      <TableHead className="text-base font-bold text-center">Reorder</TableHead>
                      <TableHead className="text-right text-base font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heroSlides.map((slide, idx) => (
                      <TableRow key={slide.id} className="hover:bg-slate-50/40">
                        <TableCell className="font-bold text-slate-700 py-4 font-mono">
                          #{idx + 1}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="w-20 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 max-w-xs text-base py-4">
                          <div className="line-clamp-2">{slide.title}</div>
                          <span className="text-[11px] font-mono text-slate-400 font-normal">({slide.title.length}/80 chars)</span>
                        </TableCell>
                        <TableCell className="text-slate-600 max-w-sm text-sm py-4 font-sans">
                          <div className="line-clamp-2">{slide.description || '—'}</div>
                          <span className="text-[11px] font-mono text-slate-400">({slide.description.length}/200 chars)</span>
                        </TableCell>
                        <TableCell className="text-base py-4">
                          <button
                            type="button"
                            className="flex items-center gap-1.5 font-bold text-base hover:underline focus:outline-none cursor-pointer transition-all"
                            onClick={() => toggleHeroVisibility(slide)}
                          >
                            {slide.is_visible ? (
                              <span className="text-emerald-600 flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>ON</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <EyeOff className="w-4 h-4" />
                                <span>OFF</span>
                              </span>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-center py-4">
                          <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveHeroSlide(idx, 'up')}
                              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === heroSlides.length - 1}
                              onClick={() => moveHeroSlide(idx, 'down')}
                              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap py-4">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openHeroModal(slide)}
                            className="h-9 w-9 text-slate-600 hover:text-slate-900"
                            title="Edit Hero Item"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteHeroSlide(slide.id)}
                            className="h-9 w-9"
                            title="Delete Hero Item"
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

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Bell className="w-7 h-7 text-cyan-accent" />
                  <span>Notifications Management</span>
                </h2>
                <p className="text-slate-600 text-base mt-1">
                  Active notifications are broadcasted to the home page marquee ticker.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchNotifications}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh List"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingNotifs ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  onClick={() => openModal()}
                  className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Notification</span>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 text-base h-12"
              />
            </div>

            <div className="bg-transparent border-none overflow-visible shadow-none">
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
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-bold">Status</TableHead>
                      <TableHead className="text-base font-bold">Title</TableHead>
                      <TableHead className="text-base font-bold">Category</TableHead>
                      <TableHead className="text-base font-bold">Redirect Link</TableHead>
                      <TableHead className="text-base font-bold">Date</TableHead>
                      <TableHead className="text-right text-base font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifs.map((notif) => (
                      <TableRow key={notif.id} className="hover:bg-slate-50/40">
                        <TableCell className="text-base py-4">
                          <button
                            type="button"
                            className="flex items-center gap-1.5 font-bold text-base hover:underline focus:outline-none cursor-pointer transition-all"
                            onClick={() => toggleActiveStatus(notif)}
                          >
                            {notif.isActive ? (
                              <span className="text-emerald-600 flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <EyeOff className="w-4 h-4" />
                                <span>Inactive</span>
                              </span>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 max-w-md text-base py-4">
                          <span className="line-clamp-2">{notif.title}</span>
                        </TableCell>
                        <TableCell className="text-base py-4">
                          <span className="font-semibold text-base text-cyan-700">
                            {notif.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600 text-base py-4">
                          {notif.link ? (
                            <a
                              href={notif.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-base text-cyan-accent hover:underline max-w-[150px] truncate font-medium"
                            >
                              <span>{notif.link}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-base text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-base text-slate-600 whitespace-nowrap font-mono py-4">
                          {new Date(notif.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap py-4">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openModal(notif)}
                            className="h-9 w-9 text-slate-600 hover:text-slate-900"
                            title="Edit Notification"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="h-9 w-9"
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
          <TabsContent value="faculty" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Users className="w-7 h-7 text-oxford" />
                  <span>Faculty Account Management</span>
                </h2>
                <p className="text-slate-600 text-base mt-1">
                  Create faculty login accounts, specify predefined passwords, and manage profiles.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchFaculty}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh Faculty Records"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingFaculty ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  onClick={() => openFacultyModal()}
                  className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Faculty Account</span>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search faculty by name, email, or designation..."
                value={facultySearchTerm}
                onChange={(e) => setFacultySearchTerm(e.target.value)}
                className="pl-11 text-base h-12"
              />
            </div>

            <div className="bg-transparent border-none overflow-visible shadow-none">
              {loadingFaculty ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
                  <span>Loading faculty member records...</span>
                </div>
              ) : filteredFaculty.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3">
                  <Users className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-base font-semibold text-slate-800">No faculty accounts found</p>
                </div>
              ) : (
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-bold">Faculty Name & Title</TableHead>
                      <TableHead className="text-base font-bold">Username / Email</TableHead>
                      <TableHead className="text-base font-bold">Account Status</TableHead>
                      <TableHead className="text-base font-bold">First-Time Login Status</TableHead>
                      <TableHead className="text-base font-bold">Created On</TableHead>
                      <TableHead className="text-right text-base font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaculty.map((faculty) => (
                      <TableRow key={faculty.id} className="hover:bg-slate-50/40">
                        <TableCell className="py-4">
                          <div className="font-bold text-slate-900">{faculty.name}</div>
                          <div className="text-sm text-slate-500 font-sans">{faculty.designation || 'Faculty Member'}</div>
                        </TableCell>

                        <TableCell className="font-mono text-sm text-slate-700 py-4">
                          {faculty.email}
                        </TableCell>

                        <TableCell className="py-4">
                          <button
                            type="button"
                            className="flex items-center gap-1.5 font-bold text-base hover:underline focus:outline-none cursor-pointer transition-all"
                            onClick={() => toggleFacultyStatus(faculty)}
                          >
                            {faculty.isActive ? (
                              <span className="text-emerald-600 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="text-rose-500 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4" />
                                <span>Disabled</span>
                              </span>
                            )}
                          </button>
                        </TableCell>

                        <TableCell className="py-4">
                          {faculty.mustChangePassword ? (
                            <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-800 font-sans font-medium text-xs">
                              Pending Password Reset
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-emerald-400 bg-emerald-50 text-emerald-800 font-sans font-medium text-xs">
                              Password Set & Active
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-base text-slate-600 whitespace-nowrap font-mono py-4">
                          {new Date(faculty.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>

                        <TableCell className="text-right space-x-2 whitespace-nowrap py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFullManageFacultyId(faculty.id)}
                            className="bg-oxford/5 border-oxford/20 text-oxford hover:bg-oxford hover:text-white transition-all text-xs font-semibold px-3 py-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1" />
                            <span>Manage Profile</span>
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openFacultyModal(faculty)}
                            className="h-9 w-9 text-slate-600 hover:text-slate-900"
                            title="Edit Account Credentials"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteFaculty(faculty.id)}
                            className="h-9 w-9"
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

          {/* EVENTS MANAGEMENT TAB */}
          <TabsContent value="events" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Calendar className="w-7 h-7 text-oxford" />
                  <span>Department Events & Seminars</span>
                </h2>
                <p className="text-slate-600 text-base mt-1 font-sans">
                  Publish, edit, and manage department events, workshops, endowment lectures, and conferences.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchEvents}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh Events"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingEvents ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  onClick={() => openEventModal()}
                  className="flex items-center gap-2 py-3 px-6 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Event</span>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              {eventsList.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Calendar className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-base font-semibold text-slate-800">No events found in database</p>
                  <Button variant="outline" onClick={() => openEventModal()} className="mt-2">
                    Create First Event
                  </Button>
                </div>
              ) : (
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-bold">Cover Image</TableHead>
                      <TableHead className="text-base font-bold">Event Title & ID</TableHead>
                      <TableHead className="text-base font-bold">Event Date</TableHead>
                      <TableHead className="text-base font-bold">Apply Link</TableHead>
                      <TableHead className="text-right text-base font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventsList.map((ev) => (
                      <TableRow key={ev.id} className="hover:bg-slate-50/40">
                        <TableCell className="py-3">
                          <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden border border-slate-200">
                            <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                          </div>
                        </TableCell>

                        <TableCell className="py-3 max-w-xs">
                          <div className="font-bold text-slate-900 truncate" title={ev.title}>{ev.title}</div>
                          <div className="text-xs text-slate-500 font-mono">ID: {ev.id}</div>
                        </TableCell>

                        <TableCell className="font-mono text-sm text-slate-700 py-3 whitespace-nowrap">
                          {new Date(ev.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>

                        <TableCell className="py-3">
                          {ev.apply_link ? (
                            <a
                              href={ev.apply_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              <span>Registration URL</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 font-sans italic">None</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right space-x-2 whitespace-nowrap py-3">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openEventModal(ev)}
                            className="h-9 w-9 text-slate-600 hover:text-slate-900"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="h-9 w-9"
                            title="Delete Event"
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

        {/* ADMIN MODALS */}
        {/* Event Create / Edit Modal */}
        <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
          <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                <Calendar className="w-5 h-5 text-oxford" />
                <span>{editingEvent ? 'Edit Event' : 'Add New Event'}</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEventSave} className="space-y-5 pt-4">
              {eventError && (
                <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {eventError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Event Title *</label>
                <Input
                  type="text"
                  placeholder="e.g. 15th Department Endowment Oration Lecture"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="w-full text-base font-serif"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Event Date & Time *</label>
                  <Input
                    type="datetime-local"
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Event Venue (Optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g. Department Auditorium, CUSAT"
                    value={eventFormData.venue}
                    onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                    className="w-full text-sm font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Apply / Registration URL (Optional)</label>
                <Input
                  type="url"
                  placeholder="https://forms.gle/..."
                  value={eventFormData.apply_link}
                  onChange={(e) => setEventFormData({ ...eventFormData, apply_link: e.target.value })}
                  className="w-full text-sm font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Cover Image File OR Image URL *</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEventFormData({ ...eventFormData, imageFile: file, imageUrl: '' });
                        setEventImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-oxford file:text-white hover:file:bg-cyan-accent hover:file:text-oxford transition-all"
                  />

                  <div className="text-center text-xs text-slate-400 font-sans">OR</div>

                  <Input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={eventFormData.imageUrl}
                    onChange={(e) => {
                      setEventFormData({ ...eventFormData, imageUrl: e.target.value, imageFile: null });
                      setEventImagePreview(e.target.value);
                    }}
                    className="w-full text-xs font-mono"
                  />
                </div>

                {eventImagePreview && (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mt-2 group">
                    <img src={eventImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setEventFormData({ ...eventFormData, imageFile: null, imageUrl: '' });
                        setEventImagePreview(null);
                      }}
                      className="absolute top-2.5 right-2.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                      title="Remove Cover Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Image</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Full Description (Text / Markdown) *</label>
                <textarea
                  rows={6}
                  placeholder="Enter event details, schedule, key topics, resource persons..."
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                />
              </div>

              {/* Event Gallery Management Section */}
              <EventGallerySection eventId={editingEvent ? editingEvent.id : null} />

              <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button variant="outline" type="button" onClick={closeEventModal} className="px-4">
                  Cancel
                </Button>
                <Button type="submit" disabled={eventSaving} className="px-5 font-semibold">
                  {eventSaving ? 'Saving Event...' : editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Notification Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif">
            <DialogHeader className="flex items-center justify-between border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 font-serif">
                {editingNotif ? 'Edit Notification' : 'Create New Notification'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveNotification} className="space-y-5 pt-4">
              {formError && (
                <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Notification Title *</label>
                <Input
                  type="text"
                  placeholder="e.g. National Physics Seminar 2026 Registration Open"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Category Tag</label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="w-full text-base">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Admissions">Admissions</SelectItem>
                    <SelectItem value="Research">Research & Conferences</SelectItem>
                    <SelectItem value="Exams">Exams & Timetables</SelectItem>
                    <SelectItem value="Events">Events & Workshops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Destination Link (Optional)</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full text-base font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Display Status</span>
                  <span className="text-xs text-slate-500">Show immediately in header ticker</span>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button variant="outline" type="button" onClick={closeModal} className="px-4">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="px-5 font-semibold">
                  {saving ? 'Saving...' : editingNotif ? 'Update Notification' : 'Create Notification'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Faculty Modal */}
        <Dialog open={isFacultyModalOpen} onOpenChange={setIsFacultyModalOpen}>
          <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 font-serif">
                {editingFaculty ? 'Edit Faculty Credentials' : 'Register New Faculty Account'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleFacultySave} className="space-y-4 pt-4">
              {facultyFormError && (
                <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {facultyFormError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Faculty Full Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={facultyFormData.name}
                  onChange={(e) => setFacultyFormData({ ...facultyFormData, name: e.target.value })}
                  className="w-full text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Email Address (Username) *</label>
                <Input
                  type="email"
                  placeholder="e.g. ramesh@cusat.ac.in"
                  value={facultyFormData.email}
                  onChange={(e) => setFacultyFormData({ ...facultyFormData, email: e.target.value })}
                  className="w-full text-base font-mono"
                />
              </div>

              {!editingFaculty ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Predefined Initial Password *</label>
                  <Input
                    type="text"
                    placeholder="e.g. facultyPass123"
                    value={facultyFormData.password}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, password: e.target.value })}
                    className="w-full text-base font-mono"
                  />
                  <p className="text-xs text-slate-500">
                    Faculty will be forced to change this password on their first login.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Reset Predefined Password (Optional)</label>
                  <Input
                    type="text"
                    placeholder="Leave empty to keep existing password"
                    value={facultyFormData.newPredefinedPassword}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, newPredefinedPassword: e.target.value })}
                    className="w-full text-base font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Designation</label>
                  <Input
                    type="text"
                    value={facultyFormData.designation}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, designation: e.target.value })}
                    className="w-full text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Department</label>
                  <Input
                    type="text"
                    value={facultyFormData.department}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, department: e.target.value })}
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Account Active</span>
                  <span className="text-xs text-slate-500">Enable or disable login access</span>
                </div>
                <Switch
                  checked={facultyFormData.isActive}
                  onCheckedChange={(checked) => setFacultyFormData({ ...facultyFormData, isActive: checked })}
                />
              </div>

              <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button variant="outline" type="button" onClick={closeFacultyModal} className="px-4">
                  Cancel
                </Button>
                <Button type="submit" disabled={facultySaving} className="px-5 font-semibold">
                  {facultySaving ? 'Saving...' : editingFaculty ? 'Update Account' : 'Register Account'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Hero Item Create/Edit Modal */}
        <Dialog open={isHeroModalOpen} onOpenChange={setIsHeroModalOpen}>
          <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                <Sliders className="w-5 h-5 text-oxford" />
                <span>{editingHeroSlide ? 'Edit Hero Slide' : 'Add New Hero Slide (Max 10)'}</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleHeroSave} className="space-y-5 pt-4">
              {heroFormError && (
                <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {heroFormError}
                </div>
              )}

              {/* Title Input with live char counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Slide Title *</label>
                  <span className={`text-xs font-mono font-semibold ${heroFormData.title.length > 80 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                    {heroFormData.title.length}/80 chars
                  </span>
                </div>
                <Input
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Quantum Frontiers & Nanomaterials Research"
                  value={heroFormData.title}
                  onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                  className="w-full text-base font-serif"
                />
              </div>

              {/* Description Input with live char counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Slide Subtitle / Description</label>
                  <span className={`text-xs font-mono font-semibold ${heroFormData.description.length > 200 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                    {heroFormData.description.length}/200 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  placeholder="Pioneering research in magnetic nanocomposites, quantum transport..."
                  value={heroFormData.description}
                  onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                  className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford"
                />
              </div>

              {/* Image Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Upload Image File OR Image URL *</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setHeroFormData({ ...heroFormData, imageFile: file });
                        setHeroImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                  />
                  <div className="text-xs text-slate-400 text-center font-bold font-sans">OR</div>
                  <Input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={heroFormData.imageUrl}
                    onChange={(e) => {
                      setHeroFormData({ ...heroFormData, imageUrl: e.target.value });
                      setHeroImagePreview(e.target.value);
                    }}
                    className="w-full text-xs font-mono"
                  />
                </div>

                {heroImagePreview && (
                  <div className="mt-2 w-full h-24 rounded-xl border border-slate-200 overflow-hidden relative">
                    <img src={heroImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Visibility Status Switch */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-900 block font-serif">Public Visibility</span>
                  <span className="text-xs text-slate-500 font-sans">Show on public homepage slideshow</span>
                </div>
                <Switch
                  checked={heroFormData.is_visible}
                  onCheckedChange={(checked) => setHeroFormData({ ...heroFormData, is_visible: checked })}
                />
              </div>

              <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button variant="outline" type="button" onClick={closeHeroModal} className="px-4">
                  Cancel
                </Button>
                <Button type="submit" disabled={heroSaving} className="px-5 font-semibold">
                  {heroSaving ? 'Saving...' : editingHeroSlide ? 'Update Hero Slide' : 'Create Hero Slide'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Full Faculty Profile Management Modal */}
        {fullManageFacultyId && (
          <AdminFacultyFullManageModal
            facultyId={fullManageFacultyId}
            isOpen={!!fullManageFacultyId}
            onClose={() => setFullManageFacultyId(null)}
            onFacultyUpdated={fetchFaculty}
          />
        )}
      </Tabs>
    );
  }

  // -------------------------------------------------------------
  // RENDER FACULTY DASHBOARD (IF ROLE IS FACULTY)
  // -------------------------------------------------------------
  return (
    <Tabs value={facultyTab} onValueChange={(val) => setFacultyTab(val as any)} className="min-h-screen bg-[#faf7f2] text-slate-900 flex flex-col md:flex-row font-sans selection:bg-oxford selection:text-white">
      {/* Left Sidebar */}
      <aside className="w-full md:w-72 bg-oxford border-r border-[#001833] text-white flex flex-col justify-between shrink-0 min-h-screen p-6 pb-12 shadow-xl sticky top-0 z-40 font-sans">
        <div className="space-y-8">
          {/* Portal Branding Header */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-accent shrink-0 shadow-inner">
              <Atom className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white font-serif leading-tight">Faculty Portal</h1>
                <Badge className="bg-cyan-accent text-oxford font-sans font-bold uppercase tracking-wide text-[9px] px-1.5 py-0.5 rounded">
                  Faculty
                </Badge>
              </div>
              <p className="text-xs text-indigo-200 truncate max-w-[160px]" title={currentUser?.name}>{currentUser?.name || 'Faculty Member'}</p>
            </div>
          </div>

          {/* Navigation List (4 Options) */}
          <div className="space-y-2">
            <p className="text-[10px] font-sans font-bold text-indigo-300 uppercase tracking-widest px-3 mb-2">Faculty Menu</p>
            <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1.5 w-full">
              {/* Option 1: Overview */}
              <TabsTrigger
                value="overview"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </div>
              </TabsTrigger>

              {/* Option 2: Profile (contact, cv, photo, bio) */}
              <TabsTrigger
                value="profile"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Profile & Details</span>
                </div>
              </TabsTrigger>

              {/* Option 3: Research Scholars Page */}
              <TabsTrigger
                value="scholars"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4" />
                  <span>Research Scholars</span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent px-2 py-0.5">
                  {studentsList.length}
                </Badge>
              </TabsTrigger>

              {/* Option: Research Projects Page */}
              <TabsTrigger
                value="projects"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <FlaskConical className="w-4 h-4" />
                  <span>Research Projects</span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent px-2 py-0.5">
                  {projectsList.length}
                </Badge>
              </TabsTrigger>

              {/* Option 4: Hero Section Page */}
              <TabsTrigger
                value="hero"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4" />
                  <span>Hero Section</span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent px-2 py-0.5">
                  {heroSlides.length}/10
                </Badge>
              </TabsTrigger>

              {/* Option 5: Events Management Page */}
              <TabsTrigger
                value="events"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>Events Management</span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent px-2 py-0.5">
                  {eventsList.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Sidebar Footer / Account Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2.5">
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center gap-2 text-xs font-semibold rounded-xl py-2.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-accent" />
            <span>Change Password</span>
          </Button>

          <Button
            variant="destructive"
            size="default"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 border-none text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Logging out...' : 'Logout Session'}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-12">
        {/* OPTION 1: OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8 animate-fadeIn mt-0">
          <Card className="bg-transparent border-none rounded-none p-0 shadow-none relative overflow-visible flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
            <CardContent className="p-0 space-y-1">
              <CardTitle className="text-3xl font-bold font-serif text-slate-900 leading-none">
                Welcome back, {currentUser?.name}
              </CardTitle>
              <CardDescription className="text-slate-600 text-base mt-1">
                {currentUser?.designation || 'Faculty Member'} • {currentUser?.department || 'Department of Physics'}
              </CardDescription>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Profile Overview Card */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Profile & Details</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Update contact numbers, social/academic links, upload profile photo & CV, and format your research bio.
                </CardDescription>
              </div>
              <Button onClick={() => setFacultyTab('profile')} className="w-full font-semibold">
                <span>Manage Profile</span>
              </Button>
            </Card>

            {/* Research Scholars Card */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-oxford/10 text-oxford border border-oxford/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-oxford">{studentsList.length}</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Research Scholars</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Add, edit, or remove Ph.D., M.Phil, and Master research scholars under your guidance.
                </CardDescription>
              </div>
              <Button onClick={() => setFacultyTab('scholars')} className="w-full font-semibold">
                <span>Manage Scholars</span>
              </Button>
            </Card>

            {/* Research Projects Card */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-emerald-700">{projectsList.length}</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Research Projects</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Manage sponsored and funded research projects, collaborator faculty, funding agency, dates, and links.
                </CardDescription>
              </div>
              <Button onClick={() => setFacultyTab('projects')} className="w-full font-semibold">
                <span>Manage Projects</span>
              </Button>
            </Card>

            {/* Events Management Card */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-purple-700">{eventsList.length}</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Events Management</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Publish, edit, or remove department seminars, workshops, and endowment lectures.
                </CardDescription>
              </div>
              <Button onClick={() => setFacultyTab('events')} className="w-full font-semibold">
                <span>Manage Events</span>
              </Button>
            </Card>

            {/* Hero Section Card */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-amber-700">{heroSlides.length}/10</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Hero Section</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Upload home page hero slides, reorder slides, and toggle visibility on the public site.
                </CardDescription>
              </div>
              <Button onClick={() => setFacultyTab('hero')} className="w-full font-semibold">
                <span>Manage Hero Carousel</span>
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* OPTION 2: PROFILE TAB (Contact, Photo, CV, Bio) */}
        <TabsContent value="profile" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <User className="w-7 h-7 text-oxford" />
                <span>Profile & Details Management</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Manage contact info, academic profiles, profile photo, CV document, and Markdown biography.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsProfilesModalOpen(true)} className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Contact & Links</span>
              </Button>
              <Button variant="outline" onClick={() => setIsDocModalOpen(true)} className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Photo & CV</span>
              </Button>
              <Button variant="default" onClick={() => setIsDescModalOpen(true)} className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                <span>Edit Bio</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-8">
              {/* Photo & CV Documents */}
              <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-cyan-700" />
                  <span>Documents & Media</span>
                </h3>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-500">
                    {imagePath ? (
                      <img src={imagePath} alt={currentUser?.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Profile Photo</p>
                    <p className="text-xs text-slate-500 font-sans">
                      {imagePath ? 'Uploaded & Active' : 'No photo uploaded'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-oxford" />
                    <span className="text-sm text-slate-800 font-medium font-sans">Curriculum Vitae (PDF)</span>
                  </div>
                  {cvPath ? (
                    <a
                      href={cvPath}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-accent hover:underline flex items-center gap-1 font-semibold font-sans"
                    >
                      <span>View CV</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic font-sans">Not uploaded</span>
                  )}
                </div>

                <Button onClick={() => setIsDocModalOpen(true)} variant="outline" className="w-full text-xs font-semibold">
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  <span>Upload / Replace Photo & CV</span>
                </Button>
              </Card>

              {/* Public Profiles Card */}
              <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-oxford" />
                    <span>Public Profiles ({selectedPlatforms.size})</span>
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setIsProfilesModalOpen(true)} className="h-8 text-xs font-semibold">
                    Edit
                  </Button>
                </div>

                {selectedPlatforms.size === 0 && otherProfiles.length === 0 ? (
                  <p className="text-xs text-slate-500 italic font-sans">No academic links configured yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1 font-sans">
                    {Array.from(selectedPlatforms).map((key) => {
                      const platform = PREDEFINED_PLATFORMS.find((p) => p.key === key);
                      if (!platform || !platformUrls[key]) return null;
                      return (
                        <a
                          key={key}
                          href={platformUrls[key]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-oxford flex items-center gap-1.5 shadow-xs hover:border-oxford transition-all"
                        >
                          <span>{platform.label}</span>
                          <ExternalLink className="w-3 h-3 text-cyan-700" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>

            {/* Markdown Description */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-accent" />
                    <span>Professional Overview & Research Biography</span>
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setIsDescModalOpen(true)} className="h-8 text-xs font-semibold">
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit Bio</span>
                  </Button>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-sans min-h-[300px]">
                  {renderMarkdown(markdownContent)}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* OPTION 3: RESEARCH SCHOLARS TAB */}
        <TabsContent value="scholars" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-oxford" />
                <span>Guided Scholars & Research Students ({studentsList.length})</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Manage research scholars, Ph.D. candidates, and project students under your supervision.
              </p>
            </div>
            <Button onClick={() => openStudentModal()} className="flex items-center gap-2 py-3 px-5 font-semibold">
              <Plus className="w-4 h-4" />
              <span>Add Research Scholar</span>
            </Button>
          </div>

          <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {studentsList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <GraduationCap className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No guided scholars listed yet.</p>
                <p className="text-xs text-slate-500 font-sans">Click "Add Research Scholar" to register student research profiles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {studentsList.map((st) => (
                  <div key={st.uid} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3 relative group shadow-xs hover:bg-white hover:border-slate-300 transition-all">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                      {st.image ? (
                        <img src={st.image} alt={st.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-2 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1 pr-6 font-serif">
                      <p className="text-base font-bold text-slate-900">{st.name}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 font-sans">{st.description || 'Research Scholar'}</p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                      <button onClick={() => openStudentModal(st)} className="p-1 text-slate-500 hover:text-slate-900" title="Edit Scholar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteStudent(st.uid)} className="p-1 text-rose-600 hover:text-rose-700" title="Delete Scholar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* OPTION 4: HERO SECTION TAB */}
        <TabsContent value="hero" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <Sliders className="w-7 h-7 text-amber-700" />
                <span>Home Page Hero Carousel Section</span>
                <Badge variant="outline" className="ml-2 font-mono text-xs border-amber-700 text-amber-800 bg-amber-50">
                  {heroSlides.length}/10 Records
                </Badge>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Add, edit, reorder, and toggle visibility of home page hero slides.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={fetchHeroSlides} className="h-10 w-10">
                <RefreshCw className={`w-4 h-4 ${loadingHero ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={() => openHeroModal()} disabled={heroSlides.length >= 10} className="flex items-center gap-2 font-semibold">
                <Plus className="w-4 h-4" />
                <span>Add Hero Item ({heroSlides.length}/10)</span>
              </Button>
            </div>
          </div>

          <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {heroSlides.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <Sliders className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No hero items available.</p>
              </div>
            ) : (
              <Table className="text-sm font-sans">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold w-12 text-xs">Order</TableHead>
                    <TableHead className="font-bold text-xs">Preview</TableHead>
                    <TableHead className="font-bold text-xs">Title (Max 80)</TableHead>
                    <TableHead className="font-bold text-xs">Description (Max 200)</TableHead>
                    <TableHead className="font-bold text-xs">Status</TableHead>
                    <TableHead className="font-bold text-xs text-center">Reorder</TableHead>
                    <TableHead className="text-right font-bold text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {heroSlides.map((slide, idx) => (
                    <TableRow key={slide.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-slate-700 font-mono text-xs py-3">#{idx + 1}</TableCell>
                      <TableCell className="py-3">
                        <div className="w-16 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 max-w-[200px] text-xs py-3">
                        <div className="line-clamp-2">{slide.title}</div>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">({slide.title.length}/80)</span>
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-[240px] text-xs py-3">
                        <div className="line-clamp-2">{slide.description || '—'}</div>
                        <span className="text-[10px] font-mono text-slate-400">({slide.description.length}/200)</span>
                      </TableCell>
                      <TableCell className="text-xs py-3">
                        <button type="button" className="flex items-center gap-1 font-bold text-xs hover:underline cursor-pointer" onClick={() => toggleHeroVisibility(slide)}>
                          {slide.is_visible ? (
                            <span className="text-emerald-600 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /><span>ON</span></span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1"><EyeOff className="w-3.5 h-3.5" /><span>OFF</span></span>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <div className="inline-flex items-center gap-0.5 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                          <button type="button" disabled={idx === 0} onClick={() => moveHeroSlide(idx, 'up')} className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                          <button type="button" disabled={idx === heroSlides.length - 1} onClick={() => moveHeroSlide(idx, 'down')} className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openHeroModal(slide)} className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteHeroSlide(slide.id)} className="h-8 w-8 text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        {/* OPTION 5: EVENTS MANAGEMENT TAB */}
        <TabsContent value="events" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <Calendar className="w-7 h-7 text-oxford" />
                <span>Events Management Portal</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Add, edit, or remove department seminars, workshops, endowment lectures, and conferences.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchEvents}
                className="h-10 w-10 text-slate-700 hover:text-slate-950"
                title="Refresh Events"
              >
                <RefreshCw className={`w-4 h-4 ${loadingEvents ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="default"
                onClick={() => openEventModal()}
                className="flex items-center gap-2 py-2.5 px-5 font-semibold rounded-xl transition-all text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Event</span>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            {eventsList.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Calendar className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No events found in database</p>
                <Button variant="outline" onClick={() => openEventModal()} className="mt-2">
                  Create First Event
                </Button>
              </div>
            ) : (
              <Table className="text-base">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-bold">Cover Image</TableHead>
                    <TableHead className="text-base font-bold">Event Title & ID</TableHead>
                    <TableHead className="text-base font-bold">Event Date</TableHead>
                    <TableHead className="text-base font-bold">Apply Link</TableHead>
                    <TableHead className="text-right text-base font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventsList.map((ev) => (
                    <TableRow key={ev.id} className="hover:bg-slate-50/40">
                      <TableCell className="py-3">
                        <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden border border-slate-200">
                          <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>

                      <TableCell className="py-3 max-w-xs">
                        <div className="font-bold text-slate-900 truncate" title={ev.title}>{ev.title}</div>
                        <div className="text-xs text-slate-500 font-mono">ID: {ev.id}</div>
                      </TableCell>

                      <TableCell className="font-mono text-sm text-slate-700 py-3 whitespace-nowrap">
                        {new Date(ev.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>

                      <TableCell className="py-3">
                        {ev.apply_link ? (
                          <a
                            href={ev.apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <span>Registration URL</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-sans italic">None</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right space-x-2 whitespace-nowrap py-3">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => openEventModal(ev)}
                          className="h-9 w-9 text-slate-600 hover:text-slate-900"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="h-9 w-9"
                          title="Delete Event"
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

      {/* FACULTY MODALS (LIGHT WARM THEME) */}
      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Lock className="w-5 h-5 text-oxford" />
              <span>Change Account Password</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 pt-4">
            {passwordError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">New Password *</label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Confirm New Password *</label>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-base"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              {!currentUser?.mustChangePassword && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4"
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={changingPassword} className="px-5 font-semibold">
                {changingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profiles Modal */}
      <Dialog open={isProfilesModalOpen} onOpenChange={setIsProfilesModalOpen}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Globe className="w-5 h-5 text-oxford" />
              <span>Contact Info & Academic Profiles</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProfiles} className="space-y-5 pt-4">
            {profilesError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {profilesError}
              </div>
            )}
            {profilesSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                {profilesSuccess}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Office Phone / Contact Number</label>
              <Input
                type="text"
                placeholder="+91 484 2575500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-base font-mono"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 block">Select Academic Platforms</label>
              <div className="grid grid-cols-2 gap-2">
                {PREDEFINED_PLATFORMS.map((p) => {
                  const isSel = selectedPlatforms.has(p.key);
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => togglePlatform(p.key)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all font-sans font-medium ${
                        isSel
                          ? 'bg-oxford/10 border-oxford text-oxford font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {Array.from(selectedPlatforms).map((key) => {
                const platform = PREDEFINED_PLATFORMS.find((p) => p.key === key);
                if (!platform) return null;
                return (
                  <div key={key} className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-slate-700">{platform.label} URL</label>
                    <Input
                      type="url"
                      placeholder={platform.placeholder}
                      value={platformUrls[key] || ''}
                      onChange={(e) => handleUrlChange(key, e.target.value)}
                      className="w-full text-sm font-mono"
                    />
                  </div>
                );
              })}
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsProfilesModalOpen(false)} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={savingProfiles} className="px-5 font-semibold">
                {savingProfiles ? 'Saving...' : 'Save Profiles'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Upload Modal */}
      <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Upload className="w-5 h-5 text-oxford" />
              <span>Upload Photo & Curriculum Vitae</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveDocuments} className="space-y-4 pt-4">
            {docError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {docError}
              </div>
            )}
            {docSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                {docSuccess}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Profile Photo (JPG, PNG, WebP &lt; 5MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageFileSelect}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">CV Document (PDF &lt; 10MB)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleCvFileSelect}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsDocModalOpen(false)} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={uploadingDocs} className="px-5 font-semibold">
                {uploadingDocs ? 'Uploading...' : 'Save Documents'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Description Markdown Modal */}
      <Dialog open={isDescModalOpen} onOpenChange={setIsDescModalOpen}>
        <DialogContent className="max-w-3xl bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-oxford" />
              <span>Edit Professional Overview (Markdown)</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveDescription} className="space-y-4 pt-3">
            {descError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {descError}
              </div>
            )}
            {descSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                {descSuccess}
              </div>
            )}

            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 font-sans">
              <button
                type="button"
                onClick={() => setDescActiveTab('write')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                  descActiveTab === 'write' ? 'bg-oxford text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setDescActiveTab('preview')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                  descActiveTab === 'preview' ? 'bg-oxford text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Preview
              </button>
            </div>

            {descActiveTab === 'write' ? (
              <div className="space-y-2">
                <textarea
                  id="markdown-editor-textarea"
                  rows={12}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder="Write your research summary, qualifications, awards using Markdown..."
                  className="w-full bg-white border border-[#e8e2d5] rounded-xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-oxford"
                />
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[250px] text-xs font-sans text-slate-900">
                {renderMarkdown(markdownContent)}
              </div>
            )}

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsDescModalOpen(false)} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={savingDesc} className="px-5 font-semibold">
                {savingDesc ? 'Saving...' : 'Save Description'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Student Modal */}
      <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-oxford" />
              <span>{editingStudent ? 'Edit Scholar Profile' : 'Add Guided Research Scholar'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveStudent} className="space-y-4 pt-4">
            {studentError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {studentError}
              </div>
            )}
            {studentSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                {studentSuccess}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Student Name *</label>
              <Input
                type="text"
                placeholder="e.g. Ananya Nair"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Research Topic / Degree</label>
              <textarea
                rows={3}
                placeholder="e.g. Ph.D. Scholar working on Quantum Photonics"
                value={studentDescription}
                onChange={(e) => setStudentDescription(e.target.value)}
                className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Scholar Photo (Optional)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleStudentImageSelect}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={closeStudentModal} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={savingStudent} className="px-5 font-semibold">
                {savingStudent ? 'Saving...' : editingStudent ? 'Update Scholar' : 'Add Scholar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Create / Edit Modal for Faculty */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Calendar className="w-5 h-5 text-oxford" />
              <span>{editingEvent ? 'Edit Event' : 'Add New Event'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEventSave} className="space-y-5 pt-4">
            {eventError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {eventError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Event Title *</label>
              <Input
                type="text"
                placeholder="e.g. 15th Department Endowment Oration Lecture"
                value={eventFormData.title}
                onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                className="w-full text-base font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Event Date & Time *</label>
                <Input
                  type="datetime-local"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                  className="w-full text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Event Venue (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g. Department Auditorium, CUSAT"
                  value={eventFormData.venue}
                  onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                  className="w-full text-sm font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Apply / Registration URL (Optional)</label>
              <Input
                type="url"
                placeholder="https://forms.gle/..."
                value={eventFormData.apply_link}
                onChange={(e) => setEventFormData({ ...eventFormData, apply_link: e.target.value })}
                className="w-full text-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Cover Image File OR Image URL *</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEventFormData({ ...eventFormData, imageFile: file, imageUrl: '' });
                      setEventImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-oxford file:text-white hover:file:bg-cyan-accent hover:file:text-oxford transition-all"
                />

                <div className="text-center text-xs text-slate-400 font-sans">OR</div>

                <Input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={eventFormData.imageUrl}
                  onChange={(e) => {
                    setEventFormData({ ...eventFormData, imageUrl: e.target.value, imageFile: null });
                    setEventImagePreview(e.target.value);
                  }}
                  className="w-full text-xs font-mono"
                />
              </div>

              {eventImagePreview && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mt-2 group">
                  <img src={eventImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setEventFormData({ ...eventFormData, imageFile: null, imageUrl: '' });
                      setEventImagePreview(null);
                    }}
                    className="absolute top-2.5 right-2.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                    title="Remove Cover Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Full Description (Text / Markdown) *</label>
              <textarea
                rows={6}
                placeholder="Enter event details, schedule, key topics, resource persons..."
                value={eventFormData.description}
                onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
              />
            </div>

            {/* Event Gallery Management Section */}
            <EventGallerySection eventId={editingEvent ? editingEvent.id : null} />

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={closeEventModal} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={eventSaving} className="px-5 font-semibold">
                {eventSaving ? 'Saving Event...' : editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RESEARCH PROJECTS TAB CONTENT */}
      <TabsContent value="projects" className="space-y-8 animate-fadeIn mt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-7 h-7 text-oxford" />
              <span>Sponsored & Funded Research Projects ({projectsList.length})</span>
            </h2>
            <p className="text-slate-600 text-sm mt-1 font-sans">
              Add, edit, or remove research projects, co-faculty collaborators, funding agencies, grants, and dates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchProjects}
              className="h-10 w-10 text-slate-700 hover:text-slate-950"
              title="Refresh Projects"
            >
              <RefreshCw className={`w-4 h-4 ${loadingProjects ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={() => openProjectModal()}
              className="flex items-center gap-2 py-3 px-5 font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </Button>
          </div>
        </div>

        <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {loadingProjects ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
              <span>Loading research projects...</span>
            </div>
          ) : projectsList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <FlaskConical className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-base font-semibold text-slate-800">No research projects added yet.</p>
              <p className="text-xs text-slate-500 font-sans">Click "Create Project" to record sponsored or funded research projects.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projectsList.map((proj) => {
                const isOngoing = !proj.endDate || (proj.status ? proj.status === 'Ongoing' : new Date(proj.endDate) >= new Date());
                const isOwner = proj.facultyId === currentUser?.id;

                return (
                  <div
                    key={proj.id}
                    className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 font-sans"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            isOngoing
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {isOngoing ? 'Ongoing' : 'Completed'}
                          </span>

                          {!isOwner && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                              Co-Faculty Project
                            </span>
                          )}
                        </div>

                        {proj.agency && (
                          <span className="text-xs font-bold text-slate-700 bg-slate-200/70 border border-slate-300/80 px-2.5 py-1 rounded">
                            {proj.agency}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-serif text-oxford leading-snug">
                        {proj.title}
                      </h3>

                      {proj.description && (
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {proj.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-sans pt-3 border-t border-slate-200/80">
                        <div>
                          <span className="font-semibold text-oxford">Role:</span>{' '}
                          <span>{isOwner ? (proj.role || 'Principal Investigator') : `Co-Investigator (PI: ${proj.faculty?.name || 'Faculty Member'})`}</span>
                        </div>

                        {proj.funding && (
                          <div>
                            <span className="font-semibold text-oxford">Funding:</span>{' '}
                            <span>{proj.funding}</span>
                          </div>
                        )}

                        {proj.startDate && (
                          <div>
                            <span className="font-semibold text-oxford">Start Date:</span>{' '}
                            <span>{new Date(proj.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        )}

                        <div>
                          <span className="font-semibold text-oxford">End Date:</span>{' '}
                          <span>{proj.endDate ? new Date(proj.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'None (Ongoing)'}</span>
                        </div>
                      </div>

                      {proj.otherFaculty && (
                        <div className="text-xs text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-sans">
                          <span className="font-semibold text-oxford">Co-Faculty / Team:</span> {proj.otherFaculty}
                        </div>
                      )}

                      <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                        {proj.externalLink ? (
                          <a
                            href={proj.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                          >
                            <span>External Project Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : <div />}

                        {isOwner ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openProjectModal(proj)}
                              className="h-8 text-xs px-3"
                            >
                              <Edit className="w-3.5 h-3.5 mr-1" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProject(proj.id)}
                              className="h-8 text-xs px-3"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              <span>Delete</span>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-sans italic">
                            Managed by PI ({proj.faculty?.name || 'Faculty Member'})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </TabsContent>

      {/* Project Create / Edit Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-oxford" />
              <span>{editingProject ? 'Edit Research Project' : 'Create New Research Project'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleProjectSave} className="space-y-4 pt-4 font-sans">
            {projectError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {projectError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Project Title *</label>
              <Input
                type="text"
                placeholder="e.g. Development of Advanced Functional Materials"
                value={projectFormData.title}
                onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                className="w-full text-base font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Faculty Role</label>
                <Input
                  type="text"
                  placeholder="e.g. Principal Investigator / Co-PI"
                  value={projectFormData.role}
                  onChange={(e) => setProjectFormData({ ...projectFormData, role: e.target.value })}
                  className="w-full text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Funding Agency</label>
                <Input
                  type="text"
                  placeholder="e.g. DST-SERB, CSIR, UGC-DAE CSR"
                  value={projectFormData.agency}
                  onChange={(e) => setProjectFormData({ ...projectFormData, agency: e.target.value })}
                  className="w-full text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Grant / Funding</label>
                <Input
                  type="text"
                  placeholder="e.g. ₹48.50 Lakhs"
                  value={projectFormData.funding}
                  onChange={(e) => setProjectFormData({ ...projectFormData, funding: e.target.value })}
                  className="w-full text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Start Date</label>
                <Input
                  type="date"
                  value={projectFormData.startDate}
                  onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value })}
                  className="w-full text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">End Date</label>
                <Input
                  type="date"
                  value={projectFormData.endDate}
                  onChange={(e) => setProjectFormData({ ...projectFormData, endDate: e.target.value })}
                  className="w-full text-sm font-mono"
                />
                <p className="text-[11px] text-slate-500 italic">If empty, Status = Ongoing</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Co-Faculty Members / Collaborators</label>
              
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 font-sans font-semibold">Select Faculty from Department DB:</span>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {(() => {
                    const availableCoFaculty = allDbFaculty.filter(
                      (fac) => fac.id !== currentUser?.id && fac.name?.toLowerCase() !== currentUser?.name?.toLowerCase()
                    );
                    if (availableCoFaculty.length === 0) {
                      return <span className="text-xs text-slate-400 italic font-sans">No other department faculty records found</span>;
                    }
                    return availableCoFaculty.map((fac) => {
                      const isSelected = selectedCoFacultyNames.includes(fac.name);
                      return (
                        <button
                          key={fac.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCoFacultyNames(selectedCoFacultyNames.filter((n) => n !== fac.name));
                            } else {
                              setSelectedCoFacultyNames([...selectedCoFacultyNames, fac.name]);
                            }
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-oxford text-white border-oxford font-bold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <span>{fac.name}</span>
                          {isSelected ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-accent" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {selectedCoFacultyNames.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-semibold text-oxford">Selected:</span>
                  {selectedCoFacultyNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded-full"
                    >
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCoFacultyNames(selectedCoFacultyNames.filter((n) => n !== name))}
                        className="hover:text-rose-600 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">External Project Link (Optional)</label>
              <Input
                type="url"
                placeholder="https://..."
                value={projectFormData.externalLink}
                onChange={(e) => setProjectFormData({ ...projectFormData, externalLink: e.target.value })}
                className="w-full text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Description / Abstract</label>
              <textarea
                rows={4}
                placeholder="Enter project summary, objectives, or key achievements..."
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={closeProjectModal} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={savingProject} className="px-5 font-semibold">
                {savingProject ? 'Saving Project...' : editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}