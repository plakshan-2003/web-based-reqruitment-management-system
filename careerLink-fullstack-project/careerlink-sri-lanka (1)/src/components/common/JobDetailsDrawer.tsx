import React from 'react';
import { Job } from '../../types/career';
import { CompanyLogo } from './CompanyLogo';
import { X, MapPin, Briefcase, DollarSign, Calendar, Users, CheckCircle, Share2, Bookmark } from 'lucide-react';

interface JobDetailsDrawerProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
}

export const JobDetailsDrawer: React.FC<JobDetailsDrawerProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  isSaved,
  onToggleSave,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 sticky top-0 z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <CompanyLogo name={job.company} size="lg" />
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">{job.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <span className="font-semibold text-slate-800">{job.company}</span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {job.location} ({job.workType})
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Key Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="block text-[11px] text-slate-500 font-medium">Monthly Salary</span>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                LKR {(job.salaryMin / 1000).toFixed(0)}k - {(job.salaryMax / 1000).toFixed(0)}k
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 font-medium">Job Type</span>
              <span className="text-xs font-bold text-slate-900">{job.jobType}</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 font-medium">Experience</span>
              <span className="text-xs font-bold text-slate-900">{job.experienceLevel} Level</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 font-medium">Applicants</span>
              <span className="text-xs font-bold text-amber-600 tabular-nums">{job.applicantsCount} Candidates</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Role Overview</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{job.description}</p>
          </div>

          {/* Key Requirements */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Key Requirements & Qualifications</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requisition Meta */}
          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 space-y-1.5">
            <div className="flex justify-between">
              <span>Department:</span>
              <span className="font-medium text-slate-700">{job.department || 'Engineering'}</span>
            </div>
            <div className="flex justify-between">
              <span>Hiring Manager:</span>
              <span className="font-medium text-slate-700">{job.hiringManager || 'Talent Acquisition Team'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date Posted:</span>
              <span className="font-medium text-slate-700">{job.postedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-semibold ${job.status === 'Live' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {job.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={() => onToggleSave?.(job.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApply(job)}
              className="px-6 py-2 text-xs font-bold text-white bg-[#E87A24] hover:bg-[#D96B1C] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
