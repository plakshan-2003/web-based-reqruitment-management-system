import React, { useState, useMemo } from 'react';
import { ManagedJobPosting, ScreenType } from '../../types/career.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';
import { CreateJobPostingModal } from '../common/CreateJobPostingModal.tsx';
import {
  LayoutDashboard,
  Clock,
  Plus,
  ChevronDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Archive,
  Download,
  Check,
  Search,
  FileCheck,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

interface JobPostingManagementScreenProps {
  postings: ManagedJobPosting[];
  onTogglePublished: (id: string) => void;
  onDeletePosting: (id: string) => void;
  onAddPosting: (newPosting: Omit<ManagedJobPosting, 'id' | 'applicantsCount'>) => void;
  onUpdatePosting?: (id: string, updates: Partial<ManagedJobPosting>) => void;
  onToast: (msg: string) => void;
  onScreenChange: (screen: ScreenType) => void;
}

export const JobPostingManagementScreen: React.FC<JobPostingManagementScreenProps> = ({
  postings,
  onTogglePublished,
  onDeletePosting,
  onAddPosting,
  onUpdatePosting,
  onToast,
}) => {
  // Navigation tabs: 'dashboard' or 'status'
  const [activeSidebarTab, setActiveSidebarTab] = useState<'dashboard' | 'status'>('dashboard');
  const [statusFilterTab, setStatusFilterTab] = useState<'All' | 'Approved' | 'Declined' | 'Pending'>('All');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showArchive, setShowArchive] = useState(false);
  
  // State for updating a created job posting
  const [editingPosting, setEditingPosting] = useState<ManagedJobPosting | null>(null);

  const itemsPerPage = 10;

  // Real calculated status counts
  const approvedCount = useMemo(() => {
    return postings.filter(p => p.status === 'Approved' || (!p.status && p.isPublished)).length;
  }, [postings]);

  const pendingCount = useMemo(() => {
    return postings.filter(p => p.status === 'Pending' || (!p.status && !p.isPublished)).length;
  }, [postings]);

  const declinedCount = useMemo(() => {
    return postings.filter(p => p.status === 'Declined').length;
  }, [postings]);

  // Filtered list for Dashboard table
  const filteredPostings = useMemo(() => {
    return postings.filter(p => {
      if (showArchive && p.isPublished) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      }
      return true;
    });
  }, [postings, showArchive, searchTerm]);

  // Filtered list for Status Console tab
  const statusFilteredPostings = useMemo(() => {
    return postings.filter(p => {
      const pStatus = p.status || (p.isPublished ? 'Approved' : 'Pending');
      if (statusFilterTab !== 'All' && pStatus !== statusFilterTab) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      }
      return true;
    });
  }, [postings, statusFilterTab, searchTerm]);

  const totalActiveJobs = postings.filter(p => p.isPublished).length;
  const totalDrafts = postings.filter(p => !p.isPublished).length;
  const expiringThisWeek = 3;
  const totalApplicants = postings.reduce((acc, curr) => acc + (curr.applicantsCount || 0), 0) || 145;

  const totalPages = Math.max(1, Math.ceil(filteredPostings.length / itemsPerPage));
  const displayedPostings = filteredPostings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Bulk actions handlers
  const handleBulkPublishAll = () => {
    postings.forEach(p => {
      if (!p.isPublished) onTogglePublished(p.id);
    });
    setBulkMenuOpen(false);
    onToast('All job postings are now Live & Published!');
  };

  const handleBulkDraftAll = () => {
    postings.forEach(p => {
      if (p.isPublished) onTogglePublished(p.id);
    });
    setBulkMenuOpen(false);
    onToast('All job postings converted to Drafts.');
  };

  const handleExportCSV = () => {
    const csvContent =
      'Job Title,Company,Location,Salary Range,Posted Date,Deadline,Status,Approval Status,Applicants\n' +
      postings
        .map(
          p =>
            `"${p.title}","${p.company}","${p.location}","${p.salaryRange}","${p.postedDate}","${p.deadline}","${
              p.isPublished ? 'Published' : 'Draft'
            }","${p.status || (p.isPublished ? 'Approved' : 'Pending')}",${p.applicantsCount}`
        )
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CareerLink_Job_Postings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setBulkMenuOpen(false);
    onToast('Job postings CSV exported successfully!');
  };

  // Update handler for created job - update only deadline as requested
  const handleSaveUpdatedPosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPosting) return;

    if (onUpdatePosting) {
      onUpdatePosting(editingPosting.id, {
        deadline: editingPosting.deadline,
      });
    } else {
      onToast(`Updated deadline for ${editingPosting.title} to ${editingPosting.deadline}`);
    }
    setEditingPosting(null);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row">
      {/* Left Sidebar: strictly Dashboard & Status (Approved, Declined, Pending) as requested */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 shrink-0 flex flex-col">
        <div className="p-4 py-5 border-b border-slate-100 hidden md:block">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Employer Management
          </span>
          <span className="text-xs font-bold text-slate-800 mt-0.5 block">Job Operations Console</span>
        </div>

        <nav className="p-3 space-y-2">
          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveSidebarTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSidebarTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs border border-blue-200/60'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-4 h-4 ${activeSidebarTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>Dashboard</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              {postings.length}
            </span>
          </button>

          {/* 2. Status with Approved, Declined, Pending items */}
          <div className="pt-1">
            <button
              onClick={() => {
                setActiveSidebarTab('status');
                setStatusFilterTab('All');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSidebarTab === 'status' && statusFilterTab === 'All'
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs border border-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck className={`w-4 h-4 ${activeSidebarTab === 'status' ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>Job Status</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                Workflow
              </span>
            </button>

            {/* Sub-status choices: Approved, Pending, Declined */}
            <div className="ml-3 pl-3 border-l-2 border-slate-200/80 mt-1.5 space-y-1">
              {/* Approved */}
              <button
                onClick={() => {
                  setActiveSidebarTab('status');
                  setStatusFilterTab('Approved');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeSidebarTab === 'status' && statusFilterTab === 'Approved'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Approved</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {approvedCount}
                </span>
              </button>

              {/* Pending */}
              <button
                onClick={() => {
                  setActiveSidebarTab('status');
                  setStatusFilterTab('Pending');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeSidebarTab === 'status' && statusFilterTab === 'Pending'
                    ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Pending</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {pendingCount}
                </span>
              </button>

              {/* Declined */}
              <button
                onClick={() => {
                  setActiveSidebarTab('status');
                  setStatusFilterTab('Declined');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeSidebarTab === 'status' && statusFilterTab === 'Declined'
                    ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Declined</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                  {declinedCount}
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Quick Post Button in sidebar */}
        <div className="mt-auto p-3 border-t border-slate-100">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-2 bg-[#E87A24] hover:bg-[#D96B1C] active:bg-[#C25B12] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Job</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* ======================================================== */}
        {/* VIEW 1: MAIN DASHBOARD VIEW                             */}
        {/* ======================================================== */}
        {activeSidebarTab === 'dashboard' && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Job Posting Management - CareerLink
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage active listings, review approval states, and update created roles
                </p>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5">
                {/* Create New Job Posting Button (Orange #E87A24) */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-[#E87A24] hover:bg-[#D96B1C] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Job Posting</span>
                </button>

                {/* Bulk Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Bulk Actions</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {bulkMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button
                        onClick={handleBulkPublishAll}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Publish All Jobs</span>
                      </button>
                      <button
                        onClick={handleBulkDraftAll}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Archive className="w-4 h-4 text-slate-500" />
                        <span>Move All to Drafts</span>
                      </button>
                      <button
                        onClick={handleExportCSV}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span>Export Postings (CSV)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Active Jobs */}
              <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
                <span className="block text-xs text-slate-500 font-medium">Total Active Jobs</span>
                <span className="text-3xl font-black text-slate-900 tabular-nums block mt-1">
                  {totalActiveJobs}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Live on portal</span>
              </div>

              {/* Drafts */}
              <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
                <span className="block text-xs text-slate-500 font-medium">Drafts</span>
                <span className="text-3xl font-black text-slate-900 tabular-nums block mt-1">
                  {totalDrafts}
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">Unpublished</span>
              </div>

              {/* Expiring This Week */}
              <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
                <span className="block text-xs text-slate-500 font-medium">Expiring This Week</span>
                <span className="text-3xl font-black text-slate-900 tabular-nums block mt-1">
                  {expiringThisWeek}
                </span>
                <span className="text-[11px] text-amber-600 font-medium mt-1 block">Requires extension</span>
              </div>

              {/* Total Applicants */}
              <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
                <span className="block text-xs text-slate-500 font-medium">Total Applicants</span>
                <span className="text-3xl font-black text-slate-900 tabular-nums block mt-1">
                  {totalApplicants}
                </span>
                <span className="text-[11px] text-blue-600 font-medium mt-1 block">Received resumes</span>
              </div>
            </div>

            {/* Main Content Layout: Jobs Table + Activity Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Created Jobs Table */}
              <div className="lg:col-span-9 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4">
                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search jobs by title, company..."
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowArchive(!showArchive);
                        onToast(showArchive ? 'Showing all postings' : 'Filtering by draft archives');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-semibold border text-xs transition-colors cursor-pointer ${
                        showArchive ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {showArchive ? 'Showing Drafts' : 'All Postings'}
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600 font-semibold bg-slate-50/50">
                        <th className="py-2.5 px-3">Job Title</th>
                        <th className="py-2.5 px-2">Company</th>
                        <th className="py-2.5 px-2">Location</th>
                        <th className="py-2.5 px-2">Salary</th>
                        <th className="py-2.5 px-2">Deadline</th>
                        <th className="py-2.5 px-2">Approval Status</th>
                        <th className="py-2.5 px-2">Publish</th>
                        <th className="py-2.5 px-3 text-right">Update Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {displayedPostings.map((job) => {
                        const curStatus = job.status || (job.isPublished ? 'Approved' : 'Pending');
                        return (
                          <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Title */}
                            <td className="py-3 px-3 font-semibold text-slate-900 max-w-[170px] truncate">
                              {job.title}
                            </td>

                            {/* Company */}
                            <td className="py-3 px-2 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <CompanyLogo name={job.company} size="sm" />
                                <span className="font-semibold text-slate-800">{job.company}</span>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="py-3 px-2 text-slate-600 whitespace-nowrap">
                              {job.location}
                            </td>

                            {/* Salary Range */}
                            <td className="py-3 px-2 text-slate-700 tabular-nums whitespace-nowrap font-medium">
                              {job.salaryRange}
                            </td>

                            {/* Deadline */}
                            <td className="py-3 px-2 text-slate-500 tabular-nums whitespace-nowrap text-[11px]">
                              {job.deadline}
                            </td>

                            {/* Approval Status Badge: Approved, Declined, Pending */}
                            <td className="py-3 px-2 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  curStatus === 'Approved'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : curStatus === 'Declined'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {curStatus === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {curStatus === 'Declined' && <XCircle className="w-3 h-3 text-rose-600" />}
                                {curStatus === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                                <span>{curStatus}</span>
                              </span>
                            </td>

                            {/* Publish / Draft Switch */}
                            <td className="py-3 px-2 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onTogglePublished(job.id)}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                    job.isPublished ? 'bg-slate-900' : 'bg-slate-300'
                                  }`}
                                  title={job.isPublished ? 'Published (Click to set Draft)' : 'Draft (Click to Publish)'}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                      job.isPublished ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {job.isPublished ? 'Live' : 'Draft'}
                                </span>
                              </div>
                            </td>

                            {/* Update Option Action for Created Job */}
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => setEditingPosting(job)}
                                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                                  title="Update this created job"
                                >
                                  <Edit className="w-3 h-3 text-amber-700" />
                                  <span>Update</span>
                                </button>
                                <button
                                  onClick={() => onDeletePosting(job.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                  title="Delete Posting"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer: Pagination controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="p-1.5 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-500 font-medium px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="p-1.5 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs text-slate-400">
                    Showing {displayedPostings.length} of {filteredPostings.length} created jobs
                  </span>
                </div>
              </div>

              {/* Right Column: Recent Activity */}
              <div className="lg:col-span-3 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
                    Recent Activity & Alerts
                  </h2>

                  <div className="space-y-4 text-xs">
                    <div className="pb-3 border-b border-slate-100">
                      <div className="font-bold text-slate-900 leading-snug">
                        New Applicant for Senior Software Engineer
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">2 mins ago</span>
                    </div>

                    <div className="pb-3 border-b border-slate-100">
                      <div className="font-bold text-slate-900 leading-snug">
                        Marketing Manager - Brandix Job Expiring Soon
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                    </div>

                    <div className="pb-3 border-b border-slate-100">
                      <div className="font-bold text-slate-900 leading-snug">
                        5 Candidates applied for Colombo Tech Opening
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">3 hours ago</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    + Post Another Role
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: STATUS CONSOLE (APPROVED, DECLINED, PENDING)     */}
        {/* ======================================================== */}
        {activeSidebarTab === 'status' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Created Jobs Status & Approval Console
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Track and inspect created jobs by approval status: Approved, Declined, and Pending review
                </p>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-[#E87A24] hover:bg-[#D96B1C] active:bg-[#C25B12] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create New Job Posting</span>
              </button>
            </div>

            {/* 3 Status Summary KPI Cards (Clickable to filter immediately) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Approved Card */}
              <div
                onClick={() => setStatusFilterTab('Approved')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilterTab === 'Approved'
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approved</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Live & Verified
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-slate-900 tabular-nums">{approvedCount}</span>
                  <p className="text-xs text-slate-500 mt-1">
                    Verified jobs active for candidate applications
                  </p>
                </div>
              </div>

              {/* Pending Card */}
              <div
                onClick={() => setStatusFilterTab('Pending')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilterTab === 'Pending'
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Pending</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Review In Progress
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-slate-900 tabular-nums">{pendingCount}</span>
                  <p className="text-xs text-slate-500 mt-1">
                    Awaiting moderator verification and approval
                  </p>
                </div>
              </div>

              {/* Declined Card */}
              <div
                onClick={() => setStatusFilterTab('Declined')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilterTab === 'Declined'
                    ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-rose-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Declined</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    Revision Required
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-slate-900 tabular-nums">{declinedCount}</span>
                  <p className="text-xs text-slate-500 mt-1">
                    Rejected roles requiring updates or salary revisions
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Tabs Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              {/* Status Segmented Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setStatusFilterTab('All')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilterTab === 'All'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Statuses ({postings.length})
                </button>
                <button
                  onClick={() => setStatusFilterTab('Approved')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilterTab === 'Approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved ({approvedCount})</span>
                </button>
                <button
                  onClick={() => setStatusFilterTab('Pending')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilterTab === 'Pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending ({pendingCount})</span>
                </button>
                <button
                  onClick={() => setStatusFilterTab('Declined')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilterTab === 'Declined'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Declined ({declinedCount})</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter by title, company..."
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            {/* Status Postings Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="py-3 px-4">Job Title & Company</th>
                      <th className="py-3 px-3">Location & Salary</th>
                      <th className="py-3 px-3">Dates</th>
                      <th className="py-3 px-3">Verification Status</th>
                      <th className="py-3 px-3">Moderation Feedback / Notes</th>
                      <th className="py-3 px-4 text-right">Update & Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {statusFilteredPostings.map((job) => {
                      const curStatus = job.status || (job.isPublished ? 'Approved' : 'Pending');
                      return (
                        <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Title & Company */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <CompanyLogo name={job.company} size="sm" />
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{job.title}</div>
                                <div className="text-[11px] text-slate-500">{job.company}</div>
                              </div>
                            </div>
                          </td>

                          {/* Location & Salary */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="text-slate-800 font-medium">{job.location}</div>
                            <div className="text-[11px] text-slate-500 tabular-nums">{job.salaryRange}</div>
                          </td>

                          {/* Dates */}
                          <td className="py-3.5 px-3 whitespace-nowrap text-[11px] text-slate-500">
                            <div>Posted: {job.postedDate}</div>
                            <div className="text-rose-600 font-medium">Deadline: {job.deadline}</div>
                          </td>

                          {/* Status Badge: Approved, Declined, Pending */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                curStatus === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : curStatus === 'Declined'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {curStatus === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              {curStatus === 'Declined' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                              {curStatus === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                              <span>{curStatus}</span>
                            </span>
                          </td>

                          {/* Moderation Notes / Feedback */}
                          <td className="py-3.5 px-3 text-[11px] max-w-[220px]">
                            {curStatus === 'Declined' ? (
                              <span className="text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200 block">
                                {job.declinedReason || 'Needs description revision & salary review.'}
                              </span>
                            ) : curStatus === 'Approved' ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Verified & Live for applications
                              </span>
                            ) : (
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                In review queue by platform team
                              </span>
                            )}
                          </td>

                          {/* Update & Manage Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              {/* Dedicated Update Option */}
                              <button
                                onClick={() => setEditingPosting(job)}
                                className="px-3 py-1.5 bg-[#E87A24] hover:bg-[#D96B1C] active:bg-[#C25B12] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                                title="Update this created job posting"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Update Job</span>
                              </button>

                              {/* Quick status switch dropdown */}
                              <select
                                value={curStatus}
                                onChange={(e) => {
                                  const newStatus = e.target.value as 'Approved' | 'Declined' | 'Pending';
                                  onUpdatePosting?.(job.id, {
                                    status: newStatus,
                                    isPublished: newStatus === 'Approved',
                                  });
                                  onToast(`Job status changed to ${newStatus}`);
                                }}
                                className="px-2 py-1 border border-slate-300 rounded-lg text-[11px] font-semibold bg-white text-slate-700 focus:outline-hidden"
                                title="Change status"
                              >
                                <option value="Approved">Approved</option>
                                <option value="Pending">Pending</option>
                                <option value="Declined">Declined</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {statusFilteredPostings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400">
                          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          <p className="font-semibold text-slate-600">No postings found with status "{statusFilterTab}"</p>
                          <p className="text-xs text-slate-400 mt-1">Try switching to All Statuses or create a new job</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create New Job Posting Modal */}
      <CreateJobPostingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddPosting={(newPosting) => {
          onAddPosting({
            ...newPosting,
            status: 'Pending',
          });
        }}
      />

      {/* ======================================================== */}
      {/* UPDATE CREATED JOB POSTING MODAL                         */}
      {/* "in update jobs update only deadline and remove          */}
      {/* Approval Status Approved (Verified) Publish Visibility"  */}
      {/* ======================================================== */}
      {editingPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#0B1B36] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Update Job Deadline</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Update application deadline for this job posting</p>
                </div>
              </div>
              <button
                onClick={() => setEditingPosting(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUpdatedPosting} className="p-5 space-y-4 text-xs">
              {/* Job Info Context */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/90 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">{editingPosting.title}</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-[11px]">
                  <span>🏢 {editingPosting.company}</span>
                  <span>📍 {editingPosting.location}</span>
                  <span>💰 {editingPosting.salaryRange}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <span>Current Deadline: <strong className="text-slate-700">{editingPosting.deadline}</strong></span>
                  <span>Status: <strong className="text-emerald-700">{editingPosting.status || (editingPosting.isPublished ? 'Approved' : 'Pending')}</strong></span>
                </div>
              </div>

              {/* ONLY Editable Field: Application Deadline */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5 text-xs">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>New Application Deadline <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="date"
                  required
                  value={editingPosting.deadline}
                  onChange={(e) => setEditingPosting({ ...editingPosting, deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-500 bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Adjust closing date for candidate submissions and recruitment review.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPosting(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E87A24] hover:bg-[#D96B1C] active:bg-[#C25B12] text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Deadline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
