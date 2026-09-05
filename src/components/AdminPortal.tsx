import React, { useState } from 'react';
import { 
  Job, 
  Application, 
  WorkplaceType, 
  JobType, 
  ExperienceLevel,
  Enterprise,
  EnterpriseAnnouncement
} from '../types/job';
import { USER_PRESET_LOCATIONS } from '../utils/geo';
import { 
  ShieldCheck, 
  Briefcase, 
  Users, 
  Send, 
  Bell, 
  Sparkles, 
  Plus, 
  Search, 
  CheckCircle, 
  X, 
  Eye, 
  FileText, 
  Trash2, 
  TrendingUp, 
  Layers, 
  Sliders, 
  SlidersHorizontal,
  CheckCircle2,
  Megaphone,
  Pin,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  DollarSign,
  UserCheck,
  UserX,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface AdminPortalProps {
  jobs: Job[];
  applications: Application[];
  enterprises?: Enterprise[];
  onAddJob: (newJob: Job) => void;
  onUpdateJobStatus: (jobId: string, status: 'active' | 'closed') => void;
  onUpdateApplicationStage: (appId: string, newStage: any) => void;
  onBroadcastNotification: (title: string, message: string) => void;
  onAddAnnouncement?: (ann: EnterpriseAnnouncement) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  jobs,
  applications,
  enterprises = [],
  onAddJob,
  onUpdateJobStatus,
  onUpdateApplicationStage,
  onBroadcastNotification,
  onAddAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [adminTab, setAdminTab] = useState<'jobs' | 'applications' | 'users' | 'announcements' | 'broadcast' | 'ai_engine'>('jobs');
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'info' | 'urgent' | 'job_alert'>('info');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('Anthropic Labs');
  const [newLocation, setNewLocation] = useState('San Francisco, CA');
  const [newWorkplace, setNewWorkplace] = useState<WorkplaceType>('Hybrid');
  const [newJobType, setNewJobType] = useState<JobType>('Full-time');
  const [newSalaryMin, setNewSalaryMin] = useState(155000);
  const [newSalaryMax, setNewSalaryMax] = useState(205000);
  const [newExperience, setNewExperience] = useState<ExperienceLevel>('Senior');
  const [newDepartment, setNewDepartment] = useState('Engineering');
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('5+ years TypeScript & React\nSystem architecture experience\nTeam mentorship');

  // Job Search in Admin
  const [jobSearch, setJobSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');

  // User Management State
  const [userList, setUserList] = useState([
    { id: 'u-1', name: 'Alexandre Morgan', role: 'Job Seeker', email: 'alex.morgan@workpulse.io', status: 'Active', verified: true, dateJoined: 'Jan 2026' },
    { id: 'u-2', name: 'Sarah Jenkins', role: 'Recruiter (Stripe)', email: 'sjenkins@stripe.com', status: 'Active', verified: true, dateJoined: 'Feb 2026' },
    { id: 'u-3', name: 'David Kalu', role: 'Recruiter (Anthropic)', email: 'david.k@anthropic.com', status: 'Active', verified: true, dateJoined: 'Feb 2026' },
    { id: 'u-4', name: 'Elena Rostova', role: 'Super Admin (WorkPulse)', email: 'elena@workpulse.io', status: 'Active', verified: true, dateJoined: 'Dec 2025' },
    { id: 'u-5', name: 'Marcus Sterling', role: 'Job Seeker', email: 'marcus.s@devmail.org', status: 'Under Review', verified: false, dateJoined: 'Yesterday' },
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Job Seeker');

  // Selected Application Inspect Modal
  const [inspectApp, setInspectApp] = useState<Application | null>(null);

  // Filtered jobs
  const filteredJobs = jobs.filter((j) => {
    if (!jobSearch.trim()) return true;
    const q = jobSearch.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
  });

  // Filtered applications
  const filteredApps = applications.filter((a) => {
    if (!appSearch.trim()) return true;
    const q = appSearch.toLowerCase();
    return (
      a.jobTitle.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      (a.applicantName && a.applicantName.toLowerCase().includes(q))
    );
  });

  // Handle Create Job with Map Coordinates resolution
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Resolve lat/lon
    const preset = USER_PRESET_LOCATIONS.find((p) => p.name.includes(newLocation) || newLocation.includes(p.city));
    const latitude = preset ? preset.coords.latitude : 37.7749;
    const longitude = preset ? preset.coords.longitude : -122.4194;

    const createdJob: Job = {
      id: `job-${Date.now()}`,
      title: newTitle.trim(),
      company: newCompany,
      companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&h=120&fit=crop&q=80',
      location: newLocation,
      latitude,
      longitude,
      workplaceType: newWorkplace,
      jobType: newJobType,
      salaryMin: newSalaryMin,
      salaryMax: newSalaryMax,
      currency: 'USD',
      experienceLevel: newExperience,
      department: newDepartment,
      postedAt: 'Just now',
      description: newDescription || 'Exciting career opportunity joining our rapid growth engineering division.',
      requirements: newRequirements.split('\n').filter((r) => r.trim()),
      responsibilities: ['Architect robust software services', 'Collaborate across cross-functional teams'],
      benefits: ['Full health & dental', 'Flexible remote policy', '401k match'],
      matchScore: 92,
      applicantsCount: 0,
      status: 'active',
    };

    onAddJob(createdJob);
    setShowPostJobModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    onBroadcastNotification(broadcastTitle, broadcastMessage);
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 3500);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    setUserList([
      ...userList,
      {
        id: `u-${Date.now()}`,
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
        status: 'Active',
        verified: true,
        dateJoined: 'Today',
      },
    ]);

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  // Compile all announcements from all enterprises
  const allEnterpriseAnnouncements = enterprises.flatMap((e) =>
    e.announcements.map((a) => ({ ...a, enterpriseName: e.name, enterpriseLogo: e.logo }))
  );

  return (
    <div id="admin-portal-view" className="space-y-6">
      
      {/* Top Header & KPI Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Administrative Command Console
              </span>
              <span className="text-xs text-slate-400">• Full Authority Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Enterprise &amp; Recruitment Management System
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Complete operational control over job positions, multi-enterprise announcements, applicant evaluations, candidate user statuses, broadcast alerts, and AI matching engines.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="admin-post-job-btn"
              onClick={() => setShowPostJobModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Position</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Openings</span>
            <p className="text-2xl font-extrabold text-white mt-0.5">
              {jobs.filter((j) => j.status === 'active').length} <span className="text-xs font-normal text-slate-400">/ {jobs.length}</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Live Candidates</span>
            <p className="text-2xl font-extrabold text-white mt-0.5">
              {userList.length + 12}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Applications In Pipeline</span>
            <p className="text-2xl font-extrabold text-blue-400 mt-0.5">
              {applications.length}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">AI Screening Accuracy</span>
            <p className="text-2xl font-extrabold text-purple-400 mt-0.5">
              98.4%
            </p>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors">
        <button
          id="admin-tab-jobs"
          onClick={() => setAdminTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            adminTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Jobs ({jobs.length})</span>
        </button>

        <button
          id="admin-tab-applications"
          onClick={() => setAdminTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            adminTab === 'applications'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Applications ({applications.length})</span>
        </button>

        <button
          id="admin-tab-announcements"
          onClick={() => setAdminTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            adminTab === 'announcements'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Enterprise Announcements ({allEnterpriseAnnouncements.length})</span>
        </button>

        <button
          id="admin-tab-users"
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            adminTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users &amp; Roles ({userList.length})</span>
        </button>

        <button
          id="admin-tab-broadcast"
          onClick={() => setAdminTab('broadcast')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            adminTab === 'broadcast'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Broadcast Alerts</span>
        </button>

        <button
          id="admin-tab-ai-engine"
          onClick={() => setAdminTab('ai_engine')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            adminTab === 'ai_engine'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Screening Rules</span>
        </button>
      </div>

      {/* TAB 1: Job Management */}
      {adminTab === 'jobs' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Job Pipeline ({filteredJobs.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage status, view applicants, and pause or reactivate listings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Filter jobs or company..."
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-hidden"
              />
              <button
                onClick={() => setShowPostJobModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Post Job
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3">Title &amp; Company</th>
                  <th className="px-4 py-3">Location &amp; Coordinates</th>
                  <th className="px-4 py-3">Salary Range</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{job.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{job.company} • {job.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      <div>{job.location} ({job.workplaceType})</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {job.latitude?.toFixed(2)}°, {job.longitude?.toFixed(2)}°
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">{job.applicantsCount}</span> candidates
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        job.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onUpdateJobStatus(job.id, job.status === 'active' ? 'closed' : 'active')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          job.status === 'active'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {job.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Applications & Pipeline */}
      {adminTab === 'applications' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recruiter Candidate Pipeline ({filteredApps.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review candidate credentials, adjust stages, and advance candidates in real-time.
              </p>
            </div>

            <input
              type="text"
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
              placeholder="Search candidate, job, or status..."
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-hidden w-60"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3">Applicant Name</th>
                  <th className="px-4 py-3">Applied Position</th>
                  <th className="px-4 py-3">AI Fit Score</th>
                  <th className="px-4 py-3">Submitted Resume</th>
                  <th className="px-4 py-3">Pipeline Stage</th>
                  <th className="px-4 py-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{app.applicantName || 'Alexandre Morgan'}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{app.applicantEmail || 'alex.morgan@workpulse.io'}</p>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      <div>{app.jobTitle}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{app.company}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                        {app.matchScore}% Match
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-blue-600 dark:text-blue-400">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px] font-medium">{app.appliedWithResume}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={app.stage}
                        onChange={(e) => onUpdateApplicationStage(app.id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-800 dark:text-white capitalize cursor-pointer"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewing">In Review</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer Extended</option>
                        <option value="rejected">Declined</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setInspectApp(app)}
                        className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg font-bold text-xs"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Enterprise Announcements Management */}
      {adminTab === 'announcements' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Multi-Enterprise Announcements Board ({allEnterpriseAnnouncements.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit, moderate, pin, or delete enterprise broadcasts from the centralized dashboard.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {allEnterpriseAnnouncements.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No active announcements published across enterprises.
              </div>
            ) : (
              allEnterpriseAnnouncements.map((ann) => (
                <div key={ann.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={ann.enterpriseLogo}
                      alt={ann.enterpriseName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">
                          {ann.enterpriseName}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {ann.category}
                        </span>
                        {ann.pinned && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            📌 Pinned
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 max-w-2xl">
                        {ann.content}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span>Posted by {ann.authorName} ({ann.authorRole})</span>
                        <span>•</span>
                        <span>{ann.date}</span>
                        <span>•</span>
                        <span>{ann.likesCount || 0} candidate likes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {onDeleteAnnouncement && (
                      <button
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: User & Role Management */}
      {adminTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                User Access &amp; Role Management ({userList.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage candidate accounts, recruiter privileges, and account verifications.
              </p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Invite User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3">User Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Account Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {u.name}
                        {u.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {u.email}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {u.role}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">
                      {u.dateJoined}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          u.status === 'Active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Broadcast Alerts */}
      {adminTab === 'broadcast' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4 max-w-2xl transition-colors">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Real-Time Push Broadcast Console
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Send priority notifications directly into candidate notification centers and top navigation bars.
            </p>
          </div>

          {broadcastSent && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Broadcast dispatched successfully to active candidate websocket channels!
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Broadcast Title *
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Urgent: Global Tech Hiring Blitz Scheduled for Friday"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Broadcast Message Content *
              </label>
              <textarea
                required
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Details of the announcement, application deadlines, or system notices..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Live Broadcast
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: Automated Screening & Candidate Matching Governance */}
      {adminTab === 'ai_engine' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Applicant Matching Rules &amp; Automated Screening Governance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure parsing weights, candidate qualification minimums, and ATS evaluation metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Evaluation Model</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 block">Neural Matcher v2.4</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Real-time vector embeddings</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Resume Parsing Depth</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 block">99.1% Skill Accuracy</span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Optical &amp; Text Extraction</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Screening Governance</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">Active &amp; Guarded</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Equal Opportunity Compliance</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Post New Job */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Create New Position
              </h3>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Position Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lead Systems Engineer"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {USER_PRESET_LOCATIONS.map((loc) => (
                      <option key={loc.name} value={loc.city}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Workplace</label>
                  <select
                    value={newWorkplace}
                    onChange={(e) => setNewWorkplace(e.target.value as WorkplaceType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Experience</label>
                  <select
                    value={newExperience}
                    onChange={(e) => setNewExperience(e.target.value as ExperienceLevel)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Entry-level">Entry-level</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Min Salary ($)</label>
                  <input
                    type="number"
                    step="5000"
                    value={newSalaryMin}
                    onChange={(e) => setNewSalaryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Max Salary ($)</label>
                  <input
                    type="number"
                    step="5000"
                    value={newSalaryMax}
                    onChange={(e) => setNewSalaryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
                >
                  Publish Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Invite / Provision User Account
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">User Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. jordan.h@company.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">System Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Recruiter">Recruiter / Employer</option>
                  <option value="Enterprise Admin">Enterprise Admin</option>
                  <option value="Super Admin">Platform Super Admin</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inspect Application Dossier */}
      {inspectApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Candidate Evaluation Dossier
                </h3>
                <p className="text-xs text-slate-500">ID: {inspectApp.id}</p>
              </div>
              <button
                onClick={() => setInspectApp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {inspectApp.applicantName || 'Alexandre Morgan'}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Target: <strong className="text-slate-800 dark:text-slate-200">{inspectApp.jobTitle}</strong> at {inspectApp.company}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Applied with: <strong className="text-blue-600 dark:text-blue-400">{inspectApp.appliedWithResume}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                <span className="font-extrabold text-purple-800 dark:text-purple-300 block">
                  AI Fit Assessment: {inspectApp.matchScore}% Match
                </span>
                <p className="text-[11px] text-purple-700 dark:text-purple-400 mt-1">
                  High proficiency in React, TypeScript, scalable Node microservices, and system architecture. Recommended for technical phone screen.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Advance Funnel Stage
                </label>
                <select
                  value={inspectApp.stage}
                  onChange={(e) => {
                    onUpdateApplicationStage(inspectApp.id, e.target.value);
                    setInspectApp({ ...inspectApp, stage: e.target.value as any });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                >
                  <option value="applied">Applied / New Submission</option>
                  <option value="reviewing">Screening / In Review</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="offer">Offer Extended</option>
                  <option value="rejected">Declined</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setInspectApp(null)}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
