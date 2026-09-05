import React, { useState } from 'react';
import { OPERATIONAL_PHASES } from '../data/mockData';
import { Role } from '../types/job';
import { ChevronUp, ChevronDown, CheckCircle, ArrowRight, Compass, X } from 'lucide-react';

interface PhaseNavigatorProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeRole: Role;
  onOpenAuthModal: () => void;
  onOpenAISuite: () => void;
}

export const PhaseNavigator: React.FC<PhaseNavigatorProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  onOpenAuthModal,
  onOpenAISuite,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePhaseClick = (tab: string, _phaseNum: number) => {
    if (tab === 'auth') {
      onOpenAuthModal();
    } else if (tab === 'ai_suite') {
      onOpenAISuite();
    } else if (tab === 'admin' && activeRole === 'job_seeker') {
      onSelectTab('settings');
    } else {
      onSelectTab(tab);
    }
  };

  const getActivePhaseNum = () => {
    switch (currentTab) {
      case 'profile': return 2;
      case 'dashboard': return 3;
      case 'jobs': return 4;
      case 'map': return 5;
      case 'applications': return 6;
      case 'messages': return 7;
      case 'notifications': return 8;
      case 'admin': return 9;
      case 'settings': return 9;
      case 'ai_suite': return 10;
      default: return 4;
    }
  };

  const activePhase = getActivePhaseNum();

  return (
    <>
      {/* Floating Bottom Navigator Badge */}
      <div 
        id="phase-navigator-container" 
        className="fixed bottom-4 right-4 z-40 select-none print:hidden"
      >
        <button
          id="toggle-phase-breakdown-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/90 dark:bg-slate-800/95 text-slate-100 text-xs font-semibold shadow-lg shadow-slate-900/20 backdrop-blur-md border border-slate-700/80 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Explore Platform Architecture (10 Modules)"
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
            {activePhase}
          </div>
          <span className="font-medium">
            Guide: <span className="font-bold text-white">{OPERATIONAL_PHASES[activePhase - 1]?.title.split(' ')[0]}</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-[11px] text-slate-400">10 Phases</span>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Detailed Modal/Drawer */}
        {isOpen && (
          <div 
            id="phase-navigator-drawer"
            className="absolute bottom-12 right-0 w-[340px] sm:w-[460px] max-h-[75vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Platform Operational Phases
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Quick-switch to any of the 10 platform systems
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
              {OPERATIONAL_PHASES.map((phase) => {
                const isActive = phase.number === activePhase;
                return (
                  <div
                    key={phase.number}
                    id={`phase-card-${phase.number}`}
                    onClick={() => {
                      handlePhaseClick(phase.targetTab, phase.number);
                      setIsOpen(false);
                    }}
                    className={`pt-2 first:pt-0 p-2.5 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {phase.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-xs font-bold ${
                            isActive 
                              ? 'text-blue-900 dark:text-blue-300' 
                              : 'text-slate-900 dark:text-slate-200'
                          }`}>
                            {phase.title}
                          </h4>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {phase.subtitle}
                        </p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {activeRole === 'job_seeker' ? phase.seekerFocus : phase.adminFocus}
                        </p>
                      </div>
                    </div>
                    {isActive ? (
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
