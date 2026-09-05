import React, { useState } from 'react';
import { Application, ApplicationStage } from '../types/job';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Plus, 
  LayoutGrid, 
  List, 
  ChevronRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface ApplicationTrackerProps {
  applications: Application[];
  onUpdateStage: (appId: string, newStage: ApplicationStage) => void;
  onSelectApplication: (app: Application) => void;
}

const STAGES: { key: ApplicationStage; label: string; color: string; badge: string }[] = [
  { key: 'applied', label: 'Submitted', color: 'border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30', badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300' },
  { key: 'screening', label: 'Under Review', color: 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30', badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300' },
  { key: 'interview', label: 'Interview Scheduled', color: 'border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30', badge: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300' },
  { key: 'offer', label: 'Offer Received', color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30', badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' },
  { key: 'rejected', label: 'Archived / Passed', color: 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onUpdateStage,
  onSelectApplication,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedAppModal, setSelectedAppModal] = useState<Application | null>(null);

  const getAppsForStage = (stage: ApplicationStage) => {
    return applications.filter((app) => app.stage === stage);
  };

  return (
    <div id="application-tracker-view" className="space-y-6">
      {/* Tracker Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Application Pipeline
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
              {applications.length} active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track real-time status across hiring stages, technical screens, interview dates, and offers.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              id="view-kanban-btn"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-list-btn"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {STAGES.filter((s) => s.key !== 'rejected').map((stage) => {
            const apps = getAppsForStage(stage.key);
            return (
              <div
                key={stage.key}
                id={`kanban-col-${stage.key}`}
                className="bg-slate-100/80 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[500px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      {stage.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center shadow-2xs">
                      {apps.length}
                    </span>
                  </div>
                </div>

                {/* Cards in column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {apps.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 p-4 text-center">
                      No positions currently in this stage
                    </div>
                  ) : (
                    apps.map((app) => (
                      <div
                        key={app.id}
                        id={`application-card-${app.id}`}
                        onClick={() => setSelectedAppModal(app)}
                        className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition cursor-pointer space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={app.companyLogo}
                              alt={app.company}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-100 dark:ring-slate-800"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                {app.company}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {app.location}
                              </p>
                            </div>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {app.matchScore}%
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                          {app.jobTitle}
                        </h4>

                        {/* Interview tag if present */}
                        {app.interviewDate && (
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="truncate">{app.interviewDate}</span>
                          </div>
                        )}

                        {/* Next step excerpt */}
                        {app.nextStep && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                            Next: {app.nextStep}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500">
                          <span>{app.appliedDate}</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            View details →
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Company &amp; Role</th>
                  <th className="px-4 py-3.5">Applied Date</th>
                  <th className="px-4 py-3.5">Current Stage</th>
                  <th className="px-4 py-3.5">Match</th>
                  <th className="px-4 py-3.5">Next Step</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedAppModal(app)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.companyLogo}
                          alt={app.company}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{app.jobTitle}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{app.company} • {app.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {app.appliedDate}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        STAGES.find((s) => s.key === app.stage)?.badge || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {STAGES.find((s) => s.key === app.stage)?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-blue-600 dark:text-blue-400">
                      {app.matchScore}%
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {app.nextStep || 'In review'}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppModal(app);
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Details & Stage Progression Modal */}
      {selectedAppModal && (
        <div 
          id="app-detail-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedAppModal.companyLogo}
                  alt={selectedAppModal.company}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedAppModal.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedAppModal.company} • {selectedAppModal.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Stage Selector */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Update Pipeline Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['applied', 'screening', 'interview', 'offer'] as ApplicationStage[]).map((stageKey) => (
                  <button
                    key={stageKey}
                    id={`update-stage-${stageKey}`}
                    onClick={() => {
                      onUpdateStage(selectedAppModal.id, stageKey);
                      setSelectedAppModal({ ...selectedAppModal, stage: stageKey });
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition ${
                      selectedAppModal.stage === stageKey
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {stageKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes & Interview Info */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Applied Resume:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">{selectedAppModal.appliedWithResume}</span>
              </div>
              {selectedAppModal.interviewDate && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Interview scheduled: {selectedAppModal.interviewDate}</span>
                </div>
              )}
              {selectedAppModal.notes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Recruiter / Activity Notes:</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedAppModal.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAppModal(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition"
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
