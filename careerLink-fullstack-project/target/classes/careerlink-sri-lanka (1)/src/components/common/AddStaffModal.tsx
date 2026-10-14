import React, { useState } from 'react';
import { StaffUser } from '../../types/career.ts';
import { X, UserPlus, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staff: Omit<StaffUser, 'id' | 'joinedDate'>) => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onAddStaff,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+94 ');
  const [role, setRole] = useState<StaffUser['role']>('Recruitment Officer');
  const [department, setDepartment] = useState('Hiring Services');
  const [status, setStatus] = useState<StaffUser['status']>('Active');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedFileSize, setAttachedFileSize] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      setAttachedFileSize(`${Math.round(file.size / 1024)} KB`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    onAddStaff({
      name: fullName,
      email: email.trim(),
      phone: phone.trim(),
      role,
      department: department.trim(),
      status,
      permissions: ['standard_access', 'staff_portal'],
      attachedFileName: attachedFileName || undefined,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=100&auto=format&fit=crop&q=80`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-[#0B1B36] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Add Staff Team Member</h3>
              <p className="text-slate-400 text-xs mt-0.5">Register new internal staff with file document & credentials</p>
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
                placeholder="e.g. Kasun"
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
                placeholder="e.g. Perera"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Official Email & Phone Number */}
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
                placeholder="kasun.p@careerlink.lk"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Department & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Platform Security & Trust"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Role / Designation</label>
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
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Initial Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as StaffUser['status'])}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* File Attachment: User requested "file add the staff" */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-800 font-bold text-xs">
                Attach Staff File / Contract Document
              </label>
              <span className="text-[10px] text-slate-500 font-medium">PDF, DOC, DOCX up to 10MB</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {attachedFileName ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[180px]">{attachedFileName}</span>
                  <span className="text-[10px] text-emerald-600">({attachedFileSize})</span>
                </div>
              ) : (
                <span className="text-slate-400 text-[11px] italic">No document attached yet</span>
              )}
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
              <span>Add Staff Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
