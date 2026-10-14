/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, Job, EmployerRequest, EmployeeApplicant, SeekerApplication, ManagedJobPosting, InterviewScheduleItem, StaffUser, PlatformNotification, ShortlistNotification } from './types/career';
import { INITIAL_JOBS, INITIAL_EMPLOYER_REQUESTS, INITIAL_EMPLOYEES_APPLICANTS, INITIAL_MANAGED_JOB_POSTINGS, INITIAL_SCHEDULED_INTERVIEWS, INITIAL_STAFF_USERS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingScreen } from './components/screens/LandingScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { HrOverviewScreen } from './components/screens/HrOverviewScreen';
import { PlatformOverviewScreen } from './components/screens/PlatformOverviewScreen';
import { BrowseJobsScreen } from './components/screens/BrowseJobsScreen';
import { JobSeekerDashboardScreen } from './components/screens/JobSeekerDashboardScreen';
import { JobPostingManagementScreen } from './components/screens/JobPostingManagementScreen';
import { InterviewSchedulingConsoleScreen } from './components/screens/InterviewSchedulingConsoleScreen';
import { JobApplicationModal } from './components/common/JobApplicationModal';
import { JobDetailsDrawer } from './components/common/JobDetailsDrawer';
import { ExportReportModal } from './components/common/ExportReportModal';
import { RegisterModal } from './components/common/RegisterModal';
import { SignInModal } from './components/common/SignInModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { Check, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [employerRequests, setEmployerRequests] = useState<EmployerRequest[]>(INITIAL_EMPLOYER_REQUESTS);
  const [employeeRecords, setEmployeeRecords] = useState<EmployeeApplicant[]>(INITIAL_EMPLOYEES_APPLICANTS);
  const [managedPostings, setManagedPostings] = useState<ManagedJobPosting[]>(INITIAL_MANAGED_JOB_POSTINGS);
  const [interviews, setInterviews] = useState<InterviewScheduleItem[]>(INITIAL_SCHEDULED_INTERVIEWS);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [platformNotifications, setPlatformNotifications] = useState<PlatformNotification[]>(INITIAL_NOTIFICATIONS);
  const [shortlistNotifications, setShortlistNotifications] = useState<ShortlistNotification[]>([
    {
      id: 'shortlist-notif-init',
      createdAt: '15 mins ago',
      candidateCount: 2,
      candidateNames: ['Maheshika Gunaratne', 'Sanjeewa Bandara'],
      candidateIds: ['app-1', 'app-2'],
      notes: 'Initial shortlisted pool for UI/UX Designer and Marketing Manager.',
      isRead: false,
    }
  ]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-1', 'job-3']);
  const [unreadNotifications, setUnreadNotifications] = useState(4);

  // Job Seeker Portal Applications (matching image.png)
  const [seekerApplications, setSeekerApplications] = useState<SeekerApplication[]>([
    {
      id: 'app-track-1',
      date: '2024-07-25',
      company: 'Virtusa',
      jobTitle: 'Senior Software Engineer - Virtusa',
      status: 'Applied',
    },
    {
      id: 'app-track-2',
      date: '2024-07-23',
      company: 'Brandix',
      jobTitle: 'Marketing Manager - Brandix',
      status: 'Review',
    },
    {
      id: 'app-track-3',
      date: '2024-07-18',
      company: 'WSO2',
      jobTitle: 'UI/UX Designer - WSO2',
      status: 'Interview',
    },
    {
      id: 'app-track-4',
      date: '2024-07-10',
      company: 'HCL Technologies',
      jobTitle: 'Data Analyst - HCL Technologies',
      status: 'Offer',
    },
  ]);

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<Job | null>(null);
  const [exportReportType, setExportReportType] = useState<'hr' | 'platform' | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Handlers
  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const isSaved = prev.includes(jobId);
      const next = isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
      showToast(isSaved ? 'Job removed from saved bookmarks' : 'Job saved to your bookmarks!');
      return next;
    });
  };

  const handleApplicationSuccess = (jobId: string, applicantName: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    // Auto-add to seeker's own application tracking table
    const newSeekerApp: SeekerApplication = {
      id: `app-trk-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      company: targetJob?.company || 'Virtusa',
      jobTitle: targetJob?.title || 'Senior Software Engineer',
      status: 'Applied',
    };
    setSeekerApplications(prev => [newSeekerApp, ...prev]);

    // Also auto-add this applicant to the Candidate Management directory
    const newApplicant: EmployeeApplicant = {
      id: `app-auto-${Date.now()}`,
      name: applicantName,
      email: `${applicantName.toLowerCase().replace(/\s+/g, '.')}@example.lk`,
      phone: '+94 77 123 4567',
      role: targetJob?.title || 'Applied Candidate',
      appliedJobTitle: targetJob?.title || 'Senior Software Engineer',
      howApplied: 'CareerLink Online Portal (Uploaded Resume)',
      resumeFileName: `${applicantName.toLowerCase().replace(/\s+/g, '_')}_cv.pdf`,
      isShortlisted: false,
      department: targetJob?.department || 'Technology',
      company: targetJob?.company || 'Virtusa',
      type: 'Applicant',
      status: 'New Applied',
      experienceYears: 4,
      appliedDate: 'Just now',
      salaryExpectation: targetJob?.salaryMin || 350000,
      notes: `Applied for ${targetJob?.title || 'Job Listing'} via portal.`
    };
    setEmployeeRecords(prev => [newApplicant, ...prev]);

    showToast(`Application successfully sent for ${applicantName}! Added to candidate records.`);
  };

  const handleUpdateSeekerApplicationStatus = (id: string, status: SeekerApplication['status']) => {
    setSeekerApplications(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleToggleShortlistCandidate = (id: string) => {
    setEmployeeRecords(prev =>
      prev.map(r => {
        if (r.id === id) {
          const nextShortlisted = !r.isShortlisted;
          const nextStatus = nextShortlisted ? ('Shortlisted' as const) : ('New Applied' as const);
          showToast(nextShortlisted ? `Candidate "${r.name}" added to Shortlisted Applicants!` : `Candidate "${r.name}" removed from shortlist.`);
          return {
            ...r,
            isShortlisted: nextShortlisted,
            status: nextStatus,
          };
        }
        return r;
      })
    );
  };

  const handleAddEmployeeRecord = (record: Omit<EmployeeApplicant, 'id'>) => {
    const newEntry: EmployeeApplicant = {
      ...record,
      id: `rec-${Date.now()}`,
    };
    setEmployeeRecords(prev => [newEntry, ...prev]);
    showToast(`${record.name} added to candidate directory!`);
  };

  const handleUpdateEmployeeStatus = (id: string, newStatus: EmployeeApplicant['status']) => {
    setEmployeeRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus, type: newStatus === 'Active Employee' || newStatus === 'Hired' ? 'Employee' : r.type } : r))
    );
    showToast(`Candidate status updated to "${newStatus}"!`);
  };

  const handleDeleteEmployeeRecord = (id: string) => {
    const target = employeeRecords.find(r => r.id === id);
    setEmployeeRecords(prev => prev.filter(r => r.id !== id));
    showToast(`Record for ${target?.name || 'Applicant'} removed.`);
  };

  const handleToggleJobStatus = (id: string) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id === id) {
          const nextStatus = j.status === 'Live' ? 'Pending Approval' : 'Live';
          showToast(`Job status updated to "${nextStatus}"`);
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
  };

  const handleDeleteJob = (id: string) => {
    const job = jobs.find(j => j.id === id);
    setJobs(prev => prev.filter(j => j.id !== id));
    showToast(`Job listing "${job?.title || id}" removed.`);
  };

  const handleApproveEmployer = (id: string) => {
    setEmployerRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Approved', isBanned: false } : r))
    );
    showToast('Employer request approved & verified.');
  };

  const handleDeclineEmployer = (id: string) => {
    setEmployerRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Declined' } : r))
    );
    showToast('Employer request declined.');
  };

  const handleBanEmployer = (id: string, reason: string = 'Violated platform terms') => {
    setEmployerRequests(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, status: 'Banned', isBanned: true, banReason: reason } : emp))
    );
    showToast('Employer account has been banned & active postings suspended.');
  };

  const handleUnbanEmployer = (id: string) => {
    setEmployerRequests(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, status: 'Approved', isBanned: false, banReason: undefined } : emp))
    );
    showToast('Employer has been unbanned and restored to Active status.');
  };

  const handleAddStaff = (staffData: Omit<StaffUser, 'id' | 'joinedDate'>) => {
    const newStaff: StaffUser = {
      ...staffData,
      id: `staff-${Date.now()}`,
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    setStaffUsers(prev => [newStaff, ...prev]);
    showToast(`Staff member "${staffData.name}" added successfully.`);
  };

  const handleUpdateStaff = (id: string, updates: Partial<StaffUser>) => {
    setStaffUsers(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Staff profile updated successfully.');
  };

  const handleDeleteStaff = (id: string) => {
    const target = staffUsers.find(s => s.id === id);
    setStaffUsers(prev => prev.filter(s => s.id !== id));
    showToast(`Staff member "${target?.name || 'Staff'}" removed.`);
  };

  const handleSendNotification = (notifData: Omit<PlatformNotification, 'id' | 'createdAt' | 'readCount'>) => {
    const newNotif: PlatformNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      createdAt: 'Just now',
      readCount: 0,
    };
    setPlatformNotifications(prev => [newNotif, ...prev]);
    setUnreadNotifications(prev => prev + 1);
    showToast(`Notification "${notifData.title}" sent successfully!`);
  };

  const handleDeleteNotification = (id: string) => {
    setPlatformNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted from platform feed.');
  };

  const handleTogglePostingPublished = (id: string) => {
    setManagedPostings(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextState = !p.isPublished;
          showToast(`Job posting is now ${nextState ? 'Live & Published' : 'Draft / Unpublished'}`);
          return { ...p, isPublished: nextState };
        }
        return p;
      })
    );
  };

  const handleDeletePosting = (id: string) => {
    const target = managedPostings.find(p => p.id === id);
    setManagedPostings(prev => prev.filter(p => p.id !== id));
    showToast(`Job posting "${target?.title || id}" removed.`);
  };

  const handleAddPosting = (newPosting: Omit<ManagedJobPosting, 'id' | 'applicantsCount'>) => {
    const newId = `post-${Date.now()}`;
    const item: ManagedJobPosting = {
      ...newPosting,
      id: newId,
      applicantsCount: 0,
    };
    setManagedPostings(prev => [item, ...prev]);

    // Also sync with main job listings
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: newPosting.title,
      company: newPosting.company,
      companyLogoText: newPosting.company.toLowerCase().slice(0, 8),
      companyColor: '#2563EB',
      location: newPosting.location,
      workType: 'Hybrid',
      jobType: 'Full-time',
      industry: 'Technology',
      experienceLevel: 'Mid',
      salaryMin: 280000,
      salaryMax: 450000,
      salaryPeriod: 'month',
      description: `Opportunity at ${newPosting.company} for a ${newPosting.title}.`,
      requirements: [
        'Recognized degree or equivalent industry experience',
        '2+ years relevant hands-on experience',
        'Good team communication and problem solving',
      ],
      postedDate: newPosting.postedDate,
      postedDaysAgo: 0,
      applicantsCount: 0,
      status: newPosting.isPublished ? 'Live' : 'Pending Approval',
      department: 'Engineering',
    };
    setJobs(prev => [newJob, ...prev]);
    showToast(`Job posting "${newPosting.title}" created successfully!`);
  };

  const handleUpdatePosting = (id: string, updates: Partial<ManagedJobPosting>) => {
    setManagedPostings(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    // Also sync updates with main jobs list if matching title/company
    if (updates.title || updates.isPublished !== undefined || updates.salaryRange) {
      setJobs(prev =>
        prev.map(j => {
          const match = managedPostings.find(p => p.id === id);
          if (match && j.title === match.title && j.company === match.company) {
            return {
              ...j,
              title: updates.title || j.title,
              company: updates.company || j.company,
              location: updates.location || j.location,
              status: updates.status === 'Approved' ? 'Live' : updates.status === 'Declined' ? 'Closed' : 'Pending Approval',
            };
          }
          return j;
        })
      );
    }
    showToast(`Job posting "${updates.title || 'Job'}" updated successfully!`);
  };

  const handleUpdateInterview = (id: string, updates: Partial<InterviewScheduleItem>) => {
    setInterviews(prev =>
      prev.map(i => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const handleSendShortlistToInterviewConsole = (candidates: EmployeeApplicant[]) => {
    const notifId = `shortlist-notif-${Date.now()}`;
    const newShortlistNotif: ShortlistNotification = {
      id: notifId,
      createdAt: 'Just now',
      candidateCount: candidates.length,
      candidateNames: candidates.map(c => c.name),
      candidateIds: candidates.map(c => c.id),
      notes: `Sent ${candidates.length} candidate(s) for interview scheduling.`,
      isRead: false,
    };
    setShortlistNotifications(prev => [newShortlistNotif, ...prev]);

    // Also register platform notification for bell dropdown
    const newPlatformNotif: PlatformNotification = {
      id: `plat-notif-${Date.now()}`,
      title: `Shortlist Sent to Interview Console (${candidates.length} Candidates)`,
      message: `${candidates.length} shortlisted candidate(s) (${candidates.map(c => c.name).slice(0, 2).join(', ')}${candidates.length > 2 ? '...' : ''}) are now available in the Interview Scheduling Console.`,
      category: 'Employer Update',
      targetAudience: 'Employers',
      createdAt: 'Just now',
      priority: 'Urgent',
      readCount: 0,
    };
    setPlatformNotifications(prev => [newPlatformNotif, ...prev]);
    setUnreadNotifications(prev => prev + 1);

    showToast(`Shortlist with ${candidates.length} candidate(s) sent to Interview Console as a notification!`);
  };

  const handleClearShortlistNotification = (id: string) => {
    setShortlistNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleAddInterview = (newInterview: Omit<InterviewScheduleItem, 'id'>, candidateId?: string) => {
    const item: InterviewScheduleItem = {
      ...newInterview,
      id: `int-sch-${Date.now()}`,
    };
    setInterviews(prev => [item, ...prev]);

    // If scheduled for a candidate from candidate records, update their pipeline status
    if (candidateId) {
      setEmployeeRecords(prev =>
        prev.map(r => (r.id === candidateId ? { ...r, status: 'Interview Scheduled' } : r))
      );
    } else {
      // Try matching by candidate name
      setEmployeeRecords(prev =>
        prev.map(r =>
          r.name.toLowerCase() === newInterview.candidateName.toLowerCase()
            ? { ...r, status: 'Interview Scheduled' }
            : r
        )
      );
    }

    showToast(`Interview for ${newInterview.candidateName} scheduled successfully!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Main Navigation Bar */}
      <Header
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onOpenSignIn={() => setCurrentScreen('login')}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadNotifications}
      />

      {/* Screen Views matching user images */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'landing' && (
          <LandingScreen
            onScreenChange={setCurrentScreen}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            onLoginSuccess={(role, name) => {
              showToast(`Welcome back, ${name}! Signed in as ${role === 'seeker' ? 'Candidate' : role === 'employer' ? 'Employer' : 'Administrator'}.`);
              if (role === 'employer') {
                setCurrentScreen('job-posting-management');
              } else if (role === 'admin') {
                setCurrentScreen('platform-overview');
              } else {
                setCurrentScreen('job-seeker-dashboard');
              }
            }}
            onNavigateRegister={() => setIsRegisterOpen(true)}
            onNavigateHome={() => setCurrentScreen('landing')}
            onToast={showToast}
          />
        )}

        {currentScreen === 'hr-overview' && (
          <HrOverviewScreen
            defaultTab="employees"
            jobs={jobs}
            employeeRecords={employeeRecords}
            onExportReport={() => setExportReportType('hr')}
            onSelectJob={setSelectedJobForDetails}
            onAddEmployeeRecord={handleAddEmployeeRecord}
            onUpdateEmployeeStatus={handleUpdateEmployeeStatus}
            onDeleteEmployeeRecord={handleDeleteEmployeeRecord}
            onToggleShortlist={handleToggleShortlistCandidate}
            onSendShortlistToInterviewConsole={handleSendShortlistToInterviewConsole}
            onNavigateToInterviewConsole={() => setCurrentScreen('interview-scheduling')}
          />
        )}

        {currentScreen === 'platform-overview' && (
          <PlatformOverviewScreen
            jobs={jobs}
            employerRequests={employerRequests}
            employeeRecords={employeeRecords}
            onApproveEmployer={handleApproveEmployer}
            onDeclineEmployer={handleDeclineEmployer}
            onBanEmployer={handleBanEmployer}
            onUnbanEmployer={handleUnbanEmployer}
            onToggleJobStatus={handleToggleJobStatus}
            onDeleteJob={handleDeleteJob}
            onSelectJob={setSelectedJobForDetails}
            onExportReport={() => setExportReportType('platform')}
            staffUsers={staffUsers}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
            notifications={platformNotifications}
            onSendNotification={handleSendNotification}
            onDeleteNotification={handleDeleteNotification}
            onToast={showToast}
          />
        )}

        {currentScreen === 'browse-jobs' && (
          <BrowseJobsScreen
            jobs={jobs}
            onSelectJob={setSelectedJobForDetails}
            onApplyJob={setSelectedJobForApplication}
            savedJobIds={savedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
          />
        )}

        {currentScreen === 'job-seeker-dashboard' && (
          <JobSeekerDashboardScreen
            jobs={jobs}
            applications={seekerApplications}
            onUpdateApplicationStatus={handleUpdateSeekerApplicationStatus}
            onApplyJob={(job) => {
              setSelectedJobForApplication(job);
            }}
            onSelectJob={setSelectedJobForDetails}
            savedJobIds={savedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
            onToast={showToast}
          />
        )}

        {currentScreen === 'job-posting-management' && (
          <JobPostingManagementScreen
            postings={managedPostings}
            onTogglePublished={handleTogglePostingPublished}
            onDeletePosting={handleDeletePosting}
            onAddPosting={handleAddPosting}
            onUpdatePosting={handleUpdatePosting}
            onToast={showToast}
            onScreenChange={setCurrentScreen}
          />
        )}

        {currentScreen === 'interview-scheduling' && (
          <InterviewSchedulingConsoleScreen
            interviews={interviews}
            onUpdateInterview={handleUpdateInterview}
            onAddInterview={handleAddInterview}
            onToast={showToast}
            onScreenChange={setCurrentScreen}
            shortlistedCandidates={employeeRecords.filter(r => r.isShortlisted || r.status === 'Shortlisted')}
            onToggleShortlist={handleToggleShortlistCandidate}
            shortlistNotifications={shortlistNotifications}
            onClearShortlistNotification={handleClearShortlistNotification}
          />
        )}
      </main>

      {/* Persistent Footer */}
      {currentScreen !== 'login' && <Footer onScreenChange={setCurrentScreen} />}

      {/* Modals & Drawers */}
      <JobApplicationModal
        job={selectedJobForApplication}
        isOpen={!!selectedJobForApplication}
        onClose={() => setSelectedJobForApplication(null)}
        onSuccess={handleApplicationSuccess}
      />

      <JobDetailsDrawer
        job={selectedJobForDetails}
        isOpen={!!selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        onApply={(job) => {
          setSelectedJobForDetails(null);
          setSelectedJobForApplication(job);
        }}
        isSaved={selectedJobForDetails ? savedJobIds.includes(selectedJobForDetails.id) : false}
        onToggleSave={handleToggleSaveJob}
      />

      <ExportReportModal
        isOpen={!!exportReportType}
        reportType={exportReportType || 'hr'}
        jobs={jobs}
        onClose={() => setExportReportType(null)}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSwitchToRegister={() => {
          setIsSignInOpen(false);
          setIsRegisterOpen(true);
        }}
        onSuccess={(role, name) => {
          showToast(`Welcome back, ${name}! Signed in as ${role === 'seeker' ? 'Job Seeker' : role === 'employer' ? 'Employer' : 'Administrator'}.`);
          if (role === 'employer') {
            setCurrentScreen('job-posting-management');
          } else if (role === 'admin') {
            setCurrentScreen('platform-overview');
          } else {
            setCurrentScreen('job-seeker-dashboard');
          }
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToSignIn={() => {
          setIsRegisterOpen(false);
          setIsSignInOpen(true);
        }}
        onSuccess={(role, name) => {
          showToast(`Welcome, ${name}! Logged in as ${role === 'seeker' ? 'Candidate' : 'Employer'}.`);
          if (role === 'employer') {
            setCurrentScreen('hr-overview');
          } else {
            setCurrentScreen('browse-jobs');
          }
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClearAll={() => {
          setUnreadNotifications(0);
          showToast('Notifications marked as read.');
          setIsNotificationsOpen(false);
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-slate-700 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
