import React, { useState, useEffect } from 'react';
import { InterviewScheduleItem, EmployeeApplicant } from '../../types/career';
import { X, Calendar, Clock, Video, User, Building, Briefcase, Plus, CheckCircle2, BookmarkCheck } from 'lucide-react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleNew: (interview: Omit<InterviewScheduleItem, 'id'>, candidateId?: string) => void;
  initialCandidate?: {
    id?: string;
    candidateName?: string;
    jobTitle?: string;
    employer?: string;
  } | null;
  shortlistedCandidates?: EmployeeApplicant[];
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  onScheduleNew,
  initialCandidate,
  shortlistedCandidates = [],
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer - Virtusa');
  const [employer, setEmployer] = useState('Virtusa');
  const [date, setDate] = useState('2024-09-02');
  const [time, setTime] = useState('10:00 AM');
  const [meetingLink, setMeetingLink] = useState('meet.google.com/interview-new');
  const [notes, setNotes] = useState('Initial screening interview');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialCandidate) {
      if (initialCandidate.candidateName) setCandidateName(initialCandidate.candidateName);
      if (initialCandidate.jobTitle) setJobTitle(initialCandidate.jobTitle);
      if (initialCandidate.employer) setEmployer(initialCandidate.employer);
      if (initialCandidate.id) setSelectedCandidateId(initialCandidate.id);
    } else if (isOpen) {
      // If none specified and there are shortlisted candidates, don't force, leave default or blank
    }
  }, [initialCandidate, isOpen]);

  if (!isOpen) return null;

  const handleSelectShortlisted = (candidate: EmployeeApplicant) => {
    setCandidateName(candidate.name);
    setJobTitle(candidate.appliedJobTitle || candidate.role);
    setEmployer(candidate.company || 'Virtusa');
    setSelectedCandidateId(candidate.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) return;

    onScheduleNew(
      {
        candidateName: candidateName.trim(),
        candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        jobTitle,
        employer,
        employerLogoText: employer.toLowerCase().slice(0, 8),
        employerLogoColor: '#0052CC',
        originalDate: date,
        time,
        status: 'Confirmed',
        meetingLink,
        notes,
      },
      selectedCandidateId
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#0B1B36] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Schedule New Interview</h3>
              <p className="text-[11px] text-slate-300">Set up a session with candidate & employer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick Select from Shortlisted Applicants if available */}
          {shortlistedCandidates.length > 0 && (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Choose from Shortlisted Candidates ({shortlistedCandidates.length}):</span>
                </span>
                <span className="text-[10px] text-amber-700">Click to autofill</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {shortlistedCandidates.map((cand) => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => handleSelectShortlisted(cand)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border flex items-center gap-1 ${
                      selectedCandidateId === cand.id || candidateName === cand.name
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-amber-200 hover:border-amber-400 hover:bg-amber-100/50'
                    }`}
                  >
                    <span>{cand.name}</span>
                    <span className="opacity-70 text-[10px]">({cand.company})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Candidate Name</span>
            </label>
            <input
              type="text"
              required
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Kasun Fernando"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Job Title</span>
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Employer / Company</span>
              </label>
              <input
                type="text"
                required
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Interview Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Time Slot</span>
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-emerald-600" />
              <span>Meeting Link</span>
            </label>
            <input
              type="text"
              required
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
