import React, { useState, useEffect } from 'react';
import { StaffUser } from '../../types/career';
import { X, Edit, CheckCircle2, Shield, Upload, FileText } from 'lucide-react';

interface EditStaffProfileModalProps {
  isOpen: boolean;
  staff: StaffUser | null;
  onClose: () => void;
  onSaveProfile: (id: string, updates: Partial<StaffUser>) => void;
}

export const EditStaffProfileModal: React.FC<EditStaffProfileModalProps> = ({
  isOpen,
  staff,
  onClose,
  onSaveProfile,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffUser['role']>('Staff' as any);
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<StaffUser['status']>('Active');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [attachedFileName, setAttachedFileName] = useState('');

  useEffect(() => {
    if (staff) {
      const parts = staff.name.trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(staff.email);
      setPhone(staff.phone || '');
      setRole(staff.role);
      setDepartment(staff.department);
      setStatus(staff.status);
      setPermissions(staff.permissions || []);
      setAttachedFileName(staff.attachedFileName || '');
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const permissionOptions = [
    { id: 'user_management', label: 'User & Staff Management' },
    { id: 'employer_ban', label: 'Employer Ban & Moderation' },
    { id: 'broadcast_notifications', label: 'Broadcast Notifications & Alerts' },
    { id: 'job_approvals', label: 'Job Approvals & Review' },
    { id: 'candidate_screening', label: 'Candidate Screening & Applications' },
    { id: 'interview_scheduling', label: 'Interview Scheduling Console' },
    { id: 'analytics_export', label: 'Export Analytics & Reports' },
  ];

  const handleTogglePermission = (permId: string) => {
    setPermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    onSaveProfile(staff.id, {
      name: fullName,
      email: email.trim(),
      phone: phone.trim(),
      role,
      department: department.trim(),
      status,
      permissions,
      attachedFileName: attachedFileName || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-[#0B1B36] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Edit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Edit Staff Profile</h3>
              <p className="text-slate-400 text-xs mt-0.5">Modify role, access credentials, and security status for {staff.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* User Preview */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <img
              src={staff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={staff.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-300"
            />
            <div>
              <div className="font-bold text-slate-900 text-sm">{staff.name}</div>
              <div className="text-[11px] text-slate-500">{staff.role} &middot; {staff.department}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Member since: {staff.joinedDate}</div>
            </div>
          </div>

          {/* First Name & Last Name (Replaced Full Name) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Official Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Role / Access Level</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as StaffUser['role'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="HR Admin">HR Admin</option>
                <option value="Recruitment Officer">Recruitment Officer</option>
                <option value="Platform Moderator">Platform Moderator</option>
                <option value="Support Specialist">Support Specialist</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Account Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as StaffUser['status'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="Active">Active (Full Access)</option>
                <option value="Inactive">Inactive (Suspended)</option>
              </select>
            </div>
          </div>

          {/* Document / File Update */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-800 font-bold text-xs">Attached Document</label>
              <label className="text-blue-600 font-semibold hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Replace Document</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {attachedFileName ? (
              <div className="flex items-center gap-2 text-slate-700 font-medium bg-white p-2 rounded-lg border border-slate-200">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate flex-1 text-xs">{attachedFileName}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFileName('')}
                  className="text-slate-400 hover:text-rose-600 text-xs px-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-slate-400 text-[11px] italic">No document file attached</p>
            )}
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Security Permissions</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {permissionOptions.map(p => {
                const isChecked = permissions.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors text-[11px] text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleTogglePermission(p.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{p.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
