import React, { useState, useMemo } from 'react';
import { EmployeeApplicant } from '../../types/career';
import { CompanyLogo } from '../common/CompanyLogo';
import {
  UserPlus,
  Search,
  Filter,
  Users,
  Briefcase,
  UserCheck,
  Phone,
  Mail,
  CheckCircle2,
  Trash2,
  Calendar,
  Building2,
  TrendingUp,
  Star,
  BookmarkCheck,
  FileText,
  Globe,
  Download,
  Eye,
  Check,
  Send,
  Bell,
  X,
  ArrowRight
} from 'lucide-react';

export interface CandidateManagementDashboardProps {
  records: EmployeeApplicant[];
  onAddClick: () => void;
  onUpdateStatus: (id: string, newStatus: EmployeeApplicant['status']) => void;
  onDeleteRecord: (id: string) => void;
  onToggleShortlist?: (id: string) => void;
  onSendShortlistToInterviewConsole?: (candidates: EmployeeApplicant[]) => void;
  onNavigateToInterviewConsole?: () => void;
  defaultTab?: 'all' | 'shortlist' | 'new' | 'interview' | 'hired';
}

export const CandidateManagementDashboard: React.FC<CandidateManagementDashboardProps> = ({
  records,
  onAddClick,
  onUpdateStatus,
  onDeleteRecord,
  onToggleShortlist,
  onSendShortlistToInterviewConsole,
  onNavigateToInterviewConsole,
  defaultTab = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'shortlist' | 'new' | 'interview' | 'hired'>(defaultTab);
  const [deptFilter, setDeptFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<EmployeeApplicant | null>(null);
  const [lastNotificationSentCount, setLastNotificationSentCount] = useState<number | null>(null);

  // Sync tab if defaultTab changes
  React.useEffect(() => {
    if (defaultTab) {
      setSelectedTab(defaultTab);
    }
  }, [defaultTab]);

  // Counts
  const totalCandidatesCount = records.length;
  const shortlistedMembers = useMemo(
    () => records.filter(r => r.isShortlisted || r.status === 'Shortlisted'),
    [records]
  );
  const shortlistedCount = shortlistedMembers.length;
  const newApplicationsCount = records.filter(r => r.status === 'New Applied').length;
  const interviewingCount = records.filter(r => r.status === 'Interview Scheduled').length;
  const hiredCount = records.filter(r => r.status === 'Hired' || r.status === 'Active Employee').length;

  const handleSendShortlistNotification = () => {
    if (shortlistedMembers.length === 0) return;
    if (onSendShortlistToInterviewConsole) {
      onSendShortlistToInterviewConsole(shortlistedMembers);
      setLastNotificationSentCount(shortlistedMembers.length);
    }
  };

  // Filtered dataset
  const filteredList = useMemo(() => {
    return records.filter((item) => {
      // Tab filter
      if (selectedTab === 'shortlist') {
        const isShortlisted = item.isShortlisted || item.status === 'Shortlisted';
        if (!isShortlisted) return false;
      }
      if (selectedTab === 'new' && item.status !== 'New Applied') return false;
      if (selectedTab === 'interview' && item.status !== 'Interview Scheduled') return false;
      if (selectedTab === 'hired' && item.status !== 'Hired' && item.status !== 'Active Employee') return false;

      // Department filter
      if (deptFilter !== 'All' && item.department !== deptFilter) return false;

      // Channel filter
      if (channelFilter !== 'All') {
        const channel = item.howApplied || 'Online Portal';
        if (!channel.toLowerCase().includes(channelFilter.toLowerCase())) return false;
      }

      // Search query (Name, role, company, email, howApplied)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesRole = item.role.toLowerCase().includes(query);
        const matchesCompany = item.company.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesJob = item.appliedJobTitle?.toLowerCase().includes(query);
        const matchesHow = item.howApplied?.toLowerCase().includes(query);
        return matchesName || matchesRole || matchesCompany || matchesEmail || matchesJob || matchesHow;
      }

      return true;
    });
  }, [records, selectedTab, deptFilter, channelFilter, searchTerm]);

  const handleShortlistClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onToggleShortlist) {
      onToggleShortlist(id);
    } else {
      const target = records.find(r => r.id === id);
      const isCurrentlyShortlisted = target?.isShortlisted || target?.status === 'Shortlisted';
      onUpdateStatus(id, isCurrentlyShortlisted ? 'New Applied' : 'Shortlisted');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Candidate Management with Add Candidate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Candidate Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                View how candidates applied for jobs, review applications, and manage shortlisted applicants
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Add Candidate */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAddClick}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Job Applicants */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Job Applicants</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums">{totalCandidatesCount}</span>
              <span className="text-emerald-600 text-xs font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> Live
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Applied across positions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Shortlisted Applicants */}
        <div
          onClick={() => setSelectedTab('shortlist')}
          className={`bg-white p-4 rounded-xl border shadow-xs flex items-center justify-between cursor-pointer transition-all ${
            selectedTab === 'shortlist' ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-xs text-amber-700 font-bold block flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Shortlisted Applicants</span>
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums">{shortlistedCount}</span>
              <span className="text-amber-600 text-[11px] font-bold">Top Talent</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Click to view shortlist</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
        </div>

        {/* Card 3: Interviews Scheduled */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Interviews Scheduled</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums">{interviewingCount}</span>
              <span className="text-indigo-600 text-xs font-semibold">Active</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Sessions in console</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: New Applications (This Week) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">New Applications</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums">{newApplicationsCount}</span>
              <span className="text-emerald-600 text-xs font-semibold">New</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Awaiting review</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Filter Tabs matching user requirement */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {/* 1. All Candidates */}
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Candidates ({totalCandidatesCount})
            </button>

            {/* 2. Shortlisted Applicants */}
            <button
              onClick={() => setSelectedTab('shortlist')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'shortlist'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50/60'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Shortlisted Applicants ({shortlistedCount})</span>
            </button>

            {/* 3. New Applied */}
            <button
              onClick={() => setSelectedTab('new')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedTab === 'new'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Applied ({newApplicationsCount})
            </button>

            {/* 4. In Interview */}
            <button
              onClick={() => setSelectedTab('interview')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedTab === 'interview'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interviewing ({interviewingCount})
            </button>

            {/* 5. Hired */}
            <button
              onClick={() => setSelectedTab('hired')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedTab === 'hired'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hired ({hiredCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate, job applied, channel..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          {/* Department Dropdown */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Departments</option>
            <option value="Technology">Technology</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="Data & Analytics">Data & Analytics</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
          </select>

          {/* Channel / How Applied Dropdown */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Application Channels</option>
            <option value="Portal">CareerLink Online Portal</option>
            <option value="CV">Direct CV Upload</option>
            <option value="Quick">Quick Apply</option>
            <option value="Referral">Employee Referral</option>
          </select>

          {(searchTerm || deptFilter !== 'All' || channelFilter !== 'All' || selectedTab !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDeptFilter('All');
                setChannelFilter('All');
                setSelectedTab('all');
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Header with Shortlist Actions */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-50/40 via-white to-blue-50/30">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {selectedTab === 'shortlist' ? 'Shortlisted Candidates Pool' : 'Candidates & Job Applications'} ({filteredList.length})
            </h2>
            {selectedTab === 'shortlist' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                <BookmarkCheck className="w-3 h-3 text-amber-700" />
                <span>Shortlisted Pool</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* SEND SHORTLIST TO INTERVIEW CONSOLE as notification button explicitly requested */}
            {shortlistedCount > 0 && (
              <button
                type="button"
                onClick={handleSendShortlistNotification}
                className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                title="Send shortlisted candidates to Interview Console as a notification"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Shortlist to Interview Console ({shortlistedCount})</span>
              </button>
            )}

            {onNavigateToInterviewConsole && (
              <button
                type="button"
                onClick={onNavigateToInterviewConsole}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Navigate directly to Interview Scheduling Console"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Open Interview Console</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert if Shortlist was sent to Interview Console */}
        {lastNotificationSentCount !== null && (
          <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-800 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Success!</strong> Sent {lastNotificationSentCount} shortlisted candidate(s) to Interview Console as an urgent scheduling notification.
              </span>
            </div>
            {onNavigateToInterviewConsole && (
              <button
                type="button"
                onClick={onNavigateToInterviewConsole}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Go to Interview Console</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                {/* Shortlist Action Column at the Front */}
                <th className="py-3 px-3 text-center w-28 whitespace-nowrap">
                  {selectedTab === 'shortlist' ? 'Remove' : 'Shortlist'}
                </th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">How Applied / Job Applied For</th>
                <th className="py-3 px-4">Company & Dept</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <Users className="w-9 h-9 mx-auto mb-2.5 opacity-50 text-slate-400" />
                    <p className="font-bold text-slate-700 text-sm">
                      {selectedTab === 'shortlist'
                        ? 'No candidates shortlisted yet'
                        : 'No candidate records found'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {selectedTab === 'shortlist'
                        ? 'Click the "+ Shortlist" button in front of any candidate in the list to add them here.'
                        : 'Try adjusting your search filters or add a new candidate.'}
                    </p>
                    {selectedTab === 'shortlist' && (
                      <button
                        onClick={() => setSelectedTab('all')}
                        className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        View All Candidates
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isItemShortlisted = item.isShortlisted || item.status === 'Shortlisted';
                  const appliedJob = item.appliedJobTitle || item.role;
                  const howAppliedText = item.howApplied || 'CareerLink Online Portal';
                  const resumeFile = item.resumeFileName || `${item.name.toLowerCase().replace(/\s+/g, '_')}_cv.pdf`;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setSelectedRecordForDetail(item)}
                    >
                      {/* 1. FRONT SHORTLIST / REMOVE BUTTON explicitly requested:
                          "add button front of the applicant to shortlist", and
                          "that shortlist able to edit by remove button" */}
                      <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {selectedTab === 'shortlist' || isItemShortlisted ? (
                          <button
                            type="button"
                            onClick={(e) => handleShortlistClick(e, item.id)}
                            className="w-full py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 hover:border-rose-300 shadow-2xs group/rm"
                            title="Click to remove from shortlisted applicants"
                          >
                            <X className="w-3.5 h-3.5 text-rose-600 group-hover/rm:scale-110 transition-transform" />
                            <span>Remove</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleShortlistClick(e, item.id)}
                            className="w-full py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-300 hover:border-amber-400 shadow-2xs"
                            title="Click to add to shortlisted applicants"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span>+ Shortlist</span>
                          </button>
                        )}
                      </td>

                      {/* 2. Candidate Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isItemShortlisted
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {isItemShortlisted && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                                  SHORTLISTED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="truncate max-w-[130px]">{item.email}</span>
                              <span>&middot;</span>
                              <span className="tabular-nums">{item.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. HOW APPLIED FOR A JOB column explicitly requested */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="space-y-1">
                          {/* Job Title Applied For */}
                          <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{appliedJob}</span>
                          </div>

                          {/* How Applied (Channel / Method) */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700">
                              <Globe className="w-2.5 h-2.5 text-blue-600" />
                              <span>{howAppliedText}</span>
                            </span>
                          </div>

                          {/* Attached CV / Submission Date */}
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1 text-slate-500">
                              <FileText className="w-2.5 h-2.5 text-slate-400" />
                              <span className="font-mono truncate max-w-[120px]">{resumeFile}</span>
                            </span>
                            <span>&middot;</span>
                            <span className="tabular-nums">{item.appliedDate}</span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Company & Department */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CompanyLogo name={item.company} size="sm" />
                          <div>
                            <span className="font-semibold text-slate-800 block">{item.company}</span>
                            <span className="text-[10px] text-slate-400 block">{item.department}</span>
                          </div>
                        </div>
                      </td>

                      {/* 5. Experience */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 tabular-nums">{item.experienceYears} Years</span>
                        <span className="block text-[10px] text-slate-400">
                          LKR {(item.salaryExpectation / 1000).toFixed(0)}k/mo
                        </span>
                      </td>

                      {/* 6. Pipeline Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            isItemShortlisted
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : item.status === 'Interview Scheduled'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : item.status === 'Offer Extended' || item.status === 'Hired'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.status === 'Screening'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* 7. Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Application Button */}
                          <button
                            onClick={() => setSelectedRecordForDetail(item)}
                            className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 cursor-pointer transition-colors flex items-center gap-1"
                            title="View how applied & candidate details"
                          >
                            <Eye className="w-3 h-3 text-slate-500" />
                            <span>View</span>
                          </button>

                          {/* Explicit Remove button for shortlisted applicants */}
                          {isItemShortlisted && (
                            <button
                              onClick={() => {
                                if (onToggleShortlist) {
                                  onToggleShortlist(item.id);
                                } else {
                                  onUpdateStatus(item.id, 'New Applied');
                                }
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 cursor-pointer transition-colors flex items-center gap-1"
                              title="Remove applicant from shortlist"
                            >
                              <X className="w-3 h-3 text-rose-600" />
                              <span>Remove</span>
                            </button>
                          )}

                          {/* Quick Interview Status Action */}
                          {item.status !== 'Interview Scheduled' && item.status !== 'Hired' && (
                            <button
                              onClick={() => onUpdateStatus(item.id, 'Interview Scheduled')}
                              className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 cursor-pointer transition-colors"
                              title="Advance to Interview"
                            >
                              Interview
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteRecord(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 cursor-pointer transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Application Detail Drawer */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-y-auto border-l border-slate-200 p-6 space-y-5">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Candidate Profile & Application Review
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedRecordForDetail.name}</h3>
                <p className="text-xs text-slate-500">{selectedRecordForDetail.role} &middot; {selectedRecordForDetail.company}</p>
              </div>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Quick Shortlist Toggle Header in Drawer */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              selectedRecordForDetail.isShortlisted || selectedRecordForDetail.status === 'Shortlisted'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${
                  selectedRecordForDetail.isShortlisted || selectedRecordForDetail.status === 'Shortlisted'
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-slate-400'
                }`} />
                <div>
                  <span className="text-xs font-bold block">
                    {selectedRecordForDetail.isShortlisted || selectedRecordForDetail.status === 'Shortlisted'
                      ? 'Shortlisted Applicant'
                      : 'Not in Shortlist'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {selectedRecordForDetail.isShortlisted || selectedRecordForDetail.status === 'Shortlisted'
                      ? 'This member appears in the Shortlisted Applicants pool'
                      : 'Click to shortlist this candidate for priority review'}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  handleShortlistClick(e, selectedRecordForDetail.id);
                  const nextState = !selectedRecordForDetail.isShortlisted;
                  setSelectedRecordForDetail(prev => prev ? {
                    ...prev,
                    isShortlisted: nextState,
                    status: nextState ? 'Shortlisted' : 'New Applied'
                  } : null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5 ${
                  selectedRecordForDetail.isShortlisted || selectedRecordForDetail.status === 'Shortlisted'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {selectedRecordForDetail.isShortlisted || selectedRecordForDetail.status === 'Shortlisted' ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Remove from Shortlist</span>
                  </>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5" />
                    <span>+ Add to Shortlist</span>
                  </>
                )}
              </button>
            </div>

            {/* HOW APPLIED FOR A JOB: Dedicated Application Context Card */}
            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>How Candidate Applied for Job</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300">
                  Direct Submission
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block">Job Applied For:</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {selectedRecordForDetail.appliedJobTitle || selectedRecordForDetail.role}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Employer Company:</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {selectedRecordForDetail.company}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Application Method:</span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {selectedRecordForDetail.howApplied || 'CareerLink Online Portal'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Applied Date:</span>
                  <span className="font-bold text-slate-800 tabular-nums block mt-0.5">
                    {selectedRecordForDetail.appliedDate}
                  </span>
                </div>
              </div>

              {/* Attached Resume Document */}
              <div className="pt-2 border-t border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-mono text-slate-800 text-[11px] block">
                      {selectedRecordForDetail.resumeFileName || `${selectedRecordForDetail.name.toLowerCase().replace(/\s+/g, '_')}_cv.pdf`}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF Document &middot; Verified Upload</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Downloading verified resume: ${selectedRecordForDetail.resumeFileName || 'cv.pdf'}`)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-700 border border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download CV</span>
                </button>
              </div>
            </div>

            {/* Candidate Qualifications & Pipeline Status */}
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pipeline Status:</span>
                  <span className="font-bold text-slate-800">{selectedRecordForDetail.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{selectedRecordForDetail.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{selectedRecordForDetail.experienceYears} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Salary Budget/Expectation:</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    LKR {selectedRecordForDetail.salaryExpectation.toLocaleString()} / mo
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Contact Details</h4>
                <div className="space-y-1 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRecordForDetail.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="tabular-nums">{selectedRecordForDetail.phone}</span>
                  </div>
                </div>
              </div>

              {/* Candidate Notes & Cover Assessment */}
              {selectedRecordForDetail.notes && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Application Statement & Assessment</h4>
                  <p className="p-3 bg-slate-50 rounded-lg text-slate-700 border border-slate-200/60 leading-relaxed text-xs">
                    {selectedRecordForDetail.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-slate-200 mt-auto flex items-center gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(selectedRecordForDetail.id, 'Interview Scheduled');
                  setSelectedRecordForDetail(prev => prev ? { ...prev, status: 'Interview Scheduled' } : null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(selectedRecordForDetail.id, 'Hired');
                  setSelectedRecordForDetail(prev => prev ? { ...prev, status: 'Hired' } : null);
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Hire Candidate
              </button>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
