import React, { useState } from 'react';
import { X, Briefcase, Plus, CheckCircle2 } from 'lucide-react';
import { ManagedJobPosting } from '../../types/career.ts';

interface CreateJobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPosting: (newPosting: Omit<ManagedJobPosting, 'id' | 'applicantsCount'>) => void;
}

export const CreateJobPostingModal: React.FC<CreateJobPostingModalProps> = ({
  isOpen,
  onClose,
  onAddPosting,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Virtusa');
  const [location, setLocation] = useState('Colombo');
  const [salaryRange, setSalaryRange] = useState('LKR 350k - 500k / month');
  const [postedDate, setPostedDate] = useState(new Date().toISOString().slice(0, 10));
  const [deadline, setDeadline] = useState('2024-08-31');
  const [isPublished, setIsPublished] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddPosting({
      title: title.trim(),
      company,
      location,
      salaryRange,
      postedDate,
      deadline,
      isPublished,
    });

    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
      setTitle('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#E87A24] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base">Create New Job Posting</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Job Posting Created!</h4>
            <p className="text-xs text-slate-600 mt-1">The position is now added to your Job Posting Management dashboard.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer - Virtusa"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-600 bg-white"
                >
                  <option value="Virtusa">Virtusa</option>
                  <option value="Brandix">Brandix</option>
                  <option value="WSO2">WSO2</option>
                  <option value="HCL Technologies">HCL Technologies</option>
                  <option value="Dialog Axiata">Dialog Axiata</option>
                  <option value="MAS Holdings">MAS Holdings</option>
                  <option value="IFS Sri Lanka">IFS Sri Lanka</option>
                  <option value="Remotx">Remotx</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-600 bg-white"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Remote">Remote</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. LKR 350k - 500k / month"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Posted Date</label>
                <input
                  type="date"
                  value={postedDate}
                  onChange={(e) => setPostedDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-600"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Publication Status</span>
                <span className="text-[11px] text-slate-500">
                  {isPublished ? 'Live & Accepting Applications' : 'Saved as Private Draft'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isPublished ? 'bg-[#1E293B]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isPublished ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#E87A24] hover:bg-[#D96B1C] rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Create Job Posting
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
