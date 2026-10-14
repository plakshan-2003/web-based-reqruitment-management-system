import React, { useState, useMemo } from 'react';
import { Job } from '../../types/career.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

interface BrowseJobsScreenProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  savedJobIds: string[];
  onToggleSaveJob: (jobId: string) => void;
}

export const BrowseJobsScreen: React.FC<BrowseJobsScreenProps> = ({
  jobs,
  onSelectJob,
  onApplyJob,
  savedJobIds,
  onToggleSaveJob,
}) => {
  // Search query & location dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');

  // Accordion state
  const [accordions, setAccordions] = useState({
    jobType: true,
    industry: true,
    location: true,
    experience: true,
    salary: true,
    datePosted: true,
  });

  // Filter selections
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [salaryMaxLimit, setSalaryMaxLimit] = useState<number>(800000);
  const [dateFilter, setDateFilter] = useState<'all' | '24h' | '7d' | '30d'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const toggleAccordion = (key: keyof typeof accordions) => {
    setAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckboxToggle = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setLocationFilter('All');
    setSelectedJobTypes([]);
    setSelectedIndustries([]);
    setSelectedLocations([]);
    setSelectedExperiences([]);
    setSalaryMaxLimit(800000);
    setDateFilter('all');
    setCurrentPage(1);
  };

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesDesc) return false;
      }

      // Location top dropdown
      if (locationFilter !== 'All' && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      // Checkbox filters
      if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(job.jobType)) {
        return false;
      }
      if (selectedIndustries.length > 0 && !selectedIndustries.includes(job.industry)) {
        return false;
      }
      if (selectedLocations.length > 0 && !selectedLocations.some(loc => job.location.includes(loc))) {
        return false;
      }
      if (selectedExperiences.length > 0 && !selectedExperiences.includes(job.experienceLevel)) {
        return false;
      }

      // Salary max slider
      if (job.salaryMin > salaryMaxLimit) {
        return false;
      }

      // Date posted
      if (dateFilter === '24h' && job.postedDaysAgo > 1) return false;
      if (dateFilter === '7d' && job.postedDaysAgo > 7) return false;
      if (dateFilter === '30d' && job.postedDaysAgo > 30) return false;

      return true;
    });
  }, [
    jobs,
    searchTerm,
    locationFilter,
    selectedJobTypes,
    selectedIndustries,
    selectedLocations,
    selectedExperiences,
    salaryMaxLimit,
    dateFilter
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
  const displayedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Search and Location Strip matching Image 4 */}
      <div className="bg-[#0B1B36] border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Job Title, Keywords, or Company"
              className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
          </div>

          {/* Location Dropdown */}
          <div className="relative w-full md:w-64">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-10 pr-8 py-2.5 rounded-lg border border-slate-300 appearance-none focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
            >
              <option value="All">Location (All Sri Lanka)</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Remote">Remote</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Advanced Search Button */}
          <button
            onClick={() => setCurrentPage(1)}
            className="w-full md:w-auto px-6 py-2.5 bg-[#0F224A] hover:bg-[#1A336B] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Advanced Search
          </button>
        </div>
      </div>

      {/* Main Browse Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Filter Sidebar matching Image 4 */}
        <aside className="w-full md:w-64 shrink-0 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Browse Jobs</h2>
            {(selectedJobTypes.length > 0 || selectedIndustries.length > 0 || selectedLocations.length > 0 || selectedExperiences.length > 0 || searchTerm) && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* 1. Job Type */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleAccordion('jobType')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 mb-2 cursor-pointer"
            >
              <span>Job Type</span>
              {accordions.jobType ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {accordions.jobType && (
              <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes(type)}
                      onChange={() => handleCheckboxToggle(selectedJobTypes, setSelectedJobTypes, type)}
                      className="rounded-sm border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 2. Industry */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleAccordion('industry')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 mb-2 cursor-pointer"
            >
              <span>Industry</span>
              {accordions.industry ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {accordions.industry && (
              <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                {['Technology', 'Finance', 'Healthcare', 'Marketing'].map((ind) => (
                  <label key={ind} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(ind)}
                      onChange={() => handleCheckboxToggle(selectedIndustries, setSelectedIndustries, ind)}
                      className="rounded-sm border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>{ind}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 3. Location */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleAccordion('location')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 mb-2 cursor-pointer"
            >
              <span>Location</span>
              {accordions.location ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {accordions.location && (
              <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                {['Colombo', 'Kandy', 'Remote'].map((loc) => (
                  <label key={loc} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => handleCheckboxToggle(selectedLocations, setSelectedLocations, loc)}
                      className="rounded-sm border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 4. Experience Level */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleAccordion('experience')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 mb-2 cursor-pointer"
            >
              <span>Experience Level</span>
              {accordions.experience ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {accordions.experience && (
              <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                {['Entry', 'Mid', 'Senior', 'Lead'].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedExperiences.includes(lvl)}
                      onChange={() => handleCheckboxToggle(selectedExperiences, setSelectedExperiences, lvl)}
                      className="rounded-sm border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>{lvl}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 5. Salary Range */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleAccordion('salary')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 mb-2 cursor-pointer"
            >
              <span>Salary Range</span>
              {accordions.salary ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {accordions.salary && (
              <div className="pt-2 text-xs space-y-2">
                <div className="text-[11px] text-slate-500">
                  Up to: <span className="font-bold text-slate-800 tabular-nums">LKR {(salaryMaxLimit / 1000).toFixed(0)}k / month</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={800000}
                  step={25000}
                  value={salaryMaxLimit}
                  onChange={(e) => {
                    setSalaryMaxLimit(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Slider or predefined bands</span>
              </div>
            )}
          </div>

          {/* 6. Date Posted */}
          <div className="border-b border-slate-200 pb-4">
            <button
              onClick={() => toggleAccordion('datePosted')}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 mb-2 cursor-pointer"
            >
              <span>Date Posted</span>
              {accordions.datePosted ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {accordions.datePosted && (
              <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                {[
                  { id: '24h', label: 'Last 24h' },
                  { id: '7d', label: 'Last 7 days' },
                  { id: '30d', label: 'Last 30 days' },
                  { id: 'all', label: 'Any time' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="radio"
                      name="datePosted"
                      checked={dateFilter === item.id}
                      onChange={() => {
                        setDateFilter(item.id as any);
                        setCurrentPage(1);
                      }}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Job Cards List matching Image 4 */}
        <main className="flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>
              Showing <strong className="text-slate-900 tabular-nums">{displayedJobs.length}</strong> of{' '}
              <strong className="text-slate-900 tabular-nums">{filteredJobs.length}</strong> open positions
            </span>
          </div>

          {displayedJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
              <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No positions match your criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting some filters or broadening your search terms.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            displayedJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo Monogram */}
                    <CompanyLogo name={job.company} size="lg" />

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            onClick={() => onSelectJob(job)}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-amber-600 cursor-pointer transition-colors"
                          >
                            {job.title}
                          </h3>
                          <div className="text-xs text-slate-600 font-medium mt-0.5">
                            <span>{job.company}</span> &middot; <span>{job.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Brief description snippet matching Image 4 */}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Pill tags matching Image 4 */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                          {job.jobType}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
                          {job.workType}
                        </span>
                        <span className="text-slate-700 font-bold tabular-nums text-xs">
                          LKR {(job.salaryMin).toLocaleString()} - {(job.salaryMax).toLocaleString()} / month
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer matching Image 4: Posted X days ago, Apply Now, Save Job */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 tabular-nums">
                      Posted {job.postedDaysAgo} days ago
                    </span>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onApplyJob(job)}
                        className="px-5 py-2 bg-[#E87A24] hover:bg-[#D96B1C] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => onToggleSaveJob(job.id)}
                        className={`px-4 py-2 border text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSaved
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                        {isSaved ? 'Saved' : 'Save Job'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination Controls matching Image 4: Page 1 of 10, Previous, Next */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs text-slate-600">
            <div>
              Page <span className="font-bold text-slate-900 tabular-nums">{currentPage}</span> of{' '}
              <span className="font-bold text-slate-900 tabular-nums">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer font-medium"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
