import React, { useState } from 'react';
import { Job, UserProfile } from '../types/job';
import { 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Send, 
  MapPin, 
  DollarSign, 
  Clock, 
  X, 
  Zap, 
  Building2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface OneClickApplyModalProps {
  job: Job | null;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Job, note?: string) => void;
  onOpenProfile: () => void;
}

export const OneClickApplyModal: React.FC<OneClickApplyModalProps> = ({
  job,
  userProfile,
  isOpen,
  onClose,
  onSubmit,
  onOpenProfile,
}) => {
  const [customNote, setCustomNote] = useState('');
  const [includePortfolio, setIncludePortfolio] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !job) return null;

  const handleApply = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmit(job, customNote);
      setTimeout(() => {
        setSubmitted(false);
        setCustomNote('');
        onClose();
      }, 1600);
    }, 700);
  };

  return (
    <div 
      id="one-click-apply-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div 
        id="one-click-apply-dialog"
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white relative">
          <button
            id="close-apply-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-white tracking-wide uppercase">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              1-Click Smart Apply
            </span>
            <span className="text-xs text-blue-100 font-medium">
              Verified Candidate
            </span>
          </div>

          <h3 className="text-lg font-bold leading-snug">
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-blue-100">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location} ({job.workplaceType})
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Application Successfully Submitted!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                Your profile, resume, and credentials were transmitted instantly to the {job.company} hiring team. Real-time alert added to your pipeline!
              </p>
            </div>
          ) : (
            <>
              {/* Profile Snapshot Banner */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {userProfile.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                        {userProfile.headline}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{userProfile.email}</span>
                        <span>•</span>
                        <span>{userProfile.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    id="edit-profile-from-apply-btn"
                    onClick={() => {
                      onClose();
                      onOpenProfile();
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Resume Attached */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {userProfile.resumeFileName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        ATS 94%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Standard Verified Resume • {userProfile.resumeLastUpdated}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Attached</span>
              </div>

              {/* Match Fit Meter */}
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Match Alignment
                  </span>
                  <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-sm">
                    {job.matchScore}% Strong Fit
                  </span>
                </div>
                <div className="w-full bg-indigo-200/60 dark:bg-indigo-900/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1.5">
                  Matches your skill proficiencies in React, TypeScript, APIs, and high-scale architecture.
                </p>
              </div>

              {/* Optional Note or Greeting */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note for Hiring Manager (Optional)
                </label>
                <textarea
                  id="apply-cover-note-input"
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Excited about this opportunity! I have 7+ years scaling web applications..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Checkbox option */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includePortfolio}
                    onChange={(e) => setIncludePortfolio(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 w-4 h-4 dark:bg-slate-800"
                  />
                  <span>Attach verified GitHub &amp; Portfolio links</span>
                </label>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Fast Track
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  id="cancel-apply-modal-btn"
                  onClick={onClose}
                  className="w-1/3 py-2.5 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-one-click-apply-btn"
                  disabled={isSubmitting}
                  onClick={handleApply}
                  className="w-2/3 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Confirm 1-Click Application</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
