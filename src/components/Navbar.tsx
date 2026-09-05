import React, { useState } from 'react';
import { Role, NotificationItem, UserProfile } from '../types/job';
import { APP_LOGO_URL } from '../data/mockData';
import { 
  Bell, 
  Briefcase, 
  LayoutDashboard, 
  Send, 
  MessageSquare, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Radio, 
  CheckCheck,
  ChevronDown,
  MapPin,
  Building2,
  Sun,
  Moon,
  Compass,
  FileBadge,
  Megaphone,
  Settings
} from 'lucide-react';

interface NavbarProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onMarkAllNotificationsRead: () => void;
  onSimulateNotification: () => void;
  applicationsCount: number;
  unreadMessagesCount: number;
  userProfile: UserProfile;
  onOpenAuthModal: () => void;
  onOpenAISuite: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  activeTab,
  onTabChange,
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead,
  onSimulateNotification,
  applicationsCount,
  unreadMessagesCount,
  userProfile,
  onOpenAuthModal,
  onOpenAISuite,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              id="app-brand-logo-btn"
              onClick={() => onTabChange(activeRole === 'job_seeker' ? 'jobs' : 'admin')}
              className="flex items-center gap-3 group focus:outline-hidden"
            >
              <img
                src={APP_LOGO_URL}
                alt="WorkPulse Logo"
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight leading-none font-['Outfit']">
                  Work<span className="text-blue-600 dark:text-blue-400">Pulse</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
                  Job Platform
                </span>
              </div>
            </button>

            {/* Role Switcher Pill */}
            <div className="hidden xl:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                id="role-switch-seeker"
                onClick={() => {
                  onRoleChange('job_seeker');
                  if (activeTab === 'admin' || activeTab === 'enterprise_panel') onTabChange('jobs');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeRole === 'job_seeker'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Job Seeker
              </button>
              <button
                id="role-switch-enterprise"
                onClick={() => {
                  onRoleChange('enterprise');
                  onTabChange('enterprise_panel');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  activeRole === 'enterprise'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Enterprise Panel</span>
              </button>
              <button
                id="role-switch-admin"
                onClick={() => {
                  onRoleChange('admin');
                  onTabChange('admin');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  activeRole === 'admin'
                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Admin Panel
              </button>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {activeRole === 'job_seeker' ? (
              <>
                <button
                  id="nav-tab-jobs"
                  onClick={() => onTabChange('jobs')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'jobs'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Jobs</span>
                </button>

                {/* Map View Link */}
                <button
                  id="nav-tab-map"
                  onClick={() => onTabChange('map')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'map'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Job Map</span>
                </button>

                {/* Enterprises Directory Link */}
                <button
                  id="nav-tab-enterprises"
                  onClick={() => onTabChange('enterprises')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'enterprises'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Enterprises</span>
                </button>

                {/* Enterprise Panel Access */}
                <button
                  id="nav-tab-enterprise-panel-link"
                  onClick={() => {
                    onRoleChange('enterprise');
                    onTabChange('enterprise_panel');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'enterprise_panel'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  title="Open Enterprise Announcement Management Panel"
                >
                  <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Enterprise Panel</span>
                </button>

                <button
                  id="nav-tab-applications"
                  onClick={() => onTabChange('applications')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'applications'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Applied</span>
                  {applicationsCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {applicationsCount}
                    </span>
                  )}
                </button>

                {/* Profile Setup / CV Link */}
                <button
                  id="nav-tab-profile"
                  onClick={() => onTabChange('profile')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileBadge className="w-4 h-4" />
                  <span>CV Profile</span>
                </button>

                <button
                  id="nav-tab-dashboard"
                  onClick={() => onTabChange('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  id="nav-tab-messages"
                  onClick={() => onTabChange('messages')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'messages'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Messages</span>
                  {unreadMessagesCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </button>

                <button
                  id="nav-tab-ai-suite"
                  onClick={onOpenAISuite}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>AI Tools</span>
                </button>
              </>
            ) : activeRole === 'enterprise' ? (
              <>
                <button
                  id="nav-tab-enterprise-panel"
                  onClick={() => onTabChange('enterprise_panel')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'enterprise_panel'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Announcements Studio</span>
                </button>
                <button
                  id="nav-tab-enterprise-directory"
                  onClick={() => onTabChange('enterprises')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'enterprises'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Directory &amp; Hub</span>
                </button>
                <button
                  id="nav-tab-enterprise-candidates"
                  onClick={() => onTabChange('jobs')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'jobs'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Candidate Search</span>
                </button>
                <button
                  id="nav-tab-enterprise-map"
                  onClick={() => onTabChange('map')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'map'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Job Map</span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-tab-admin-overview"
                  onClick={() => onTabChange('admin')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'admin'
                      ? 'bg-slate-900 dark:bg-blue-600 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Control Center</span>
                </button>
                <button
                  id="nav-tab-admin-jobs"
                  onClick={() => onTabChange('jobs')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Candidate View</span>
                </button>
                <button
                  id="nav-tab-admin-enterprises"
                  onClick={() => onTabChange('enterprises')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Enterprise Pages</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Dark Mode, Simulation, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Dark Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Live Notification Trigger for Showcase */}
            <button
              id="simulate-realtime-notif-btn"
              onClick={onSimulateNotification}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-2xs"
              title="Simulates an incoming real-time interview invitation or application update"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>Simulate Alert</span>
            </button>

            {/* Quick Settings Button */}
            <button
              id="quick-settings-btn"
              onClick={() => onTabChange('settings')}
              className={`p-2 rounded-xl transition ${
                activeTab === 'settings'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Job Search & Account Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-bounce">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifDropdown && (
                <div
                  id="notification-dropdown-panel"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 p-3 shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Real-Time Notifications
                      </span>
                      {unreadNotifsCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-full">
                          {unreadNotifsCount} new
                        </span>
                      )}
                    </div>
                    <button
                      id="mark-all-read-btn"
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
                        No notifications yet. Click "Simulate Alert" to test!
                      </p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          id={`dropdown-item-${n.id}`}
                          onClick={() => {
                            onNotificationClick(n);
                            setShowNotifDropdown(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition border text-left ${
                            !n.read
                              ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900'
                              : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" style={{ opacity: n.read ? 0 : 1 }} />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                {n.title}
                              </h5>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                                <span>{n.timestamp}</span>
                                {n.actionLabel && (
                                  <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                    {n.actionLabel} →
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      id="view-all-notifications-btn"
                      onClick={() => {
                        onTabChange('notifications');
                        setShowNotifDropdown(false);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View All Notification History &amp; Settings →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Quick Menu */}
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                />
                <div className="hidden md:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {userProfile.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize">
                    {activeRole === 'job_seeker' ? 'Candidate' : 'Admin'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {showUserMenu && (
                <div
                  id="user-dropdown-panel"
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{userProfile.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</p>
                  </div>

                  <button
                    id="menu-profile-btn"
                    onClick={() => {
                      onTabChange('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    CV Profile &amp; Experience
                  </button>

                  <button
                    id="menu-map-btn"
                    onClick={() => {
                      onTabChange('map');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    Interactive Job Map
                  </button>

                  <button
                    id="menu-enterprises-btn"
                    onClick={() => {
                      onTabChange('enterprises');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    Enterprise Company Hub
                  </button>

                  <button
                    id="menu-enterprise-panel-btn"
                    onClick={() => {
                      onRoleChange('enterprise');
                      onTabChange('enterprise_panel');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg flex items-center gap-2"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    Enterprise Announcements Panel
                  </button>

                  <button
                    id="menu-dashboard-btn"
                    onClick={() => {
                      onTabChange('dashboard');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                    Personal Dashboard
                  </button>

                  <button
                    id="menu-auth-btn"
                    onClick={() => {
                      onOpenAuthModal();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    Authentication &amp; Security
                  </button>

                  <button
                    id="menu-settings-btn"
                    onClick={() => {
                      onTabChange('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Settings &amp; Job Preferences
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                    <button
                      id="menu-switch-role-btn"
                      onClick={() => {
                        const newRole = activeRole === 'job_seeker' ? 'admin' : 'job_seeker';
                        onRoleChange(newRole);
                        onTabChange(newRole === 'admin' ? 'admin' : 'jobs');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                    >
                      Switch to {activeRole === 'job_seeker' ? 'Admin / Employer Mode' : 'Job Seeker Mode'}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => onTabChange('jobs')}
            className={`flex flex-col items-center py-1 font-semibold px-2 shrink-0 ${activeTab === 'jobs' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Jobs</span>
          </button>
          
          <button
            onClick={() => onTabChange('map')}
            className={`flex flex-col items-center py-1 font-semibold px-2 shrink-0 ${activeTab === 'map' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Map</span>
          </button>

          <button
            onClick={() => {
              if (activeRole !== 'enterprise') onRoleChange('enterprise');
              onTabChange('enterprise_panel');
            }}
            className={`flex flex-col items-center py-1 font-semibold px-2 shrink-0 ${activeTab === 'enterprise_panel' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Megaphone className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Enterprise</span>
          </button>

          <button
            onClick={() => onTabChange('enterprises')}
            className={`flex flex-col items-center py-1 font-semibold px-2 shrink-0 ${activeTab === 'enterprises' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Companies</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center py-1 font-semibold px-2 shrink-0 ${activeTab === 'profile' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <FileBadge className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">CV Profile</span>
          </button>

          <button
            onClick={() => onTabChange('applications')}
            className={`flex flex-col items-center py-1 font-semibold px-2 shrink-0 ${activeTab === 'applications' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Send className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Applied ({applicationsCount})</span>
          </button>

          <button
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center py-1 font-semibold px-2 shrink-0 ${activeTab === 'settings' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Settings</span>
          </button>

          <button
            onClick={() => {
              if (activeRole !== 'admin') onRoleChange('admin');
              onTabChange('admin');
            }}
            className={`flex flex-col items-center py-1 font-semibold px-2 shrink-0 ${activeTab === 'admin' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
};
