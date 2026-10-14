import React, { useState, useEffect } from 'react';
import { Job, PlatformNotification } from '../../types/career.ts';
import { CompanyLogo } from './CompanyLogo.tsx';
import { X, BellRing, Send, Briefcase, DollarSign, Calendar, Tag } from 'lucide-react';

interface SendJobNotificationModalProps {
  isOpen: boolean;
  job: Job | null;
  onClose: () => void;
  onSendNotification: (notif: Omit<PlatformNotification, 'id' | 'createdAt' | 'readCount'>) => void;
}

export const SendJobNotificationModal: React.FC<SendJobNotificationModalProps> = ({
  isOpen,
  job,
  onClose,
  onSendNotification,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [deadline, setDeadline] = useState('');
  const [targetAudience, setTargetAudience] = useState<PlatformNotification['targetAudience']>('Candidates');
  const [priority, setPriority] = useState<PlatformNotification['priority']>('High');
  const [customMessage, setCustomMessage] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');

  useEffect(() => {
    if (job) {
      setCompanyName(job.company);
      setJobTitle(job.title);
      setJobType(`${job.workType || 'Remote'} &middot; ${job.jobType || 'Full-time'}`);
      setSalary(
        job.salaryMin && job.salaryMax
          ? `LKR ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} / month`
          : 'Competitive Industry Package'
      );
      setDeadline('2026-10-31');
      setNotificationTitle(`Job Alert: ${job.title} at ${job.company}`);
      setCustomMessage(
        `Exciting opportunity! ${job.company} is hiring for ${job.title}. Competitive compensation with priority screening for early applicants.`
      );
    } else {
      setCompanyName('Virtusa Sri Lanka');
      setJobTitle('Senior Software Engineer - Virtusa');
      setJobType('Remote / Full-time');
      setSalary('LKR 350,000 - 500,000 / month');
      setDeadline('2026-10-31');
      setNotificationTitle('New High-Priority Job Opening Alert');
      setCustomMessage('A top tier employer has opened applications for a high-demand tech position.');
    }
  }, [job]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSendNotification({
      title: notificationTitle.trim(),
      message: customMessage.trim(),
      category: 'Job Alert',
      targetAudience,
      priority,
      jobDetails: {
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobType: jobType.trim(),
        salary: salary.trim(),
        deadline: deadline.trim(),
      },
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
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Send Job Alert Notification</h3>
              <p className="text-slate-400 text-xs mt-0.5">Send alert with company, job type, salary & deadline</p>
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
          {/* Notification Title */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Notification Headline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Job Details Card (Required in User Prompt: job type, company name, job salary, deadline) */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-3">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Enclosed Job Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Company Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                  <span>Company Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  <span>Job Title</span>
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Job Type (Work Style)
                </label>
                <input
                  type="text"
                  required
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  placeholder="e.g. Remote / Full-time"
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Job Salary */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                  <span>Job Salary (LKR)</span>
                </label>
                <input
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. LKR 350,000 - 500,000 / month"
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Application Deadline */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Application Deadline</span>
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Target Audience & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as PlatformNotification['targetAudience'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="Candidates">Job Seekers & Candidates (28k+)</option>
                <option value="All Users">All Registered Platform Users</option>
                <option value="Employers">Employers & HR Representatives</option>
                <option value="Staff">Internal Staff & Recruiters</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Priority Badge</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PlatformNotification['priority'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="High">High Priority (Immediate Alert)</option>
                <option value="Urgent">Urgent / Hot Opening</option>
                <option value="Normal">Normal Notification Feed</option>
              </select>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Message Description</label>
            <textarea
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Live Notification Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Live Preview (Recipient View)
            </span>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  {priority} &middot; Job Alert
                </span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{notificationTitle || 'Job Title'}</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2">{customMessage}</p>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-700 font-medium">
                <span>🏢 {companyName}</span>
                <span>💼 {jobType}</span>
                <span>💰 {salary}</span>
                <span className="text-rose-600 font-semibold">⏳ Deadline: {deadline}</span>
              </div>
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
              className="px-6 py-2 bg-[#E87A24] hover:bg-[#D96B1C] active:bg-[#C25B12] text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
