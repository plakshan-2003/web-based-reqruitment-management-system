export type ScreenType =
  | 'landing'
  | 'login'
  | 'hr-overview'
  | 'platform-overview'
  | 'browse-jobs'
  | 'job-seeker-dashboard'
  | 'job-posting-management'
  | 'interview-scheduling';

export interface InterviewScheduleItem {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  jobTitle: string;
  employer: string;
  employerLogoText?: string;
  employerLogoColor?: string;
  originalDate: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Rescheduled' | 'Canceled';
  meetingLink: string;
  notes?: string;
}

export interface ManagedJobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  postedDate: string;
  deadline: string;
  isPublished: boolean;
  applicantsCount: number;
  status?: 'Approved' | 'Declined' | 'Pending';
  declinedReason?: string;
}

export interface SeekerApplication {
  id: string;
  date: string;
  company: string;
  jobTitle: string;
  status: 'Applied' | 'Review' | 'Interview' | 'Offer' | 'Rejected';
}

export interface SeekerCV {
  id: string;
  filename: string;
  uploadDate: string;
  size?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoText: string;
  companyColor: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-site';
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  industry: 'Technology' | 'Finance' | 'Healthcare' | 'Marketing' | 'Apparel & Manufacturing';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: 'month' | 'year';
  description: string;
  requirements: string[];
  postedDate: string;
  postedDaysAgo: number;
  applicantsCount: number;
  status: 'Live' | 'Pending Approval' | 'Closed';
  isFeatured?: boolean;
  department?: string;
  hiringManager?: string;
}

export interface Candidate {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  date: string;
  time: string;
  interviewer: string;
  status: 'Screening' | 'Interviewing' | 'Offer Extended' | 'Hired' | 'Rejected';
  avatar?: string;
}

export interface EmployeeApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  company: string;
  type: 'Applicant' | 'Employee';
  status: 'New Applied' | 'Screening' | 'Interview Scheduled' | 'Shortlisted' | 'Offer Extended' | 'Hired' | 'Active Employee';
  experienceYears: number;
  appliedDate: string;
  salaryExpectation: number;
  rating?: number;
  notes?: string;
  appliedJobTitle?: string;
  howApplied?: string;
  resumeFileName?: string;
  isShortlisted?: boolean;
}

export interface EmployerRequest {
  id: string;
  companyName: string;
  logo: string;
  requestDate: string;
  industry: string;
  location: string;
  contactEmail: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Banned';
  isBanned?: boolean;
  banReason?: string;
  activeJobsCount?: number;
  contactPhone?: string;
  registrationNumber?: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'HR Admin' | 'Recruitment Officer' | 'Platform Moderator' | 'Support Specialist';
  department: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  joinedDate: string;
  permissions: string[];
  attachedFileName?: string;
}

export interface ShortlistNotification {
  id: string;
  createdAt: string;
  candidateCount: number;
  candidateNames: string[];
  candidateIds: string[];
  notes?: string;
  isRead: boolean;
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  category: 'Job Alert' | 'System Announcement' | 'Employer Update' | 'Security';
  targetAudience: 'All Users' | 'Candidates' | 'Employers' | 'Staff';
  createdAt: string;
  priority: 'High' | 'Normal' | 'Urgent';
  readCount: number;
  jobDetails?: {
    companyName: string;
    jobTitle: string;
    jobType: string;
    salary: string;
    deadline: string;
  };
}

export interface JobFilters {
  searchQuery: string;
  location: string;
  jobTypes: string[];
  industries: string[];
  locations: string[];
  experienceLevels: string[];
  minSalary: number;
  maxSalary: number;
  datePosted: 'all' | '24h' | '7d' | '30d';
}
