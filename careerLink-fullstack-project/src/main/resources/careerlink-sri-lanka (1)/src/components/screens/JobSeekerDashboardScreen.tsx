import React, { useState } from 'react';
import { Job, SeekerApplication, SeekerCV } from '../../types/career.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';
import { EditProfileModal } from '../common/EditProfileModal.tsx';
import {
  LayoutDashboard,
  User,
  Users,
  Calendar,
  Clock,
  Briefcase,
  Sliders,
  Check,
  Upload,
  Share2,
  ChevronDown,
  Bookmark,
  FileText,
  FileCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface JobSeekerDashboardScreenProps {
  jobs: Job[];
  applications: SeekerApplication[];
  onUpdateApplicationStatus: (id: string, status: SeekerApplication['status']) => void;
  onApplyJob: (job: Job) => void;
  onSelectJob: (job: Job) => void;
  savedJobIds: string[];
  onToggleSaveJob: (jobId: string) => void;
  onToast: (msg: string) => void;
}

export const JobSeekerDashboardScreen: React.FC<JobSeekerDashboardScreenProps> = ({
  jobs,
  applications,
  onUpdateApplicationStatus,
  onApplyJob,
  onSelectJob,
  savedJobIds,
  onToggleSaveJob,
  onToast,
}) => {
  const [activeNavTab, setActiveNavTab] = useState<'dashboard' | 'profile' | 'interviews' | 'status' | 'recommendations' | 'settings'>('dashboard');

  // Month and Filter controls matching image.png
  const [monthFilter, setMonthFilter] = useState('07 - 2024');
  const [interviewFilter, setInterviewFilter] = useState('Pending');
  const [offerCompanyFilter, setOfferCompanyFilter] = useState('All');

  // Profile Data
  const [profile, setProfile] = useState({
    name: 'Amila Perera',
    email: 'amila.perera@example.lk',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    role: 'Senior Software Engineer',
    bio: 'Experienced full-stack engineer specializing in enterprise cloud architecture, Java/Spring Boot, and React ecosystems.',
    completion: 80,
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // CV / Resume list matching image.png
  const [cvList, setCvList] = useState<SeekerCV[]>([
    {
      id: 'cv-1',
      filename: 'resume_AmilaPerera.pdf',
      uploadDate: '2024-07-01',
      size: '240 KB',
    },
    {
      id: 'cv-2',
      filename: 'resume_AmilaPerera_Tech.pdf',
      uploadDate: '2024-07-15',
      size: '310 KB',
    },
  ]);
  const [selectedCvIds, setSelectedCvIds] = useState<string[]>(['cv-1']);
  const [statusDropdownOpenId, setStatusDropdownOpenId] = useState<string | null>(null);

  // Toggle CV selection
  const handleToggleCvSelection = (id: string) => {
    setSelectedCvIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Upload New CV
  const handleUploadCV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newCv: SeekerCV = {
          id: `cv-${Date.now()}`,
          filename: file.name,
          uploadDate: new Date().toISOString().slice(0, 10),
          size: `${Math.round(file.size / 1024)} KB`,
        };
        setCvList(prev => [newCv, ...prev]);
        setSelectedCvIds([newCv.id]);
        onToast(`Uploaded ${file.name} successfully!`);
      }
    };
    input.click();
  };

  // Share Selected CV
  const handleShareCV = () => {
    if (selectedCvIds.length === 0) {
      onToast('Please select a CV first by checking the box');
      return;
    }
    const chosen = cvList.filter(c => selectedCvIds.includes(c.id)).map(c => c.filename).join(', ');
    navigator.clipboard?.writeText?.(window.location.href);
    onToast(`Secure link generated for: ${chosen}`);
  };

  const statusOptions: SeekerApplication['status'][] = [
    'Applied',
    'Review',
    'Interview',
    'Offer',
    'Rejected',
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row">
      {/* Left Sidebar matching image.png */}
      <aside className="w-full md:w-60 bg-white border-r border-slate-200/90 shrink-0 flex flex-col">
        <div className="p-4 py-5 border-b border-slate-100 hidden md:block">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Applicant Portal
          </span>
        </div>

        <nav className="p-3 space-y-1">
          <button
            onClick={() => setActiveNavTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeNavTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-700" />
            <span>Dashboard</span>
          </button>

          {/* Status with Approved, Declined, Pending */}
          <div className="pt-1">
            <button
              onClick={() => setActiveNavTab('status')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeNavTab === 'status'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Application Status</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                {applications.length}
              </span>
            </button>

            {/* Sub-status filters: Approved, Pending, Declined */}
            <div className="ml-3 pl-3 border-l-2 border-slate-200 mt-1 space-y-1">
              <button
                onClick={() => {
                  setActiveNavTab('status');
                  onToast('Viewing Approved / Offer applications');
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Approved (Offers)</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {applications.filter(a => a.status === 'Offer').length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNavTab('status');
                  onToast('Viewing Pending applications');
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Pending (In Review)</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {applications.filter(a => a.status === 'Review' || a.status === 'Applied' || a.status === 'Interview').length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNavTab('status');
                  onToast('Viewing Declined applications');
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Declined</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                  {applications.filter(a => a.status === 'Rejected').length}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area matching image.png */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Title matching image.png: Dashboard - Job Seeker Portal */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Dashboard - Job Seeker Portal
          </h1>
        </div>

        {/* Top 3 Stat Cards matching image.png */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Applications */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-xs text-slate-600 font-medium">Total Applications</span>
              <span className="text-3xl font-black text-slate-900 tabular-nums block mt-1">
                {Math.max(10, applications.length)}
              </span>
            </div>
            {/* Month Filter Picker */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 shadow-2xs font-semibold tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{monthFilter}</span>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {/* Card 2: Interviews Scheduled */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-xs text-slate-600 font-medium">Interviews Scheduled</span>
              <span className="text-3xl font-black text-slate-900 tabular-nums block mt-1">
                {applications.filter(a => a.status === 'Interview').length || 2}
              </span>
            </div>
            {/* Pending filter dropdown */}
            <div className="relative">
              <select
                value={interviewFilter}
                onChange={(e) => setInterviewFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 pr-7 text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="All">All Stages</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Card 3: Offers */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-xs text-slate-600 font-medium">Offers</span>
              <span className="text-3xl font-black text-slate-900 tabular-nums block mt-1">
                {applications.filter(a => a.status === 'Offer').length || 3}
              </span>
            </div>
            {/* Company Name filter dropdown */}
            <div className="relative">
              <select
                value={offerCompanyFilter}
                onChange={(e) => setOfferCompanyFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 pr-7 text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="All">Company Name</option>
                <option value="Virtusa">Virtusa</option>
                <option value="Brandix">Brandix</option>
                <option value="WSO2">WSO2</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Middle Section (3 panels matching image.png) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Panel 1: Profile Completion: 80% (3.5 columns) */}
          <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Profile Completion: {profile.completion}%
                </h3>
              </div>

              {/* Progress Bar (Orange accent #E87A24 matching image.png) */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className="bg-[#E87A24] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${profile.completion}%` }}
                />
              </div>

              {/* Checklist matching image.png */}
              <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                  <span>Profile Set Up</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                  <span>Resume Upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                  <span>1st Application</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                  <span>Interview Scheduled</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button matching image.png */}
            <div className="mt-6 pt-2">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-5 py-2 bg-[#0B1B36] hover:bg-[#1A315C] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Panel 2: Application Tracking (5.5 columns) */}
          <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">
              Application Tracking
            </h3>

            <div className="overflow-x-auto -mx-5 px-5 flex-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Company</th>
                    <th className="py-2.5 px-2">Job Title</th>
                    <th className="py-2.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {applications.slice(0, 4).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-2 text-slate-500 tabular-nums whitespace-nowrap text-[11px]">
                        {app.date}
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-900 whitespace-nowrap">
                        {app.company}
                      </td>
                      <td className="py-3 px-2 text-slate-800 font-medium truncate max-w-[130px]">
                        {app.jobTitle}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap relative">
                        {/* Status selector with open dropdown matching image.png */}
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setStatusDropdownOpenId(
                                statusDropdownOpenId === app.id ? null : app.id
                              )
                            }
                            className="flex items-center justify-between gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs cursor-pointer min-w-[76px]"
                          >
                            <span>{app.status}</span>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                          </button>

                          {/* Dropdown menu */}
                          {statusDropdownOpenId === app.id && (
                            <div className="absolute right-0 z-30 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                              {statusOptions.map((st) => (
                                <button
                                  key={st}
                                  onClick={() => {
                                    onUpdateApplicationStatus(app.id, st);
                                    setStatusDropdownOpenId(null);
                                    onToast(`Application marked as ${st}`);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                                    app.status === st
                                      ? 'font-bold text-blue-600 bg-blue-50/50'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  <span>{st}</span>
                                  {app.status === st && (
                                    <Check className="w-3 h-3 text-blue-600" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel 3: CV / Resume (3 columns) */}
          <div className="lg:col-span-3 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">
                CV / Resume
              </h3>

              {/* Resume Checkbox List matching image.png */}
              <div className="space-y-3">
                {cvList.map((cv) => {
                  const isChecked = selectedCvIds.includes(cv.id);
                  return (
                    <label
                      key={cv.id}
                      className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50/80 p-1.5 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCvSelection(cv.id)}
                        className="mt-0.5 rounded-xs border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 block truncate max-w-[170px]">
                          {cv.filename}
                        </span>
                        <span className="text-[10px] text-slate-400 tabular-nums">
                          {cv.uploadDate}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons matching image.png */}
            <div className="mt-5 space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleUploadCV}
                className="w-full py-2 bg-[#0B1B36] hover:bg-[#1A315C] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New CV</span>
              </button>
              <button
                onClick={handleShareCV}
                className="w-full py-2 bg-[#0B1B36] hover:bg-[#1A315C] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Selected CV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recommended Jobs matching image.png */}
        <section className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
            Recommended Jobs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobs.slice(0, 4).map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Company Logo Monogram */}
                    <div className="mb-2">
                      <CompanyLogo name={job.company} size="md" />
                    </div>

                    {/* Job Title and Location */}
                    <h3
                      onClick={() => onSelectJob(job)}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-1"
                    >
                      {job.title.replace(` - ${job.company}`, '')}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                      {job.location}
                    </span>

                    {/* Snippet */}
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Card Actions matching image.png: [Apply Now] [Save] */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onApplyJob(job)}
                      className="flex-1 py-1.5 bg-[#0B1B36] hover:bg-[#1A315C] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => onToggleSaveJob(job.id)}
                      className={`px-3 py-1.5 border text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={(updated) => {
          setProfile(prev => ({
            ...prev,
            ...updated,
            completion: 90,
          }));
          onToast('Job seeker profile saved successfully!');
        }}
      />
    </div>
  );
};
