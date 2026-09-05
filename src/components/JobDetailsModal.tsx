import React from 'react';
import { Job } from '../types/job';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  Bookmark, 
  Share2, 
  Zap, 
  X, 
  Users, 
  Briefcase, 
  Gift
} from 'lucide-react';

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onOneClickApply: (job: Job) => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
  onOpenAISuiteWithJob?: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  onOneClickApply,
  isBookmarked,
  onToggleBookmark,
  onOpenAISuiteWithJob,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div 
      id="job-details-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div 
        id="job-details-dialog"
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 relative bg-slate-50/70 dark:bg-slate-800/50">
          <button
            id="close-job-details-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-10">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-xs"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {job.company}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {job.department}
                </span>
                {job.featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    Featured
                  </span>
                )}
                {job.urgent && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                    Urgent Hiring
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {job.title}
              </h2>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location} ({job.workplaceType})
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {job.jobType} • {job.experienceLevel}
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} / year
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-4 h-4" />
                  Posted {job.postedAt}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Users className="w-4 h-4" />
                  {job.applicantsCount} applicants
                </span>
              </div>
            </div>
          </div>

          {/* AI Fit Callout Banner */}
          <div className="mt-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                {job.matchScore}%
              </div>
              <div>
                <p className="text-xs font-bold text-purple-900 dark:text-purple-200">
                  High Match for your Profile
                </p>
                <p className="text-[11px] text-purple-700 dark:text-purple-300">
                  Based on your skills, experience history, and commute preferences.
                </p>
              </div>
            </div>
            {onOpenAISuiteWithJob && (
              <button
                id="deep-ai-match-btn"
                onClick={() => onOpenAISuiteWithJob(job)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-slate-700 transition shadow-2xs flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Fit Analysis
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Job Details Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* About the role */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Role Overview
            </h3>
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Requirements &amp; Qualifications
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Benefits &amp; Perks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <Gift className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with One-Click Apply Action Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              id={`bookmark-details-btn-${job.id}`}
              onClick={() => onToggleBookmark(job.id)}
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
                isBookmarked 
                  ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save Job'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="details-cancel-btn"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Close
            </button>
            <button
              id={`details-1click-apply-btn-${job.id}`}
              onClick={() => {
                onClose();
                onOneClickApply(job);
              }}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>1-Click Apply Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
