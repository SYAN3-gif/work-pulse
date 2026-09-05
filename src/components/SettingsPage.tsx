import React, { useState } from 'react';
import {
  Briefcase,
  Eye,
  EyeOff,
  Bell,
  ShieldCheck,
  Laptop,
  Smartphone,
  Lock,
  Globe,
  DollarSign,
  MapPin,
  Building,
  Trash2,
  Download,
  RefreshCw,
  Check,
  CheckCircle2,
  AlertTriangle,
  Moon,
  Sun,
  Sliders,
  Volume2,
  VolumeX,
  Plus,
  X,
  ArrowRight,
  Shield,
  KeyRound,
  FileText
} from 'lucide-react';
import { UserSettings, JobSearchStatus, UserProfile } from '../types/job';
import { ActiveSession, INITIAL_ACTIVE_SESSIONS } from '../data/mockSettings';
import { playNotificationSound } from '../utils/audio';

interface SettingsPageProps {
  settings: UserSettings;
  userProfile: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onUpdateUserProfile?: (updatedProfile: Partial<UserProfile>) => void;
  onResetSettingsToDefault: () => void;
  onNotify: (title: string, message: string) => void;
}

type SettingsSection = 'job_search' | 'privacy' | 'notifications' | 'account_security' | 'display' | 'data';

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  userProfile,
  darkMode,
  onToggleDarkMode,
  onUpdateSettings,
  onUpdateUserProfile,
  onResetSettingsToDefault,
  onNotify,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('job_search');
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_ACTIVE_SESSIONS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // New tag inputs
  const [newTitleInput, setNewTitleInput] = useState('');
  const [newLocationInput, setNewLocationInput] = useState('');

  // Password modal/state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 2FA modal/state
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Danger zone confirmation
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Update helper
  const updateSetting = <K extends keyof UserSettings>(
    category: K,
    updates: Partial<UserSettings[K]>
  ) => {
    setLocalSettings((prev) => {
      const next = {
        ...prev,
        [category]: {
          ...prev[category],
          ...updates,
        },
      };
      setHasUnsavedChanges(true);
      return next;
    });
  };

  // Save changes
  const handleSaveChanges = () => {
    onUpdateSettings(localSettings);
    setHasUnsavedChanges(false);

    // Sync specific profile fields
    if (onUpdateUserProfile) {
      onUpdateUserProfile({
        expectedSalaryMin: localSettings.jobSearch.minBaseSalary,
        expectedSalaryMax: localSettings.jobSearch.targetTotalComp,
        preferredJobTitles: localSettings.jobSearch.targetTitles,
        preferredLocations: localSettings.jobSearch.targetLocations,
        openToRemote: localSettings.jobSearch.workplacePreference !== 'onsite',
        workAuthorization: localSettings.jobSearch.requiresVisaSponsorship
          ? 'Requires Visa Sponsorship'
          : 'Authorized to work without sponsorship',
        noticePeriod: localSettings.jobSearch.noticePeriod,
      });
    }

    if (localSettings.notifications.soundEnabled) {
      playNotificationSound();
    }
    onNotify('Settings Saved', 'Your job search parameters and account preferences have been saved.');
  };

  // Discard changes
  const handleDiscardChanges = () => {
    setLocalSettings(settings);
    setHasUnsavedChanges(false);
    onNotify('Changes Discarded', 'Reverted back to your last saved preferences.');
  };

  // Add target title
  const handleAddTitle = () => {
    const trimmed = newTitleInput.trim();
    if (trimmed && !localSettings.jobSearch.targetTitles.includes(trimmed)) {
      updateSetting('jobSearch', {
        targetTitles: [...localSettings.jobSearch.targetTitles, trimmed],
      });
      setNewTitleInput('');
    }
  };

  // Remove target title
  const handleRemoveTitle = (title: string) => {
    updateSetting('jobSearch', {
      targetTitles: localSettings.jobSearch.targetTitles.filter((t) => t !== title),
    });
  };

  // Add target location
  const handleAddLocation = () => {
    const trimmed = newLocationInput.trim();
    if (trimmed && !localSettings.jobSearch.targetLocations.includes(trimmed)) {
      updateSetting('jobSearch', {
        targetLocations: [...localSettings.jobSearch.targetLocations, trimmed],
      });
      setNewLocationInput('');
    }
  };

  // Remove target location
  const handleRemoveLocation = (loc: string) => {
    updateSetting('jobSearch', {
      targetLocations: localSettings.jobSearch.targetLocations.filter((l) => l !== loc),
    });
  };

  // Toggle company size
  const handleToggleCompanySize = (size: string) => {
    const current = localSettings.jobSearch.companySizes;
    const next = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    updateSetting('jobSearch', { companySizes: next });
  };

  // Toggle industry
  const handleToggleIndustry = (ind: string) => {
    const current = localSettings.jobSearch.targetIndustries;
    const next = current.includes(ind)
      ? current.filter((i) => i !== ind)
      : [...current, ind];
    updateSetting('jobSearch', { targetIndustries: next });
  };

  // Terminate other sessions
  const handleRevokeOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    onNotify('Sessions Terminated', 'All other active devices and browser sessions were securely signed out.');
  };

  // Change password submission
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');

    updateSetting('account', {
      lastPasswordChange: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    });

    onNotify('Password Updated', 'Your account credentials have been securely updated.');
  };

  // Export User Data
  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      platform: 'WorkPulse Candidate Hub',
      userProfile,
      settings: localSettings,
      security: {
        activeSessionsCount: activeSessions.length,
        twoFactorStatus: localSettings.account.twoFactorEnabled ? 'Enabled' : 'Disabled',
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workpulse-candidate-profile-${userProfile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onNotify('Data Export Ready', 'Your full candidate dossier and application history have been downloaded.');
  };

  const navItems = [
    { id: 'job_search', label: 'Job Search & Targets', icon: Briefcase, description: 'Role targets, salary, locations, availability' },
    { id: 'privacy', label: 'Privacy & Visibility', icon: Eye, description: 'Recruiter reach, employer blocking, badges' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell, description: 'Frequency, email, push, sound, score triggers' },
    { id: 'account_security', label: 'Account & Security', icon: ShieldCheck, description: 'Credentials, 2FA, connected devices & sessions' },
    { id: 'display', label: 'Display & Units', icon: Sliders, description: 'Appearance theme, distance units, card density' },
    { id: 'data', label: 'Data & Privacy Rights', icon: FileText, description: 'Export dossier, clear cache, factory defaults' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Candidate Control Center
              </span>
              {hasUnsavedChanges && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Settings &amp; Job Search Preferences
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Tailor your career intent, recruiter discovery filters, privacy fences, and notification channels to streamline your employment pipeline.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition shadow-2xs"
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveChanges}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
                hasUnsavedChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Navigation Tabs + Active Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-2">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`settings-tab-${item.id}`}
                  onClick={() => setActiveSection(item.id as SettingsSection)}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl transition flex items-start gap-3 group ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{item.label}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Profile Summary Card */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/30"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {userProfile.name}
                  </h4>
                  {localSettings.privacy.showOpenToWorkBadge && (
                    <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-300 dark:border-emerald-800">
                      Open to Work
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {userProfile.email}
                </p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5 truncate">
                  {localSettings.jobSearch.status === 'actively_looking'
                    ? '🟢 Actively Looking'
                    : localSettings.jobSearch.status === 'open_to_offers'
                    ? '🟡 Open to Offers'
                    : '⚪ Closed to Offers'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* 1. Job Search & Targets */}
          {activeSection === 'job_search' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Job Search Intent &amp; Availability</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Specify your current career status and the exact roles you want algorithmically prioritized.
                </p>
              </div>

              {/* Status Radio Tiles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Current Search Availability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'actively_looking',
                      title: 'Actively Looking & Interviewing',
                      desc: 'Maximum priority in recruiter search; receives daily high-match notifications.',
                      indicator: 'bg-emerald-500',
                    },
                    {
                      id: 'open_to_offers',
                      title: 'Open to Opportunities',
                      desc: 'Casually exploring options without active urgency.',
                      indicator: 'bg-amber-500',
                    },
                    {
                      id: 'casually_browsing',
                      title: 'Market Observer',
                      desc: 'Checking salary trends and bookmarking prospective companies.',
                      indicator: 'bg-blue-500',
                    },
                    {
                      id: 'not_looking',
                      title: 'Closed to Offers',
                      desc: 'Hidden from recruiter searches and cold outreach.',
                      indicator: 'bg-slate-400',
                    },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() =>
                        updateSetting('jobSearch', {
                          status: st.id as JobSearchStatus,
                        })
                      }
                      className={`p-3.5 rounded-2xl border text-left transition relative ${
                        localSettings.jobSearch.status === st.id
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${st.indicator}`} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {st.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-4.5">
                        {st.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Job Titles */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Job Titles ({localSettings.jobSearch.targetTitles.length})
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Match score algorithms prioritize jobs having these keywords in their title.
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {localSettings.jobSearch.targetTitles.map((title) => (
                    <span
                      key={title}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-100/70 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs"
                    >
                      {title}
                      <button
                        type="button"
                        onClick={() => handleRemoveTitle(title)}
                        className="hover:text-blue-900 dark:hover:text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTitleInput}
                    onChange={(e) => setNewTitleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTitle();
                      }
                    }}
                    placeholder="e.g. Lead Distributed Systems Engineer"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddTitle}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Target Compensation Range */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Expected Compensation
                  </label>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {localSettings.jobSearch.currency}
                    {localSettings.jobSearch.minBaseSalary.toLocaleString()} - {localSettings.jobSearch.currency}
                    {localSettings.jobSearch.targetTotalComp.toLocaleString()} / {localSettings.jobSearch.compensationFrequency}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Minimum Base Salary
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                        {localSettings.jobSearch.currency}
                      </span>
                      <input
                        type="number"
                        step={5000}
                        value={localSettings.jobSearch.minBaseSalary}
                        onChange={(e) =>
                          updateSetting('jobSearch', {
                            minBaseSalary: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-7 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Target Total Compensation
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                        {localSettings.jobSearch.currency}
                      </span>
                      <input
                        type="number"
                        step={5000}
                        value={localSettings.jobSearch.targetTotalComp}
                        onChange={(e) =>
                          updateSetting('jobSearch', {
                            targetTotalComp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-7 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Currency
                    </span>
                    <select
                      value={localSettings.jobSearch.currency}
                      onChange={(e) =>
                        updateSetting('jobSearch', { currency: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="$">USD ($)</option>
                      <option value="€">EUR (€)</option>
                      <option value="£">GBP (£)</option>
                      <option value="CA$">CAD (CA$)</option>
                      <option value="A$">AUD (A$)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Workplace Preference & Locations */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Workplace Arrangement
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'remote_only', label: 'Remote Only' },
                      { id: 'hybrid', label: 'Hybrid' },
                      { id: 'onsite', label: 'On-Site' },
                      { id: 'open_to_any', label: 'Open to Any' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() =>
                          updateSetting('jobSearch', {
                            workplacePreference: w.id as any,
                          })
                        }
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                          localSettings.jobSearch.workplacePreference === w.id
                            ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Preferred Hub Locations
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2.5">
                    {localSettings.jobSearch.targetLocations.map((loc) => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                      >
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        {loc}
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(loc)}
                          className="hover:text-red-500 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLocationInput}
                      onChange={(e) => setNewLocationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLocation();
                        }
                      }}
                      placeholder="Add city (e.g. Boston, MA)"
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddLocation}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold"
                    >
                      Add City
                    </button>
                  </div>
                </div>
              </div>

              {/* Work Authorization & Notice Period */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Visa Sponsorship Required
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Do you need employer visa sponsorship (e.g. H-1B)?
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.jobSearch.requiresVisaSponsorship}
                    onChange={(e) =>
                      updateSetting('jobSearch', {
                        requiresVisaSponsorship: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    Notice Period Availability
                  </span>
                  <select
                    value={localSettings.jobSearch.noticePeriod}
                    onChange={(e) =>
                      updateSetting('jobSearch', { noticePeriod: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                  >
                    <option value="Immediately (Available now)">Immediately (Available now)</option>
                    <option value="2 Weeks">2 Weeks Notice</option>
                    <option value="1 Month">1 Month Notice</option>
                    <option value="2-3 Months">2-3 Months Notice</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Privacy & Recruiter Visibility */}
          {activeSection === 'privacy' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Privacy Fences &amp; Recruiter Visibility</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Control who can see your job hunt, hide yourself from current colleagues, and manage recruiter permissions.
                </p>
              </div>

              {/* Recruiter Visibility Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Recruiter Reach Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'public_all',
                      title: 'All Verified Recruiters',
                      desc: 'Vetted employers on WorkPulse can discover and reach out directly.',
                    },
                    {
                      id: 'applied_only',
                      title: 'Only Companies I Apply To',
                      desc: 'Hidden from passive recruiter search; only visible after submitting an application.',
                    },
                    {
                      id: 'private',
                      title: 'Incognito Mode',
                      desc: 'Completely private. Only direct link shares can view your profile.',
                    },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() =>
                        updateSetting('privacy', {
                          recruiterVisibility: lvl.id as any,
                        })
                      }
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        localSettings.privacy.recruiterVisibility === lvl.id
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-900/30'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {lvl.title}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {lvl.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Employer Blocking Shield */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Block My Current Employer
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Guarantees that recruiters, HR managers, and corporate accounts affiliated with your current company cannot see your profile or know that you are searching.
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={localSettings.privacy.hideFromCurrentEmployer}
                    onChange={(e) =>
                      updateSetting('privacy', {
                        hideFromCurrentEmployer: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                </div>

                {localSettings.privacy.hideFromCurrentEmployer && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current Company Name:
                    </label>
                    <input
                      type="text"
                      value={localSettings.privacy.currentEmployerName}
                      onChange={(e) =>
                        updateSetting('privacy', {
                          currentEmployerName: e.target.value,
                        })
                      }
                      placeholder="e.g. Veloce Cloud Systems"
                      className="w-full sm:w-80 px-3.5 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Feature Toggles */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    key: 'showOpenToWorkBadge',
                    title: 'Display #OpenToWork Badge on Avatar',
                    desc: 'Shows a green indicator on your candidate card so recruiters know you are actively fielding chats.',
                  },
                  {
                    key: 'autoShareResumeWithOneClick',
                    title: '1-Click Apply: Automatic CV Dossier Sharing',
                    desc: 'When using 1-Click Apply, instantly attaches your standardized PDF CV without an extra review prompt.',
                  },
                  {
                    key: 'anonymousBrowsing',
                    title: 'Anonymized Company & Job Browsing',
                    desc: 'View job postings and enterprise hubs without letting their talent acquisition analytics track your user ID.',
                  },
                  {
                    key: 'readReceiptsEnabled',
                    title: 'Read Receipts in Recruiter Messaging',
                    desc: 'Let recruiters know when you have seen their incoming direct messages.',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={(localSettings.privacy as any)[item.key]}
                      onChange={(e) =>
                        updateSetting('privacy', {
                          [item.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 shrink-0 ml-3"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Notifications & Alerts */}
          {activeSection === 'notifications' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Job Alerts &amp; Notification Channels</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose how and when WorkPulse alerts you about high-match jobs, interview updates, and announcements.
                </p>
              </div>

              {/* Alert Frequency */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Job Match Alert Delivery Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'instant', label: '⚡ Real-Time Instant' },
                    { id: 'daily_digest', label: '📅 Daily Digest (9 AM)' },
                    { id: 'weekly', label: '🗓️ Weekly Summary' },
                    { id: 'off', label: '🔕 Muted' },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() =>
                        updateSetting('notifications', {
                          alertFrequency: freq.id as any,
                        })
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                        localSettings.notifications.alertFrequency === freq.id
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Match Score Threshold Slider */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Minimum Match Score for Instant Alerts
                  </span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-2xs">
                    {localSettings.notifications.matchScoreThreshold}% &amp; above
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={95}
                  step={5}
                  value={localSettings.notifications.matchScoreThreshold}
                  onChange={(e) =>
                    updateSetting('notifications', {
                      matchScoreThreshold: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>60% (More Jobs)</span>
                  <span>80% (Recommended)</span>
                  <span>95% (Exact Matches Only)</span>
                </div>
              </div>

              {/* Channels Grid */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Notification Channels &amp; Topics
                </label>

                {[
                  {
                    key: 'emailNewMatches',
                    title: 'Email: Newly Posted Matching Jobs',
                    desc: 'Delivers newly curated jobs matching your title and salary parameters.',
                  },
                  {
                    key: 'emailRecruiterMessages',
                    title: 'Email: Direct Recruiter Messages',
                    desc: 'Sends an email notification whenever a recruiter sends a direct chat message.',
                  },
                  {
                    key: 'emailApplicationUpdates',
                    title: 'Email: Application Stage Progression',
                    desc: 'Instant updates when an application moves from Screening to Interview or Offer.',
                  },
                  {
                    key: 'emailAnnouncements',
                    title: 'Email: Followed Enterprise Announcements',
                    desc: 'Hiring sprint alerts and milestone posts from companies you follow.',
                  },
                  {
                    key: 'pushEnabled',
                    title: 'Browser Push Notifications',
                    desc: 'Live desktop notifications while you have WorkPulse open or in background tabs.',
                  },
                  {
                    key: 'soundEnabled',
                    title: 'Sound Chimes & Alerts',
                    desc: 'Play a subtle pleasant audio tone when receiving new messages or push alerts.',
                    extraAction: (
                      <button
                        type="button"
                        onClick={() => playNotificationSound()}
                        className="px-2 py-1 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-1"
                        title="Test sound chime"
                      >
                        <Volume2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>Test Sound</span>
                      </button>
                    ),
                  },
                  {
                    key: 'smsInterviewAlerts',
                    title: 'SMS Text Message Reminders for Interviews',
                    desc: 'Sends an SMS reminder 2 hours before any scheduled recruiter screening call.',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        {item.extraAction}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={(localSettings.notifications as any)[item.key]}
                      onChange={(e) =>
                        updateSetting('notifications', {
                          [item.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 shrink-0 ml-3"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Account & Security */}
          {activeSection === 'account_security' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Account Credentials &amp; Security</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage primary login credentials, two-factor authentication, and connected device sessions.
                </p>
              </div>

              {/* Login Info Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                    Primary Login Email
                  </span>
                  <input
                    type="email"
                    value={localSettings.account.loginEmail}
                    onChange={(e) =>
                      updateSetting('account', { loginEmail: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                    SMS Contact &amp; 2FA Phone
                  </span>
                  <input
                    type="tel"
                    value={localSettings.account.phoneNumber}
                    onChange={(e) =>
                      updateSetting('account', { phoneNumber: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Password & 2FA Row */}
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Account Password</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Last modified on {localSettings.account.lastPasswordChange} • Strong 256-bit encryption.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-slate-200 transition shadow-2xs"
                >
                  Change Password
                </button>
              </div>

              {/* Two-Factor Authentication Toggle */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Two-Factor Authentication (2FA)
                      {localSettings.account.twoFactorEnabled ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                          Disabled
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Protect your career dossier and salary communications with Google Authenticator or SMS verification.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={localSettings.account.twoFactorEnabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    updateSetting('account', { twoFactorEnabled: enabled });
                    if (enabled) {
                      onNotify('2FA Enabled', 'Two-factor protection is now active for this account.');
                    } else {
                      onNotify('2FA Disabled', 'Two-factor authentication has been turned off.');
                    }
                  }}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              {/* Active Sessions List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Active Device Sessions ({activeSessions.length})
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Devices currently authorized to access your candidate account.
                    </p>
                  </div>

                  {activeSessions.length > 1 && (
                    <button
                      type="button"
                      onClick={handleRevokeOtherSessions}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition"
                    >
                      Sign Out Other Devices
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {session.type === 'mobile' ? (
                            <Smartphone className="w-4 h-4" />
                          ) : (
                            <Laptop className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {session.device}
                            </span>
                            {session.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                This Browser
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {session.browser} • {session.location} • {session.lastActive}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Display & Units */}
          {activeSection === 'display' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Display &amp; Accessibility Preferences</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Customize the interface theme, distance metrics, and card layout density.
                </p>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Color Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (darkMode) onToggleDarkMode();
                      updateSetting('appearance', { theme: 'light' });
                    }}
                    className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                      !darkMode
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Crisp Light Theme
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Default high-contrast light mode with slate accents.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!darkMode) onToggleDarkMode();
                      updateSetting('appearance', { theme: 'dark' });
                    }}
                    className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                      darkMode
                        ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Midnight Dark Theme
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Deep dark navy background optimized for night work.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Distance Units for Map & Commute */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Commute &amp; Distance Calculation Unit
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'miles', label: 'Miles (mi)', desc: 'Standard in US and UK' },
                    { id: 'km', label: 'Kilometers (km)', desc: 'Standard in EU, Canada, and Global' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() =>
                        updateSetting('appearance', {
                          distanceUnit: u.id as any,
                        })
                      }
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        localSettings.appearance.distanceUnit === u.id
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {u.label}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {u.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Density */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Job Cards Layout Density
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'comfortable', label: 'Comfortable', desc: 'Spacious cards with full perk badges and description snippets' },
                    { id: 'compact', label: 'Compact', desc: 'Dense tabular view showing more opportunities per screen' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        updateSetting('appearance', {
                          jobCardDensity: d.id as any,
                        })
                      }
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        localSettings.appearance.jobCardDensity === d.id
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {d.label}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {d.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. Data & Privacy Rights */}
          {activeSection === 'data' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Data Portability &amp; Privacy Rights</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Export your candidate history, reset workspace preferences, or manage GDPR/CCPA data requests.
                </p>
              </div>

              {/* Export Data */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Download Full Candidate Dossier (JSON)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Exports your complete profile, tailored resumes, application history, and preferences into a portable file.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Data</span>
                </button>
              </div>

              {/* Clear Search & Filter Cache */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span>Clear Search Cache &amp; Saved Keyword History</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Clears previously typed search phrases and temporary filter tags from your local storage session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onNotify('Search Cache Cleared', 'Your keyword history and temporary filters were cleared.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-2xs shrink-0"
                >
                  Clear Cache
                </button>
              </div>

              {/* Reset to Default Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Reset Settings to Default
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Restores standard job search availability, alert frequencies, and privacy values.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetSettingsToDefault();
                    onNotify('Settings Reset', 'All parameters restored to original defaults.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 text-xs font-bold transition shrink-0"
                >
                  Restore Defaults
                </button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-red-100 dark:border-red-950/40">
                <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Deactivate Candidate Account</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Temporarily pause your job hunt or permanently purge your applications and dossier.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeactivateModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-2xs shrink-0"
                  >
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Change Password
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              {passwordError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Deactivate Candidate Account?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This will suspend active job applications and withdraw from candidate searches.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              You can reactivate at any time by logging back into WorkPulse. If you wish to permanently purge all data under GDPR, contact <span className="font-bold">privacy@workpulse.io</span>.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeactivateModal(false);
                  updateSetting('jobSearch', { status: 'not_looking' });
                  updateSetting('privacy', { recruiterVisibility: 'private' });
                  onNotify('Account Paused', 'Your profile is now in private mode and not visible to employers.');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
