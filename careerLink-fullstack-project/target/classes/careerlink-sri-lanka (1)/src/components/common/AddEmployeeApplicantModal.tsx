import React, { useState } from 'react';
import { EmployeeApplicant } from '../../types/career.ts';
import { X, UserPlus, CheckCircle2, User, Building, Mail, Phone, Briefcase } from 'lucide-react';

interface AddEmployeeApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newRecord: Omit<EmployeeApplicant, 'id'>) => void;
}

export const AddEmployeeApplicantModal: React.FC<AddEmployeeApplicantModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+94 ');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Technology');
  const [company, setCompany] = useState('Virtusa');
  const [type, setType] = useState<'Applicant' | 'Employee'>('Applicant');
  const [status, setStatus] = useState<EmployeeApplicant['status']>('New Applied');
  const [experienceYears, setExperienceYears] = useState(4);
  const [salaryExpectation, setSalaryExpectation] = useState(350000);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAdd({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+94 77 000 0000',
        role: role.trim(),
        department,
        company,
        type,
        status: type === 'Employee' ? 'Active Employee' : status,
        appliedJobTitle: role.trim(),
        howApplied: 'Direct Candidate Application / HR Intake',
        resumeFileName: `${name.trim().toLowerCase().replace(/\s+/g, '_')}_cv.pdf`,
        isShortlisted: false,
        experienceYears: Number(experienceYears),
        appliedDate: 'Just now',
        salaryExpectation: Number(salaryExpectation),
        rating: 4.8,
        notes: notes.trim() || 'Candidate profile added via HR portal.'
      });
      setIsSubmitting(false);
      setIsDone(true);

      setTimeout(() => {
        setIsDone(false);
        onClose();
        setName('');
        setEmail('');
        setPhone('+94 ');
        setRole('');
        setNotes('');
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base">
              Add New {type === 'Applicant' ? 'Candidate Applicant' : 'Team Employee'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white p-1 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {name} Added Successfully!
            </h4>
            <p className="text-xs text-slate-600 mt-1.5">
              The record is now visible in the applicant & employee management directory.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Record Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setType('Applicant');
                  setStatus('New Applied');
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === 'Applicant'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Candidate Applicant</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('Employee');
                  setStatus('Active Employee');
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === 'Employee'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Current Employee</span>
              </button>
            </div>

            {/* Applicant Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kasun Fernando"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kasun@example.lk"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone (Sri Lanka)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Role and Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role / Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  <option value="Technology">Technology & Engineering</option>
                  <option value="Marketing">Marketing & Communications</option>
                  <option value="Design">Product Design / UX</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations & Supply Chain</option>
                  <option value="Finance">Finance & Risk</option>
                </select>
              </div>
            </div>

            {/* Company & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Employer
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  <option value="Virtusa">Virtusa</option>
                  <option value="Brandix">Brandix</option>
                  <option value="WSO2">WSO2</option>
                  <option value="HCL Technologies">HCL Technologies</option>
                  <option value="Dialog Axiata">Dialog Axiata</option>
                  <option value="MAS Holdings">MAS Holdings</option>
                  <option value="London Stock Exchange Group">London Stock Exchange Group</option>
                  <option value="IFS Sri Lanka">IFS Sri Lanka</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pipeline Status
                </label>
                {type === 'Employee' ? (
                  <input
                    type="text"
                    disabled
                    value="Active Employee"
                    className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
                  />
                ) : (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="New Applied">New Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Hired">Hired / Ready to Onboard</option>
                  </select>
                )}
              </div>
            </div>

            {/* Experience and Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {type === 'Applicant' ? 'Expected Monthly Salary (LKR)' : 'Monthly Salary (LKR)'}
                </label>
                <input
                  type="number"
                  step="10000"
                  min="50000"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Notes / Key Skills
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key strengths, notice period, previous employer, feedback..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Actions with the Blue Add Button */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : type === 'Applicant' ? 'Add Applicant' : 'Add Employee'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
