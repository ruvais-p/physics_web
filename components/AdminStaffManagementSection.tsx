'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  UserPlus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Briefcase,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface StaffItem {
  id: string;
  name: string;
  designation: string;
  email: string | null;
  phone: string | null;
  room: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminStaffManagementSection() {
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  // Status / Feedback
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/staff');
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (err) {
      console.error('Failed to load office staff records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openCreateModal = () => {
    setEditingStaff(null);
    setName('');
    setDesignation('');
    setEmail('');
    setPhone('');
    setRoom('');
    setIsActive(true);
    setSortOrder(staffList.length + 1);
    setImageFile(null);
    setImagePreview(null);
    setRemoveCurrentImage(false);
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: StaffItem) => {
    setEditingStaff(staff);
    setName(staff.name);
    setDesignation(staff.designation);
    setEmail(staff.email || '');
    setPhone(staff.phone || '');
    setRoom(staff.room || '');
    setIsActive(staff.isActive);
    setSortOrder(staff.sortOrder);
    setImageFile(null);
    setImagePreview(staff.image || null);
    setRemoveCurrentImage(false);
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setRemoveCurrentImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveCurrentImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Staff member name is required.');
      return;
    }
    if (!designation.trim()) {
      setFormError('Staff designation is required.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);
      setFormSuccess(null);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('designation', designation.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('room', room.trim());
      formData.append('isActive', String(isActive));
      formData.append('sortOrder', String(sortOrder));

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (removeCurrentImage) {
        formData.append('removeImage', 'true');
      }

      const url = editingStaff ? `/api/admin/staff/${editingStaff.id}` : '/api/admin/staff';
      const method = editingStaff ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save staff record.');
      }

      setFormSuccess(editingStaff ? 'Staff profile updated!' : 'Staff member created successfully!');
      await fetchStaff();

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member? This cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteId(id);
      const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchStaff();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete staff member.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredStaff = staffList.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.designation.toLowerCase().includes(q) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.room && item.room.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-10 font-sans animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-oxford" />
            <span>Office &amp; Administrative Staff</span>
          </h2>
          <p className="text-slate-600 text-base mt-1">
            Manage administrative personnel, office superintendents, section officers, and technical assistants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchStaff}
            className="h-11 w-11 text-slate-700 hover:text-slate-950"
            title="Refresh Staff Records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="default"
            onClick={openCreateModal}
            className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl bg-oxford hover:bg-oxford-dark text-white shadow-xs transition-all text-base cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by staff name, designation, email, or room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 text-base h-12 w-full"
        />
      </div>

      {/* Staff Grid Cards */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
          <span>Loading office staff records...</span>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="p-16 text-center text-slate-500 space-y-4 border border-dashed border-slate-200 rounded-2xl bg-white/50">
          <Briefcase className="w-12 h-12 mx-auto text-slate-400" />
          <div>
            <p className="text-base font-semibold text-slate-800">No office staff found</p>
            <p className="text-sm text-slate-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Click "Add Staff Member" to add your first staff record.'}
            </p>
          </div>
          {!searchTerm && (
            <Button onClick={openCreateModal} className="mt-2 bg-oxford hover:bg-oxford-dark text-white">
              <UserPlus className="w-4 h-4 mr-2" /> Add Staff Member
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <Card
              key={staff.id}
              className={`p-6 border transition-all duration-300 relative rounded-2xl flex flex-col justify-between ${
                staff.isActive ? 'bg-white border-slate-200 shadow-xs hover:shadow-md' : 'bg-slate-50 border-slate-200/80 opacity-75'
              }`}
            >
              <div className="space-y-4">
                {/* Header row: avatar + status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={staff.image || '/faculty.png'}
                      alt={staff.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {staff.isActive ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60 font-medium text-xs">
                        <Eye className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-500 border-slate-300 font-medium text-xs">
                        <EyeOff className="w-3 h-3 mr-1" /> Inactive
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Name & Designation */}
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 line-clamp-1">{staff.name}</h3>
                  <p className="text-sm font-semibold text-cyan-700 line-clamp-1 mt-0.5">{staff.designation}</p>
                </div>

                {/* Details list */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  {staff.room && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{staff.room}</span>
                    </div>
                  )}
                  {staff.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{staff.email}</span>
                    </div>
                  )}
                  {staff.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{staff.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(staff)}
                  className="text-slate-700 hover:text-slate-950 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteStaff(staff.id)}
                  disabled={isDeleting && deleteId === staff.id}
                  className="text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-oxford" />
              <span>{editingStaff ? 'Edit Staff Member' : 'Add Office Staff Member'}</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm">
              Enter the staff member&apos;s administrative role, contact details, and optional photo.
            </DialogDescription>
          </DialogHeader>

          {/* Feedback banners */}
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Photo Upload & Preview */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Staff Photo</label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <Image
                    src={imagePreview || '/faculty.png'}
                    alt="Staff preview"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold rounded-xl flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imagePreview ? 'Change Photo' : 'Upload Photo'}</span>
                    </Button>

                    {imagePreview && imagePreview !== '/faculty.png' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold rounded-xl"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, or WebP. Auto-optimized to WebP.</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="staff-name" className="text-xs font-bold text-slate-700 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="staff-name"
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 text-base"
              />
            </div>

            {/* Designation */}
            <div>
              <label htmlFor="staff-designation" className="text-xs font-bold text-slate-700 block mb-1">
                Designation / Role <span className="text-rose-500">*</span>
              </label>
              <Input
                id="staff-designation"
                placeholder="e.g. Office Superintendent, Senior Clerk, Technical Assistant"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
                className="h-11 text-base"
              />
            </div>

            {/* Room / Office Location */}
            <div>
              <label htmlFor="staff-room" className="text-xs font-bold text-slate-700 block mb-1">
                Office Room / Location
              </label>
              <Input
                id="staff-room"
                placeholder="e.g. Room 102, Ground Floor, Admin Block"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="h-11 text-base"
              />
            </div>

            {/* Email & Phone grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="staff-email" className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <Input
                  id="staff-email"
                  type="email"
                  placeholder="e.g. staff@cusat.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-base"
                />
              </div>

              <div>
                <label htmlFor="staff-phone" className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number
                </label>
                <Input
                  id="staff-phone"
                  placeholder="e.g. +91 484 2577404"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 text-base"
                />
              </div>
            </div>

            {/* Display Order & Active Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label htmlFor="staff-order" className="text-xs font-bold text-slate-700 block mb-1">
                  Display Order
                </label>
                <Input
                  id="staff-order"
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                  className="h-11 text-base"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2.5 cursor-pointer py-2.5">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-oxford focus:ring-oxford cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-800">Show on Public Website</span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="rounded-xl font-semibold text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-oxford hover:bg-oxford-dark text-white rounded-xl font-semibold text-sm flex items-center gap-1.5 shadow-xs"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingStaff ? 'Update Staff Member' : 'Save Staff Member'}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
