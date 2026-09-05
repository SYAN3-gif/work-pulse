import React from 'react';
import { Job } from '../types/job';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Bookmark, 
  Zap, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  onSelectJob: (job: Job) => void;
  onOneClickApply: (job: Job) => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
  isApplied: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSelectJob,
  onOneClickApply,
  isBookmarked,
  onToggleBookmark,
  isApplied,
}) => {
  return (
    <div
      id={`job-card-${job.id}`}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Logo, Company, Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-100 dark:ring-slate-800 shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-tight">
                {job.company}
              </h4>
              <h3 
                onClick={() => onSelectJob(job)}
                className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer mt-0.5 leading-snug line-clamp-1"
              >
                {job.title}
              </h3>
            </div>
          </div>

          <button
            id={`bookmark-btn-${job.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(job.id);
            }}
            className={`p-2 rounded-xl transition ${
              isBookmarked
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
          </button>
        </div>

        {/* Tags Row: Location, Remote, Experience */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5 text-xs">
          <span className="inline-flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            {job.location}
          </span>
          <span className={`px-2.5 py-1 rounded-lg font-semibold ${
            job.workplaceType === 'Remote'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : job.workplaceType === 'Hybrid'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {job.workplaceType}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400">
            {job.jobType}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400">
            {job.experienceLevel}
          </span>
        </div>

        {/* Salary & Match Score */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 -mr-0.5" />
            <span>${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k</span>
            <span className="text-[11px] text-slate-400 font-normal">/yr</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>{job.matchScore}% Match</span>
          </div>
        </div>

        {/* Short excerpt */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Footer Actions: 1-Click Apply vs View Details */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{job.postedAt}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`view-details-btn-${job.id}`}
            onClick={() => onSelectJob(job)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            Details
          </button>

          {isApplied ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Applied</span>
            </div>
          ) : (
            <button
              id={`card-one-click-apply-${job.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOneClickApply(job);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition shadow-xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>1-Click Apply</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
