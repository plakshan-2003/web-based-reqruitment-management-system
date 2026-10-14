import React, { useState, useMemo } from 'react';
import { InterviewScheduleItem, ScreenType, EmployeeApplicant, ShortlistNotification } from '../../types/career.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';
import { RescheduleInterviewModal } from '../common/RescheduleInterviewModal.tsx';
import { ScheduleInterviewModal } from '../common/ScheduleInterviewModal.tsx';
import {
  Users,
  Calendar,
  CalendarPlus,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Video,
  Eye,
  X,
  Clock,
  ExternalLink,
  Plus,
  BookmarkCheck,
  Bell,
  Star,
  Globe,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

interface InterviewSchedulingConsoleScreenProps {
  interviews: InterviewScheduleItem[];
  onUpdateInterview: (id: string, updates: Partial<InterviewScheduleItem>) => void;
  onAddInterview: (interview: Omit<InterviewScheduleItem, 'id'>, candidateId?: string) => void;
  onToast: (msg: string) => void;
  onScreenChange: (screen: ScreenType) => void;
  shortlistedCandidates?: EmployeeApplicant[];
  onToggleShortlist?: (id: string) => void;
  shortlistNotifications?: ShortlistNotification[];
  onClearShortlistNotification?: (id: string) => void;
}

export const InterviewSchedulingConsoleScreen: React.FC<InterviewSchedulingConsoleScreenProps> = ({
  interviews,
  onUpdateInterview,
  onAddInterview,
  onToast,
  onScreenChange,
  shortlistedCandidates = [],
  onToggleShortlist,
  shortlistNotifications = [],
  onClearShortlistNotification,
}) => {
  // Navigation: Exclusively interviews views (created interviews, shortlisted for interview, schedule, reschedule)
  const [activeTab, setActiveTab] = useState<'all' | 'shortlisted' | 'schedule' | 'reschedule'>('all');

  // Modals state: View created interview, Reschedule interview, Schedule new interview
  const [viewingInterview, setViewingInterview] = useState<InterviewScheduleItem | null>(null);
  const [reschedulingInterview, setReschedulingInterview] = useState<InterviewScheduleItem | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedCandidateForSchedule, setSelectedCandidateForSchedule] = useState<EmployeeApplicant | null>(null);

  // Calendar View Toggle matching image.png: "View Calendar View"
  const [isCalendarView, setIsCalendarView] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered dataset
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      if (activeTab === 'schedule') {
        return item.status === 'Confirmed' || item.status === 'Pending';
      }
      if (activeTab === 'reschedule') {
        return item.status === 'Rescheduled' || item.status === 'Canceled';
      }
      return true;
    });
  }, [interviews, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / itemsPerPage));
  const displayedInterviews = filteredInterviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Metrics from screenshot: 18 upcoming, 8 rescheduled
  const upcomingCount = interviews.filter(i => i.status === 'Confirmed' || i.status === 'Pending').length || 18;
  const rescheduledCount = interviews.filter(i => i.status === 'Rescheduled').length || 8;
  const unreadNotifications = shortlistNotifications.filter(n => !n.isRead);
  const latestNotification = unreadNotifications[0] || shortlistNotifications[0];

  // Handlers
  const handleConfirmReschedule = (
    id: string,
    newDate: string,
    newTime: string,
    newLink: string,
    reason: string
  ) => {
    onUpdateInterview(id, {
      originalDate: newDate,
      time: newTime,
      meetingLink: newLink,
      status: 'Rescheduled',
      notes: reason,
    });
    onToast(`Interview successfully rescheduled to ${newDate} at ${newTime}!`);
  };

  const handleCopyLink = (link: string) => {
    const fullUrl = link.startsWith('http') ? link : `https://${link}`;
    navigator.clipboard?.writeText?.(fullUrl);
    onToast(`Meeting link copied: ${link}`);
  };

  const getStatusBadge = (status: InterviewScheduleItem['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309]">
            Pending
          </span>
        );
      case 'Rescheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFEDD5] text-[#C2410C]">
            Rescheduled
          </span>
        );
      case 'Canceled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#B91C1C]">
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row">
      {/* Left Sidebar: Dedicated exclusively to Interview Management */}
      <aside className="w-full md:w-60 bg-white border-r border-slate-200/90 shrink-0 flex flex-col select-none">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">Interviews Console</h2>
              <p className="text-[10px] text-slate-500">Scheduling & Management</p>
            </div>
          </div>
        </div>

        <div className="p-3 space-y-1.5 flex-1">
          {/* 1. View Created Interviews */}
          <button
            onClick={() => setActiveTab('all')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === 'all'
                ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-slate-600" />
              <span>Created Interviews</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 tabular-nums">
              {interviews.length}
            </span>
          </button>

          {/* 2. Shortlisted Candidates for Interview explicitly requested */}
          <button
            onClick={() => setActiveTab('shortlisted')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === 'shortlisted'
                ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-500 shadow-2xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookmarkCheck className={`w-4 h-4 ${activeTab === 'shortlisted' ? 'text-amber-600' : 'text-amber-500'}`} />
              <span>Shortlisted Candidates</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 tabular-nums">
              {shortlistedCandidates.length}
            </span>
          </button>

          {/* 3. Schedule (Shedule) */}
          <button
            onClick={() => {
              setActiveTab('schedule');
              setIsScheduleModalOpen(true);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === 'schedule'
                ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarPlus className="w-4 h-4 text-emerald-600" />
              <span>Schedule Interview</span>
            </div>
            <Plus className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* 4. Reschedule (Reshedule) */}
          <button
            onClick={() => {
              setActiveTab('reschedule');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === 'reschedule'
                ? 'bg-amber-50 text-amber-800 font-bold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Reschedule Interview</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 tabular-nums">
              {rescheduledCount}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Console Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Shortlist Notification Banner if received from Candidate Management */}
        {(latestNotification || shortlistedCandidates.length > 0) && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
                <Bell className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                    Notification from Candidate Management
                  </span>
                  <span className="text-[11px] text-white/90">
                    {latestNotification?.createdAt || 'Just updated'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {latestNotification?.candidateCount || shortlistedCandidates.length} Shortlisted Candidates sent for interview scheduling
                </h3>
                <p className="text-xs text-white/90">
                  {shortlistedCandidates.length > 0
                    ? `Candidates ready: ${shortlistedCandidates.map(c => c.name).slice(0, 3).join(', ')}${shortlistedCandidates.length > 3 ? ` +${shortlistedCandidates.length - 3} more` : ''}`
                    : 'Candidate shortlist is synchronized with the console.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('shortlisted')}
                className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-900 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <BookmarkCheck className="w-4 h-4 text-amber-700" />
                <span>View & Schedule Shortlist</span>
              </button>
              {latestNotification && onClearShortlistNotification && (
                <button
                  type="button"
                  onClick={() => onClearShortlistNotification(latestNotification.id)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Title matching image.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Interview Scheduling & Rescheduling Console - CareerLink
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage created interviews, schedule shortlisted candidates, and handle reschedule requests
            </p>
          </div>

          {/* Quick Schedule Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCandidateForSchedule(null);
                setIsScheduleModalOpen(true);
              }}
              className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Schedule New Interview</span>
            </button>
          </div>
        </div>

        {/* Metric / Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Upcoming Interviews (Total): */}
          <div
            onClick={() => setActiveTab('all')}
            className={`bg-white rounded-xl p-4 border shadow-xs flex items-center justify-between cursor-pointer transition-all ${
              activeTab === 'all' ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div>
              <span className="block text-xs text-slate-600 font-medium">
                Upcoming Interviews (Total):
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                  {upcomingCount}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 stroke-[2.5]" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Shortlisted Candidates */}
          <div
            onClick={() => setActiveTab('shortlisted')}
            className={`bg-white rounded-xl p-4 border shadow-xs flex items-center justify-between cursor-pointer transition-all ${
              activeTab === 'shortlisted' ? 'border-amber-400 ring-2 ring-amber-50' : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div>
              <span className="block text-xs text-amber-800 font-bold flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Shortlisted for Interview:</span>
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                  {shortlistedCandidates.length}
                </span>
                <span className="text-[11px] font-bold text-amber-600">Ready to Book</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>

          {/* Card 3: Interviews Rescheduled (This Week): */}
          <div
            onClick={() => setActiveTab('reschedule')}
            className={`bg-white rounded-xl p-4 border shadow-xs flex items-center justify-between cursor-pointer transition-all ${
              activeTab === 'reschedule' ? 'border-amber-400 ring-2 ring-amber-50' : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div>
              <span className="block text-xs text-slate-600 font-medium">
                Interviews Rescheduled (This Week):
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                  {rescheduledCount}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 stroke-[2.5]" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Table / Calendar Container matching image.png */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Container Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Scheduled & Rescheduled Interviews
              </h2>
              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  Show All ({interviews.length})
                </button>
              )}
            </div>

            {/* Filter pills if active */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({interviews.length})
              </button>
              <button
                onClick={() => setActiveTab('shortlisted')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'shortlisted'
                    ? 'bg-amber-500 text-white shadow-2xs font-bold'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <BookmarkCheck className="w-3 h-3" />
                <span>Shortlisted ({shortlistedCandidates.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Scheduled ({interviews.filter(i => i.status === 'Confirmed' || i.status === 'Pending').length})
              </button>
              <button
                onClick={() => setActiveTab('reschedule')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeTab === 'reschedule'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Rescheduled ({interviews.filter(i => i.status === 'Rescheduled' || i.status === 'Canceled').length})
              </button>
            </div>
          </div>

          {/* Dedicated View: Shortlisted Candidates Received for Interviews */}
          {activeTab === 'shortlisted' ? (
            <div className="overflow-x-auto">
              <div className="p-3.5 bg-amber-50/60 border-b border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Shortlisted Candidates Pool:</strong> Received from Candidate Management. Click <strong>+ Schedule Interview</strong> to book an interview or <strong>Remove</strong> to update shortlist.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onScreenChange('hr-overview')}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage in Candidate Management</span>
                </button>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200/80">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Applied Job Title</th>
                    <th className="py-3 px-4">How Applied</th>
                    <th className="py-3 px-4">Employer & Dept</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Schedule & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {shortlistedCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-slate-400">
                        <BookmarkCheck className="w-9 h-9 text-amber-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-700 text-sm">No shortlisted candidates in queue</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          Shortlist candidates in Candidate Management and send them to the Interview Console.
                        </p>
                        <button
                          type="button"
                          onClick={() => onScreenChange('hr-overview')}
                          className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Go to Candidate Management
                        </button>
                      </td>
                    </tr>
                  ) : (
                    shortlistedCandidates.map((cand) => (
                      <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0 border border-amber-200">
                              {cand.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{cand.name}</span>
                              <span className="text-[11px] text-slate-400 block">{cand.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                          {cand.appliedJobTitle || cand.role}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-600">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700">
                            <Globe className="w-2.5 h-2.5 text-blue-600" />
                            <span>{cand.howApplied || 'CareerLink Online Portal'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <CompanyLogo name={cand.company} size="sm" />
                            <div>
                              <span className="font-semibold text-slate-800 block">{cand.company}</span>
                              <span className="text-[10px] text-slate-400 block">{cand.department}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap tabular-nums">
                          <span className="font-bold text-slate-800">{cand.experienceYears} Years</span>
                          <span className="block text-[10px] text-slate-400">
                            LKR {(cand.salaryExpectation / 1000).toFixed(0)}k/mo
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Shortlisted
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Schedule Interview for this candidate */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCandidateForSchedule(cand);
                                setIsScheduleModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                              title="Schedule interview session for this shortlisted candidate"
                            >
                              <CalendarPlus className="w-3.5 h-3.5" />
                              <span>+ Schedule Interview</span>
                            </button>

                            {/* Remove from Shortlist button explicitly requested */}
                            {onToggleShortlist && (
                              <button
                                type="button"
                                onClick={() => onToggleShortlist(cand.id)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 font-semibold rounded-lg text-xs border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                                title="Remove candidate from shortlist"
                              >
                                <X className="w-3.5 h-3.5 text-rose-600" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : !isCalendarView ? (
            /* Table View matching image.png */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200/80">
                    <th className="py-3 px-4">Job Seeker</th>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Employer</th>
                    <th className="py-3 px-4 whitespace-nowrap">Original D...</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Meeting Link</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {displayedInterviews.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* 1. Job Seeker (avatar + name) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setViewingInterview(row)}
                          className="flex items-center gap-2.5 text-left hover:opacity-80 cursor-pointer"
                          title="Click to view interview details"
                        >
                          <img
                            src={
                              row.candidateAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                            }
                            alt={row.candidateName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                          <span className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                            {row.candidateName}
                          </span>
                        </button>
                      </td>

                      {/* 2. Job Title */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {row.jobTitle}
                      </td>

                      {/* 3. Employer (logo + name) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CompanyLogo name={row.employer} size="sm" />
                          <span className="text-slate-800 font-medium">
                            {row.employer}
                          </span>
                        </div>
                      </td>

                      {/* 4. Original Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 tabular-nums">
                        {row.originalDate}
                      </td>

                      {/* 5. Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700 tabular-nums">
                        {row.time}
                      </td>

                      {/* 6. Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(row.status)}
                      </td>

                      {/* 7. Meeting Link (clickable & copyable) */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        <button
                          onClick={() => handleCopyLink(row.meetingLink)}
                          title="Click to copy link"
                          className="hover:text-blue-600 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer group-hover:text-slate-900"
                        >
                          <Video className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                          <span>{row.meetingLink}</span>
                        </button>
                      </td>

                      {/* 8. Actions: View Created Interview & Reschedule */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Created Interview */}
                          <button
                            onClick={() => setViewingInterview(row)}
                            title="View Created Interview Details"
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>View</span>
                          </button>

                          {/* Reschedule Interview */}
                          <button
                            onClick={() => setReschedulingInterview(row)}
                            title="Reschedule Interview"
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-semibold rounded-md text-xs border border-amber-200/80 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                            <span>Reschedule</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {displayedInterviews.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        No interviews found matching this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Interactive Calendar View */
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  August / September 2024 Interview Roster
                </h3>
                <span className="text-xs text-slate-500">
                  Showing scheduled timeslots across Colombo & Remote
                </span>
              </div>

              {/* Weekly calendar columns */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { date: '2024-08-31', day: 'Saturday, Aug 31' },
                  { date: '2024-09-01', day: 'Sunday, Sep 01' },
                  { date: '2024-09-02', day: 'Monday, Sep 02' },
                  { date: '2024-09-03', day: 'Tuesday, Sep 03' },
                  { date: '2024-09-04', day: 'Wednesday, Sep 04' },
                ].map((col) => {
                  const dayInterviews = interviews.filter(
                    (i) => i.originalDate === col.date
                  );
                  return (
                    <div
                      key={col.date}
                      className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col space-y-2 min-h-[300px]"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-bold text-xs text-slate-800">{col.day}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 tabular-nums">
                          {dayInterviews.length}
                        </span>
                      </div>

                      <div className="space-y-2 flex-1 overflow-y-auto">
                        {dayInterviews.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setViewingInterview(item)}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer text-xs"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-slate-900 truncate">
                                {item.candidateName}
                              </span>
                              <span className="text-[10px] font-medium text-slate-500 shrink-0">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 truncate mb-1">
                              {item.jobTitle}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              {getStatusBadge(item.status)}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReschedulingInterview(item);
                                }}
                                className="text-[10px] text-amber-700 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reschedule</span>
                              </button>
                            </div>
                          </div>
                        ))}

                        {dayInterviews.length === 0 && (
                          <div className="h-full flex items-center justify-center text-slate-400 text-[11px] italic">
                            No sessions
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Controls matching image.png */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs">
            {/* Left: Pagination Controls < > matching image.png */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="w-7 h-7 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="w-7 h-7 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-slate-500 ml-2">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            {/* Right: Toggle Switch "View Calendar View" matching image.png */}
            <div className="flex items-center gap-2.5">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCalendarView}
                  onChange={(e) => setIsCalendarView(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0B1B36]"></div>
              </label>
              <span className="text-xs font-semibold text-slate-700">
                View Calendar View
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* View Created Interview Details Modal */}
      {viewingInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0B1B36] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Created Interview Details</h3>
                  <p className="text-[11px] text-slate-300">Detailed schedule & candidate session overview</p>
                </div>
              </div>
              <button
                onClick={() => setViewingInterview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Candidate Info */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <img
                  src={
                    viewingInterview.candidateAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={viewingInterview.candidateName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{viewingInterview.candidateName}</h4>
                  <p className="text-slate-600 font-medium text-xs truncate">{viewingInterview.jobTitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-500 font-medium">Employer: {viewingInterview.employer}</span>
                  </div>
                </div>
                <div>
                  {getStatusBadge(viewingInterview.status)}
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Interview Date</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 tabular-nums">
                    {viewingInterview.originalDate}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Scheduled Time</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 tabular-nums">
                    {viewingInterview.time}
                  </span>
                </div>
              </div>

              {/* Meeting Link */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1.5">
                  <Video className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Virtual Meeting Link</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-slate-800 truncate text-[11px]">
                    {viewingInterview.meetingLink}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(viewingInterview.meetingLink)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      Copy Link
                    </button>
                    <a
                      href={viewingInterview.meetingLink.startsWith('http') ? viewingInterview.meetingLink : `https://${viewingInterview.meetingLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Join</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {viewingInterview.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium mb-1">Interview Notes</div>
                  <p className="text-slate-700 text-xs leading-relaxed">{viewingInterview.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setViewingInterview(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-white text-slate-700 font-semibold rounded-lg text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingInterview;
                  setViewingInterview(null);
                  setReschedulingInterview(target);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reschedule Interview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      <RescheduleInterviewModal
        isOpen={!!reschedulingInterview}
        interview={reschedulingInterview}
        onClose={() => setReschedulingInterview(null)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* Schedule New Interview Modal */}
      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedCandidateForSchedule(null);
        }}
        initialCandidate={
          selectedCandidateForSchedule
            ? {
                id: selectedCandidateForSchedule.id,
                candidateName: selectedCandidateForSchedule.name,
                jobTitle: selectedCandidateForSchedule.appliedJobTitle || selectedCandidateForSchedule.role,
                employer: selectedCandidateForSchedule.company,
              }
            : null
        }
        shortlistedCandidates={shortlistedCandidates}
        onScheduleNew={(newInterview, candidateId) => {
          onAddInterview(newInterview, candidateId);
          onToast(`Interview scheduled for ${newInterview.candidateName}!`);
          setSelectedCandidateForSchedule(null);
        }}
      />
    </div>
  );
};
