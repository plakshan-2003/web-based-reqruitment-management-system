import React, { useState } from 'react';
import { Job, Candidate, EmployeeApplicant } from '../../types/career.ts';
import {
  Calendar,
  Download,
  TrendingUp,
  LayoutDashboard,
  Users,
  UserCheck,
  ListFilter,
  BarChart3,
  ChevronRight,
  Clock,
  Briefcase,
  UserPlus,
  BookmarkCheck
} from 'lucide-react';
import { UPCOMING_INTERVIEWS, RECRUITING_FUNNEL_DATA, PIPELINE_MONTHS_DATA, DIVERSITY_HEADCOUNT_DATA } from '../../data/mockData.ts';
import { CandidateManagementDashboard } from './CandidateManagementDashboard.tsx';
import { AddEmployeeApplicantModal } from '../common/AddEmployeeApplicantModal.tsx';

interface HrOverviewScreenProps {
  jobs: Job[];
  employeeRecords: EmployeeApplicant[];
  onExportReport: () => void;
  onSelectJob: (job: Job) => void;
  onAddEmployeeRecord: (record: Omit<EmployeeApplicant, 'id'>) => void;
  onUpdateEmployeeStatus: (id: string, newStatus: EmployeeApplicant['status']) => void;
  onDeleteEmployeeRecord: (id: string) => void;
  onToggleShortlist?: (id: string) => void;
  onSendShortlistToInterviewConsole?: (candidates: EmployeeApplicant[]) => void;
  onNavigateToInterviewConsole?: () => void;
  defaultTab?: 'dashboard' | 'employees' | 'shortlist' | 'overview';
}

export const HrOverviewScreen: React.FC<HrOverviewScreenProps> = ({
  jobs,
  employeeRecords,
  onExportReport,
  onSelectJob,
  onAddEmployeeRecord,
  onUpdateEmployeeStatus,
  onDeleteEmployeeRecord,
  onToggleShortlist,
  onSendShortlistToInterviewConsole,
  onNavigateToInterviewConsole,
  defaultTab = 'employees',
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'shortlist' | 'overview'>(defaultTab);
  const [selectedDateRange, setSelectedDateRange] = useState('2024 Jan 22, 2024');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const shortlistedCount = employeeRecords.filter(r => r.isShortlisted || r.status === 'Shortlisted').length;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row">
      {/* Left Sidebar matching Image 2 */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 shrink-0 flex flex-col">
        <div className="p-4 py-5 border-b border-slate-100 hidden md:block">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            HR Management Portal
          </span>
        </div>

        <nav className="p-3 space-y-1">
          {/* 1. Candidate Management (Replaced Employees Management) */}
          <button
            onClick={() => setActiveTab('employees')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'employees'
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-4 h-4 ${activeTab === 'employees' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Candidate Management</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full tabular-nums">
              {employeeRecords.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Dashboard Overview</span>
          </button>

          {/* 2. Shortlisted Applicants */}
          <button
            onClick={() => setActiveTab('shortlist')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'shortlist'
                ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-500 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookmarkCheck className={`w-4 h-4 ${activeTab === 'shortlist' ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>Shortlisted Applicants</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full tabular-nums">
              {shortlistedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span>Analytics & Funnel</span>
          </button>
        </nav>

        {/* Quick Blue Add Button in Sidebar */}
        <div className="p-3 mt-auto border-t border-slate-100 hidden md:block">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Candidate</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Render Candidate Management Dashboard view */}
        {activeTab === 'employees' || activeTab === 'shortlist' ? (
          <CandidateManagementDashboard
            records={
              activeTab === 'shortlist'
                ? employeeRecords.filter(r => r.isShortlisted || r.status === 'Shortlisted')
                : employeeRecords
            }
            defaultTab={activeTab === 'shortlist' ? 'shortlist' : 'all'}
            onAddClick={() => setIsAddModalOpen(true)}
            onUpdateStatus={onUpdateEmployeeStatus}
            onDeleteRecord={onDeleteEmployeeRecord}
            onToggleShortlist={onToggleShortlist}
            onSendShortlistToInterviewConsole={onSendShortlistToInterviewConsole}
            onNavigateToInterviewConsole={onNavigateToInterviewConsole}
          />
        ) : (
          /* Render Main HR Overview Analytics View (Image 2) */
          <>
            {/* Top Header Bar matching Image 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  HR Overview - CareerLink
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Talent acquisition analytics, hiring pipeline & organizational metrics
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* BLUE ADD BUTTON explicitly requested by user */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Applicant</span>
                </button>

                {/* Date Range Picker matching Image 2 */}
                <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium tabular-nums">{selectedDateRange}</span>
                </div>

                {/* Export Report button matching Image 2 */}
                <button
                  onClick={onExportReport}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F224A] hover:bg-[#1A336B] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Section: Key HR Metrics matching Image 2 */}
            <section>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Key HR Metrics
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Employees: 495 ↗ */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
                  <span className="block text-xs text-slate-500 font-medium">Total Employees</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-2xl font-black text-slate-900 tabular-nums">495</span>
                    <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-[11px]">+12%</span>
                    </span>
                  </div>
                </div>

                {/* Active Job Openings: 28 ↗ */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
                  <span className="block text-xs text-slate-500 font-medium">Active Job Openings</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-2xl font-black text-slate-900 tabular-nums">28</span>
                    <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-[11px]">+4 new</span>
                    </span>
                  </div>
                </div>

                {/* Time to Fill (Avg.): 35 days ↗ */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
                  <span className="block text-xs text-slate-500 font-medium">Time to Fill (Avg.)</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-2xl font-black text-slate-900 tabular-nums">35 days</span>
                    <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-[11px]">-3d faster</span>
                    </span>
                  </div>
                </div>

                {/* Employee Turnover Rate: 4.2% ↗ */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
                  <span className="block text-xs text-slate-500 font-medium">Employee Turnover Rate</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-2xl font-black text-slate-900 tabular-nums">4.2%</span>
                    <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Benchmark</span>
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Middle Row: Candidate Status Funnel & Monthly Recruiting Pipeline matching Image 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Candidate Status Overview (Recruiting Funnel) - 5 columns */}
              <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col">
                <h2 className="text-sm font-bold text-slate-900 mb-3 tracking-tight">
                  Candidate Status Overview
                </h2>

                {/* Funnel SVG Visualization matching Image 2 */}
                <div className="flex-1 flex flex-col justify-center items-center py-2">
                  <div className="w-full max-w-[260px] space-y-1.5">
                    <div className="relative bg-[#1A365D] text-white text-center py-3 rounded-md shadow-xs text-xs font-bold transition-transform hover:scale-[1.02]">
                      <span className="tabular-nums">1500 Total Applied</span>
                    </div>
                    <div className="relative mx-auto w-[82%] bg-[#2563EB] text-white text-center py-2.5 rounded-md shadow-xs text-xs font-bold transition-transform hover:scale-[1.02] flex items-center justify-between px-3">
                      <span className="text-[11px] font-normal opacity-90">Screened</span>
                      <span className="tabular-nums">500</span>
                    </div>
                    <div className="relative mx-auto w-[65%] bg-[#E87A24] text-white text-center py-2.5 rounded-md shadow-xs text-xs font-bold transition-transform hover:scale-[1.02] flex items-center justify-between px-3">
                      <span className="text-[11px] font-normal opacity-90">Interviewed</span>
                      <span className="tabular-nums">190</span>
                    </div>
                    <div className="relative mx-auto w-[50%] bg-[#F59E0B] text-slate-900 text-center py-2 rounded-md shadow-xs text-xs font-bold transition-transform hover:scale-[1.02] flex items-center justify-between px-2.5">
                      <span className="text-[10px] font-medium">Offer</span>
                      <span className="tabular-nums">30</span>
                    </div>
                    <div className="relative mx-auto w-[36%] bg-[#10B981] text-white text-center py-2 rounded-md shadow-xs text-xs font-bold transition-transform hover:scale-[1.02] flex items-center justify-center gap-1">
                      <span className="text-[10px] font-normal">Hired</span>
                      <span className="tabular-nums">25</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-[11px] text-slate-500">
                    <span>Conversion: Applied &rarr; Hired</span>
                    <span className="font-bold text-emerald-600 tabular-nums">1.67%</span>
                  </div>
                </div>
              </div>

              {/* Monthly Recruiting Pipeline (Multi-Line Chart) - 7 columns */}
              <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Monthly Recruiting Pipeline
                  </h2>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                      Applications Received
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                      Interviews Scheduled
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full min-h-[220px] relative">
                  <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible">
                    <line x1="40" y1="20" x2="580" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="40" y1="60" x2="580" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="40" y1="100" x2="580" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="40" y1="140" x2="580" y2="140" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <line x1="40" y1="180" x2="580" y2="180" stroke="#E2E8F0" />

                    <text x="15" y="24" fontSize="10" fill="#94A3B8" className="tabular-nums font-mono">800</text>
                    <text x="15" y="64" fontSize="10" fill="#94A3B8" className="tabular-nums font-mono">600</text>
                    <text x="15" y="104" fontSize="10" fill="#94A3B8" className="tabular-nums font-mono">400</text>
                    <text x="15" y="144" fontSize="10" fill="#94A3B8" className="tabular-nums font-mono">200</text>
                    <text x="25" y="184" fontSize="10" fill="#94A3B8" className="tabular-nums font-mono">0</text>

                    <polyline
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      points="80,140 180,64 280,78 380,50 480,84 560,36"
                    />
                    {[[80,140], [180,64], [280,78], [380,50], [480,84], [560,36]].map(([x, y], idx) => (
                      <circle key={`app-${idx}`} cx={x} cy={y} r="4" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                    ))}

                    <polyline
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="2.5"
                      points="80,144 180,124 280,116 380,120 480,96 560,78"
                    />
                    {[[80,144], [180,124], [280,116], [380,120], [480,96], [560,78]].map(([x, y], idx) => (
                      <circle key={`int-${idx}`} cx={x} cy={y} r="4" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
                    ))}

                    <text x="60" y="202" fontSize="10" fill="#64748B">Last 6 Months</text>
                    <text x="165" y="202" fontSize="10" fill="#64748B">May 16</text>
                    <text x="265" y="202" fontSize="10" fill="#64748B">Jun 15</text>
                    <text x="365" y="202" fontSize="10" fill="#64748B">Jul 13</text>
                    <text x="465" y="202" fontSize="10" fill="#64748B">Aug 8</text>
                    <text x="545" y="202" fontSize="10" fill="#64748B">Current</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Row: Active Job Requisitions, Departmental Diversity, Upcoming Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Active Job Requisitions Table */}
              <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Active Job Requisitions
                  </h2>
                  <button
                    onClick={() => setActiveTab('employees')}
                    className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    View All Applicants &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="pb-2.5">Job Title</th>
                        <th className="pb-2.5">Department</th>
                        <th className="pb-2.5">Hiring Manager</th>
                        <th className="pb-2.5">Open Date</th>
                        <th className="pb-2.5">Status</th>
                        <th className="pb-2.5 text-right">Applicants</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {jobs.slice(0, 4).map((job, idx) => (
                        <tr
                          key={job.id}
                          onClick={() => onSelectJob(job)}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 font-medium text-slate-900 max-w-[150px] truncate">
                            {job.title}
                          </td>
                          <td className="py-2.5 text-slate-500 text-[11px] truncate max-w-[80px]">
                            {job.department || 'Virtusa'}
                          </td>
                          <td className="py-2.5 text-slate-500 text-[11px] truncate max-w-[80px]">
                            {job.hiringManager || 'Kasun P.'}
                          </td>
                          <td className="py-2.5 text-slate-500 text-[11px] tabular-nums whitespace-nowrap">
                            {job.postedDate}
                          </td>
                          <td className="py-2.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              idx % 2 === 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {idx % 2 === 0 ? 'Screening' : 'Interviewing'}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-bold text-slate-900 tabular-nums">
                            {job.applicantsCount} <span className="text-[10px] text-emerald-600 font-semibold">+1</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Departmental Headcount & Diversity */}
              <div className="lg:col-span-3 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col">
                <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">
                  Departmental Headcount & Diversity
                </h2>
                <p className="text-[11px] text-slate-500 mb-3">Gender distribution ratio</p>

                <div className="flex-1 flex flex-col justify-end space-y-3 pt-2">
                  <div className="flex items-end justify-between gap-3 h-36 border-b border-slate-200 pb-2 px-2">
                    {DIVERSITY_HEADCOUNT_DATA.map((dept) => (
                      <div key={dept.department} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full max-w-[32px] flex flex-col justify-end h-28 rounded-t-sm overflow-hidden shadow-xs">
                          <div
                            style={{ height: `${dept.male}%` }}
                            className="w-full bg-[#1B365D]"
                            title={`Male: ${dept.male}%`}
                          />
                          <div
                            style={{ height: `${dept.female}%` }}
                            className="w-full bg-[#E87A24]"
                            title={`Female: ${dept.female}%`}
                          />
                          <div
                            style={{ height: `${dept.other}%` }}
                            className="w-full bg-[#FCA5A5]"
                            title={`Other: ${dept.other}%`}
                          />
                        </div>
                        <span className="text-[10px] text-slate-600 font-medium truncate w-full text-center">
                          {dept.department}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#1B365D]" /> M
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#E87A24]" /> F
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#FCA5A5]" /> Other
                    </span>
                  </div>
                </div>
              </div>

              {/* Upcoming Interviews Widget */}
              <div className="lg:col-span-3 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Upcoming Interviews
                  </h2>
                  <button
                    onClick={() => setActiveTab('employees')}
                    className="text-[10px] text-blue-600 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 flex-1">
                  {UPCOMING_INTERVIEWS.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          {index + 1}. {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-600 tabular-nums">
                          {item.time}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium mt-0.5 truncate">
                        {item.jobTitle}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/60">
                        <span className="tabular-nums">{item.date}</span>
                        <span className="truncate max-w-[100px]">{item.interviewer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Add Employee Applicant Modal */}
      <AddEmployeeApplicantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddEmployeeRecord}
      />
    </div>
  );
};

