import React from 'react';
import { Application, Job, UserProfile } from '../types/job';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  FileText, 
  Clock, 
  Eye, 
  Zap, 
  Building2, 
  ChevronRight,
  ShieldCheck,
  Settings
} from 'lucide-react';

interface PersonalDashboardProps {
  userProfile: UserProfile;
  applications: Application[];
  jobs: Job[];
  onNavigateTab: (tab: string) => void;
  onSelectJob: (job: Job) => void;
  onOneClickApply: (job: Job) => void;
  onOpenAISuite: () => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  userProfile,
  applications,
  jobs,
  onNavigateTab,
  onSelectJob,
  onOneClickApply,
  onOpenAISuite,
}) => {
  const interviewsCount = applications.filter((a) => a.stage === 'interview').length;
  const offersCount = applications.filter((a) => a.stage === 'offer').length;
  const upcomingInterview = applications.find((a) => a.interviewDate);

  // Top recommended jobs by match score
  const recommendedJobs = jobs
    .filter((j) => !applications.some((a) => a.jobId === j.id))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return (
    <div id="personal-dashboard-view" className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 dark:from-blue-900 dark:via-indigo-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-blue-600/30">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-blue-100 uppercase tracking-wider">
              Candidate Command Center
            </span>
            <span className="text-xs text-blue-200">
              Profile Strength: 96%
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userProfile.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-blue-100 mt-2 leading-relaxed">
            You have <span className="font-bold text-white">{interviewsCount} upcoming interview</span> and <span className="font-bold text-white">{offersCount} active offer</span>. Your verified profile was reviewed by 12 hiring teams this week.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              id="dashboard-explore-jobs-btn"
              onClick={() => onNavigateTab('jobs')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-800 font-bold text-xs hover:bg-blue-50 transition shadow-sm flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Explore New Openings</span>
            </button>
            <button
              id="dashboard-ai-suite-btn"
              onClick={onOpenAISuite}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Fit &amp; ATS Resume Scanner</span>
            </button>
            <button
              id="dashboard-settings-btn"
              onClick={() => onNavigateTab('settings')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-blue-200" />
              <span>Job Search Preferences</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Applications
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{applications.length}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2 this week
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Submitted via 1-Click Apply</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Interviews
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700 dark:text-purple-400">{interviewsCount}</span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Scheduled</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Anthropic Labs Onsite</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Job Offers
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{offersCount}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Pending Review</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Figma Senior Backend ($195k)</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Profile Views
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">128</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Recruiter impressions</p>
        </div>
      </div>

      {/* Main Row: Upcoming Interview & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Upcoming Interview & Application Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Interview Card */}
          {upcomingInterview && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-purple-800/80 p-5 shadow-xs relative overflow-hidden transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Upcoming Technical Interview
                </span>
                <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
                  {upcomingInterview.interviewDate}
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <img
                  src={upcomingInterview.companyLogo}
                  alt={upcomingInterview.company}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-purple-100 dark:ring-purple-900"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {upcomingInterview.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {upcomingInterview.company} • {upcomingInterview.location}
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-xl border border-purple-200/60 dark:border-purple-800/60 leading-relaxed">
                    <span className="font-bold">Next Round:</span> {upcomingInterview.nextStep}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  id="dashboard-view-tracker-btn"
                  onClick={() => onNavigateTab('applications')}
                  className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline"
                >
                  View in Pipeline Tracker →
                </button>
                <button
                  id="join-interview-sim-btn"
                  onClick={() => alert(`Interview room active: Anthropic Virtual Onsite (Meeting ID: 832-901)`)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Join Video Room
                </button>
              </div>
            </div>
          )}

          {/* Application Progress Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Recruitment Activity
              </h3>
              <button
                id="timeline-view-all-btn"
                onClick={() => onNavigateTab('applications')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all ({applications.length})
              </button>
            </div>

            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    <img
                      src={app.companyLogo}
                      alt={app.company}
                      className="w-5 h-5 rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {app.jobTitle}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                        {app.appliedDate}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {app.company} • Stage: <span className="font-bold capitalize text-slate-700 dark:text-slate-300">{app.stage}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: AI Recommended Positions for You */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Recommended Matches
                </h3>
              </div>
              <button
                id="view-all-matches-btn"
                onClick={() => onNavigateTab('jobs')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Browse All
              </button>
            </div>

            <div className="space-y-3">
              {recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  id={`dashboard-recommended-job-${job.id}`}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 transition bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <h4 
                          onClick={() => onSelectJob(job)}
                          className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-1"
                        >
                          {job.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {job.company} • {job.location} ({job.workplaceType})
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                      {job.matchScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                    <button
                      id={`rec-1click-btn-${job.id}`}
                      onClick={() => onOneClickApply(job)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 transition flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 fill-blue-600" />
                      <span>1-Click Apply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Strength Quick Card */}
          <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Profile Completion
              </span>
              <span className="text-xs font-extrabold text-white">96%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '96%' }} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Add your recent cloud certification to unlock 100% verified status and gain 2.4x more recruiter inquiries.
            </p>
            <button
              id="dashboard-goto-profile-btn"
              onClick={() => onNavigateTab('profile')}
              className="mt-3 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Edit Professional Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
