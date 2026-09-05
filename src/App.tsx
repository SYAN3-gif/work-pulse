/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Job, 
  Application, 
  UserProfile, 
  NotificationItem, 
  Conversation, 
  Role, 
  ApplicationStage,
  Enterprise,
  EnterpriseAnnouncement,
  UserSettings
} from './types/job';
import { 
  INITIAL_JOBS, 
  INITIAL_APPLICATIONS, 
  INITIAL_PROFILE, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CONVERSATIONS,
  APP_LOGO_URL
} from './data/mockData';
import { INITIAL_ENTERPRISES } from './data/mockEnterprises';
import { INITIAL_USER_SETTINGS } from './data/mockSettings';
import { Navbar } from './components/Navbar';
import { PhaseNavigator } from './components/PhaseNavigator';
import { JobSearchSection } from './components/JobSearchSection';
import { JobDetailsModal } from './components/JobDetailsModal';
import { OneClickApplyModal } from './components/OneClickApplyModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { PersonalDashboard } from './components/PersonalDashboard';
import { ProfileSetup } from './components/ProfileSetup';
import { MessagingCenter } from './components/MessagingCenter';
import { NotificationCenter } from './components/NotificationCenter';
import { SettingsPage } from './components/SettingsPage';
import { AdminPortal } from './components/AdminPortal';
import { AIFeaturesModal } from './components/AIFeaturesModal';
import { AuthModal } from './components/AuthModal';
import { NotificationToastContainer } from './components/NotificationToast';
import { JobMapView } from './components/JobMapView';
import { EnterprisePage, EnterpriseDirectory } from './components/EnterprisePage';
import { EnterprisePanel } from './components/EnterprisePanel';
import { playNotificationSound } from './utils/audio';

export default function App() {
  // Core application state
  const [activeRole, setActiveRole] = useState<Role>('job_seeker');
  const [activeTab, setActiveTab] = useState<string>('jobs');
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workpulse_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Dark mode side-effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('workpulse_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('workpulse_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Data entities
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [enterprises, setEnterprises] = useState<Enterprise[]>(INITIAL_ENTERPRISES);
  const [managedEnterpriseId, setManagedEnterpriseId] = useState<string>('ent-anthropic');
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>(['job-2']);
  
  // User Settings & Job Search Preferences
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workpulse_user_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error loading saved settings', e);
        }
      }
    }
    return INITIAL_USER_SETTINGS;
  });

  // Audio & Real-Time Alerts
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return userSettings.notifications.soundEnabled;
  });
  const [toasts, setToasts] = useState<NotificationItem[]>([]);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('workpulse_user_settings', JSON.stringify(newSettings));
    }
    // Synchronize sound preferences
    setSoundEnabled(newSettings.notifications.soundEnabled);
    // Synchronize theme preference if explicitly changed in settings
    if (newSettings.appearance.theme === 'dark' && !isDarkMode) {
      handleToggleDarkMode();
    } else if (newSettings.appearance.theme === 'light' && isDarkMode) {
      handleToggleDarkMode();
    }
  };

  // Reset Settings handler
  const handleResetSettingsToDefault = () => {
    setUserSettings(INITIAL_USER_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('workpulse_user_settings');
    }
    setSoundEnabled(INITIAL_USER_SETTINGS.notifications.soundEnabled);
  };

  // Modals
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [jobForOneClickApply, setJobForOneClickApply] = useState<Job | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAISuiteOpen, setIsAISuiteOpen] = useState<boolean>(false);
  const [contextJobForAI, setContextJobForAI] = useState<Job | null>(INITIAL_JOBS[0]);

  // Handle toast auto-dismiss
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Push a real-time notification
  const triggerNotification = (newNotif: NotificationItem) => {
    setNotifications((prev) => [newNotif, ...prev]);
    setToasts((prev) => [newNotif, ...prev.slice(0, 2)]);
    if (soundEnabled) {
      playNotificationSound();
    }
    // Auto dismiss toast after 6.5 seconds
    setTimeout(() => {
      dismissToast(newNotif.id);
    }, 6500);
  };

  // Simulate incoming real-time alerts
  const handleSimulateLiveAlert = () => {
    const simulationPool: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>[] = [
      {
        title: 'Interview Request • Stripe',
        message: 'Lead Recruiter Sarah Jenkins sent an invitation for Senior Frontend Round 2.',
        category: 'interview',
        actionLabel: 'Schedule Time',
        actionTarget: 'interview-stripe',
      },
      {
        title: 'Anthropic Labs Viewed Application',
        message: 'The AI Interface engineering team accessed your resume and GitHub profile.',
        category: 'application',
        actionLabel: 'Check Status',
        actionTarget: 'app-anthropic',
      },
      {
        title: 'AI High-Fit Match Alert (98%)',
        message: 'New role: Staff Architect at Datadog matches 98% of your distributed systems profile.',
        category: 'ai_match',
        actionLabel: '1-Click Apply',
        actionTarget: 'job-4',
      },
      {
        title: 'Recruiter Chat Message',
        message: 'Elena from Figma: "Your technical project demo was reviewed by our VP of Eng!"',
        category: 'message',
        actionLabel: 'Reply in Chat',
        actionTarget: 'chat-figma',
      },
      {
        title: 'Enterprise Announcement • Stripe',
        message: 'Stripe announced the Spring 2026 Developer Tooling hiring sprint.',
        category: 'system',
        actionLabel: 'View Announcement',
        actionTarget: 'enterprises',
      }
    ];

    const randomItem = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    const created: NotificationItem = {
      ...randomItem,
      id: `live-alert-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    triggerNotification(created);
  };

  // 1-Click Apply Action
  const handleOneClickApplySubmit = (jobId: string, customNote?: string) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    // Check if already applied
    if (applications.some((a) => a.jobId === jobId)) {
      triggerNotification({
        id: `notif-dup-${Date.now()}`,
        title: 'Application Already Submitted',
        message: `You have already submitted an active application for ${targetJob.title}.`,
        timestamp: 'Just now',
        category: 'application',
        read: false,
      });
      setJobForOneClickApply(null);
      return;
    }

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      company: targetJob.company,
      companyLogo: targetJob.companyLogo,
      location: targetJob.location,
      appliedDate: 'Just now',
      stage: 'applied',
      salary: `$${(targetJob.salaryMin / 1000).toFixed(0)}k - $${(targetJob.salaryMax / 1000).toFixed(0)}k`,
      appliedWithResume: userProfile.resumeFileName,
      matchScore: targetJob.matchScore,
      notes: customNote || 'Applied via WorkPulse 1-Click Fast Track using saved profile.',
      applicantName: userProfile.name,
      applicantEmail: userProfile.email,
      applicantRole: userProfile.headline,
      applicantPhone: userProfile.phone,
      applicantLocation: userProfile.location,
    };

    setApplications((prev) => [newApplication, ...prev]);

    // Update job applicant count
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    setJobForOneClickApply(null);

    // Trigger instant feedback notification
    triggerNotification({
      id: `notif-app-${Date.now()}`,
      title: `Application Delivered! • ${targetJob.company}`,
      message: `Your credentials and CV were transmitted directly to the hiring desk for ${targetJob.title}.`,
      timestamp: 'Just now',
      category: 'application',
      read: false,
      actionLabel: 'Track Progress',
      actionTarget: newApplication.id,
    });
  };

  // Bookmark Toggle
  const handleToggleBookmark = (jobId: string) => {
    setBookmarkedJobIds((prev) => {
      const isBookmarked = prev.includes(jobId);
      const next = isBookmarked ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      const job = jobs.find((j) => j.id === jobId);
      if (!isBookmarked && job) {
        triggerNotification({
          id: `bookmarked-${Date.now()}`,
          title: 'Position Saved to Dashboard',
          message: `${job.title} at ${job.company} added to your saved positions.`,
          timestamp: 'Just now',
          category: 'application',
          read: false,
        });
      }
      return next;
    });
  };

  // Application Stage Transition (Recruiter or Seeker)
  const handleUpdateApplicationStage = (appId: string, newStage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updated = { ...app, stage: newStage };
          triggerNotification({
            id: `stage-update-${Date.now()}`,
            title: `Application Pipeline Updated • ${app.company}`,
            message: `Status advanced to "${newStage.toUpperCase()}" for ${app.jobTitle}.`,
            timestamp: 'Just now',
            category: 'application',
            read: false,
            actionLabel: 'View in Tracker',
            actionTarget: appId,
          });
          return updated;
        }
        return app;
      })
    );
  };

  // Notification click handler
  const handleNotificationAction = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.category === 'message') {
      setActiveTab('messages');
    } else if (notif.category === 'interview' || notif.category === 'application') {
      setActiveTab('applications');
    } else if (notif.category === 'ai_match') {
      setIsAISuiteOpen(true);
    } else if (notif.actionTarget === 'enterprises') {
      setActiveTab('enterprises');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Send message in chat
  const handleSendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: userProfile.name,
      senderAvatar: userProfile.avatarUrl,
      text: text.trim(),
      timestamp: 'Just now',
      isRecruiter: false,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Simulate recruiter automated reply in 1.5 seconds
    setTimeout(() => {
      const recruiterReplies = [
        'Thanks for confirming! I have forwarded this to the hiring team calendar.',
        'Perfect, looking forward to speaking with you!',
        'Noted! I will send the calendar invite shortly.',
      ];
      const randomReply = recruiterReplies[Math.floor(Math.random() * recruiterReplies.length)];
      
      setConversations((latest) =>
        latest.map((conv) => {
          if (conv.id === conversationId) {
            const recruiterMsg = {
              id: `rec-reply-${Date.now()}`,
              senderId: conv.participantName,
              senderName: conv.participantName,
              senderAvatar: conv.participantAvatar,
              text: randomReply,
              timestamp: 'Just now',
              isRecruiter: true,
            };
            return {
              ...conv,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              messages: [...conv.messages, recruiterMsg],
            };
          }
          return conv;
        })
      );

      triggerNotification({
        id: `rec-notif-${Date.now()}`,
        title: `New Message from ${conversations.find((c) => c.id === conversationId)?.participantName || 'Recruiter'}`,
        message: `"${randomReply}"`,
        timestamp: 'Just now',
        category: 'message',
        read: false,
        actionLabel: 'Reply in Chat',
      });
    }, 1500);
  };

  // Admin Actions
  const handleAddJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    triggerNotification({
      id: `new-job-broadcast-${Date.now()}`,
      title: `New Position Published • ${newJob.company}`,
      message: `${newJob.title} is now active and live on the Job Map & Search radar.`,
      timestamp: 'Just now',
      category: 'system',
      read: false,
    });
  };

  const handleUpdateJobStatus = (jobId: string, status: 'active' | 'closed') => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
  };

  const handleBroadcastNotification = (title: string, message: string) => {
    triggerNotification({
      id: `broadcast-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      category: 'system',
      read: false,
    });
  };

  // Enterprise Announcements Handlers
  const handlePostAnnouncement = (ann: EnterpriseAnnouncement, broadcastToCandidates: boolean = true) => {
    setEnterprises((prev) =>
      prev.map((e) =>
        e.id === ann.enterpriseId
          ? { ...e, announcements: [ann, ...e.announcements] }
          : e
      )
    );

    const company = enterprises.find((e) => e.id === ann.enterpriseId);
    if (broadcastToCandidates) {
      triggerNotification({
        id: `ann-push-${Date.now()}`,
        title: `Enterprise Announcement • ${company ? company.name : 'Company'}`,
        message: `"${ann.title}" - ${ann.content.slice(0, 75)}...`,
        timestamp: 'Just now',
        category: 'system',
        read: false,
        actionLabel: 'View Announcement',
        actionTarget: 'enterprises',
      });
    }
  };

  const handleUpdateAnnouncement = (updatedAnn: EnterpriseAnnouncement) => {
    setEnterprises((prev) =>
      prev.map((e) =>
        e.id === updatedAnn.enterpriseId
          ? {
              ...e,
              announcements: e.announcements.map((a) =>
                a.id === updatedAnn.id ? updatedAnn : a
              ),
            }
          : e
      )
    );

    triggerNotification({
      id: `ann-update-${Date.now()}`,
      title: 'Announcement Updated',
      message: `Changes to "${updatedAnn.title}" have been saved and synchronized.`,
      timestamp: 'Just now',
      category: 'system',
      read: false,
    });
  };

  const handleTogglePinAnnouncement = (annId: string) => {
    setEnterprises((prev) =>
      prev.map((e) => ({
        ...e,
        announcements: e.announcements.map((a) =>
          a.id === annId ? { ...a, pinned: !a.pinned } : a
        ),
      }))
    );
  };

  const handleBroadcastAnnouncement = (ann: EnterpriseAnnouncement) => {
    const company = enterprises.find((e) => e.id === ann.enterpriseId);
    triggerNotification({
      id: `broadcast-ann-${Date.now()}`,
      title: `⚡ Live Alert • ${company?.name || 'Enterprise'} Announcement`,
      message: `${ann.title}: ${ann.content.slice(0, 80)}...`,
      timestamp: 'Just now',
      category: 'system',
      read: false,
      actionLabel: 'View Updates',
      actionTarget: 'enterprises',
    });
  };

  const handleUpdateEnterpriseProfile = (enterpriseId: string, updates: Partial<Enterprise>) => {
    setEnterprises((prev) =>
      prev.map((e) => (e.id === enterpriseId ? { ...e, ...updates } : e))
    );
    triggerNotification({
      id: `ent-profile-${Date.now()}`,
      title: 'Enterprise Profile Updated',
      message: 'Your company details, headline, and culture values were updated.',
      timestamp: 'Just now',
      category: 'system',
      read: false,
    });
  };

  const handleOpenEnterprisePanel = (enterpriseId?: string) => {
    if (enterpriseId) {
      setManagedEnterpriseId(enterpriseId);
    }
    setActiveRole('enterprise');
    setActiveTab('enterprise_panel');
  };

  const handleViewEnterprisePublicPage = (enterprise: Enterprise) => {
    setSelectedEnterprise(enterprise);
    setActiveTab('enterprises');
  };

  const handleDeleteAnnouncement = (annId: string) => {
    setEnterprises((prev) =>
      prev.map((e) => ({
        ...e,
        announcements: e.announcements.filter((a) => a.id !== annId),
      }))
    );
  };

  const handleToggleFollowEnterprise = (enterpriseId: string) => {
    setEnterprises((prev) =>
      prev.map((e) => {
        if (e.id === enterpriseId) {
          const nextState = !e.isFollowing;
          if (nextState) {
            triggerNotification({
              id: `follow-${Date.now()}`,
              title: `Following ${e.name}`,
              message: `You will now receive priority announcements and hiring blitz notifications from ${e.name}.`,
              timestamp: 'Just now',
              category: 'system',
              read: false,
            });
          }
          return {
            ...e,
            isFollowing: nextState,
            followerCount: (e.followerCount || 100) + (nextState ? 1 : -1),
          };
        }
        return e;
      })
    );
  };

  // Unread message count & applied lists
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const appliedJobIds = applications.map((a) => a.jobId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
      
      {/* 10 Operational Phases Quick Navigator Header */}
      <PhaseNavigator
        currentTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'admin') setActiveRole('admin');
          setActiveTab(tab);
        }}
        activeRole={activeRole}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAISuite={() => setIsAISuiteOpen(true)}
      />

      {/* Main Top Navigation Bar */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={(newRole) => {
          setActiveRole(newRole);
          if (newRole === 'admin') setActiveTab('admin');
          else if (newRole === 'enterprise') setActiveTab('enterprise_panel');
          else if (activeTab === 'admin' || activeTab === 'enterprise_panel') setActiveTab('jobs');
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          // If switching to enterprises tab, clear selected enterprise to show directory
          if (tab === 'enterprises') setSelectedEnterprise(null);
          setActiveTab(tab);
        }}
        notifications={notifications}
        onNotificationClick={handleNotificationAction}
        onMarkAllNotificationsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSimulateNotification={handleSimulateLiveAlert}
        applicationsCount={applications.length}
        unreadMessagesCount={unreadMessagesCount}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAISuite={() => setIsAISuiteOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeRole === 'admin' && activeTab === 'admin' ? (
          <AdminPortal
            jobs={jobs}
            applications={applications}
            enterprises={enterprises}
            onAddJob={handleAddJob}
            onUpdateJobStatus={handleUpdateJobStatus}
            onUpdateApplicationStage={handleUpdateApplicationStage}
            onBroadcastNotification={handleBroadcastNotification}
            onAddAnnouncement={handlePostAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        ) : (activeRole === 'enterprise' || activeTab === 'enterprise_panel') ? (
          <EnterprisePanel
            enterprises={enterprises}
            currentEnterpriseId={managedEnterpriseId}
            onSelectEnterpriseId={setManagedEnterpriseId}
            jobs={jobs}
            onPostAnnouncement={handlePostAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onTogglePinAnnouncement={handleTogglePinAnnouncement}
            onBroadcastAnnouncement={handleBroadcastAnnouncement}
            onViewPublicPage={handleViewEnterprisePublicPage}
            onUpdateEnterpriseProfile={handleUpdateEnterpriseProfile}
          />
        ) : (
          <>
            {/* Find Jobs Tab (Phases 4 & 5) */}
            {activeTab === 'jobs' && (
              <JobSearchSection
                jobs={jobs}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onOneClickApply={(job) => setJobForOneClickApply(job)}
                bookmarkedJobIds={bookmarkedJobIds}
                onToggleBookmark={handleToggleBookmark}
                appliedJobIds={appliedJobIds}
              />
            )}

            {/* Interactive Job Map Tab (Close vs Far Proximity Radar) */}
            {activeTab === 'map' && (
              <JobMapView
                jobs={jobs}
                userProfile={userProfile}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onOneClickApply={(job) => setJobForOneClickApply(job)}
                appliedJobIds={appliedJobIds}
                bookmarkedJobIds={bookmarkedJobIds}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {/* Enterprise Pages & Announcements Directory */}
            {activeTab === 'enterprises' && (
              selectedEnterprise ? (
                <EnterprisePage
                  enterprise={selectedEnterprise}
                  jobs={jobs}
                  onBackToDirectory={() => setSelectedEnterprise(null)}
                  onSelectJob={(job) => setSelectedJobForDetails(job)}
                  onOneClickApply={(job) => setJobForOneClickApply(job)}
                  appliedJobIds={appliedJobIds}
                  onPostAnnouncement={handlePostAnnouncement}
                  onToggleFollow={handleToggleFollowEnterprise}
                  onOpenEnterprisePanel={handleOpenEnterprisePanel}
                />
              ) : (
                <EnterpriseDirectory
                  enterprises={enterprises}
                  onSelectEnterprise={(ent) => setSelectedEnterprise(ent)}
                  onToggleFollow={handleToggleFollowEnterprise}
                  onOpenEnterprisePanel={handleOpenEnterprisePanel}
                />
              )
            )}

            {/* My Applications Tab (Phase 6) */}
            {activeTab === 'applications' && (
              <ApplicationTracker
                applications={applications}
                onUpdateStage={handleUpdateApplicationStage}
                onSelectApplication={(app) => {
                  const matchingJob = jobs.find((j) => j.id === app.jobId);
                  if (matchingJob) setSelectedJobForDetails(matchingJob);
                }}
              />
            )}

            {/* Personal Dashboard Tab (Phase 3) */}
            {activeTab === 'dashboard' && (
              <PersonalDashboard
                userProfile={userProfile}
                applications={applications}
                jobs={jobs}
                onNavigateTab={(tab) => {
                  if (tab === 'enterprises') setSelectedEnterprise(null);
                  setActiveTab(tab);
                }}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onOneClickApply={(job) => setJobForOneClickApply(job)}
                onOpenAISuite={() => setIsAISuiteOpen(true)}
              />
            )}

            {/* Professional Profile & CV Characteristics Setup (Phase 2) */}
            {activeTab === 'profile' && (
              <ProfileSetup
                userProfile={userProfile}
                onSaveProfile={(updated) => {
                  setUserProfile(updated);
                  triggerNotification({
                    id: `profile-saved-${Date.now()}`,
                    title: 'CV Profile Saved Successfully',
                    message: 'Your CV characteristics, experience milestones, and skills have been updated across your 1-Click application dossier.',
                    timestamp: 'Just now',
                    category: 'application',
                    read: false,
                  });
                }}
                onOpenAISuite={() => setIsAISuiteOpen(true)}
              />
            )}

            {/* Direct Recruiter Messaging Tab (Phase 7) */}
            {activeTab === 'messages' && (
              <MessagingCenter
                conversations={conversations}
                onSendMessage={handleSendMessage}
              />
            )}

            {/* Notifications Tab (Phase 8) */}
            {activeTab === 'notifications' && (
              <NotificationCenter
                notifications={notifications}
                onNotificationClick={handleNotificationAction}
                onMarkAllRead={() => {
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                }}
                onClearRead={() => {
                  setNotifications((prev) => prev.filter((n) => !n.read));
                }}
                onSimulateNotification={handleSimulateLiveAlert}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
              />
            )}

            {/* User Settings & Job Preferences Tab */}
            {activeTab === 'settings' && (
              <SettingsPage
                settings={userSettings}
                userProfile={userProfile}
                darkMode={isDarkMode}
                onToggleDarkMode={handleToggleDarkMode}
                onUpdateSettings={handleUpdateSettings}
                onUpdateUserProfile={(updates) => {
                  setUserProfile((prev) => ({ ...prev, ...updates }));
                }}
                onResetSettingsToDefault={handleResetSettingsToDefault}
                onNotify={(title, message) => {
                  triggerNotification({
                    id: `settings-${Date.now()}`,
                    title,
                    message,
                    timestamp: 'Just now',
                    category: 'system',
                    read: false,
                  });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}

      {/* 1-Click Apply Modal */}
      <OneClickApplyModal
        job={jobForOneClickApply}
        userProfile={userProfile}
        isOpen={Boolean(jobForOneClickApply)}
        onClose={() => setJobForOneClickApply(null)}
        onSubmit={handleOneClickApplySubmit}
        onOpenProfile={() => {
          setJobForOneClickApply(null);
          setActiveTab('profile');
        }}
      />

      {/* Detailed Job Information Modal */}
      <JobDetailsModal
        job={selectedJobForDetails}
        isOpen={Boolean(selectedJobForDetails)}
        onClose={() => setSelectedJobForDetails(null)}
        onOneClickApply={(job) => setJobForOneClickApply(job)}
        isBookmarked={selectedJobForDetails ? bookmarkedJobIds.includes(selectedJobForDetails.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onOpenAISuiteWithJob={(job) => {
          setContextJobForAI(job);
          setIsAISuiteOpen(true);
        }}
      />

      {/* AI Career Suite Modal (Phase 10) */}
      <AIFeaturesModal
        isOpen={isAISuiteOpen}
        onClose={() => setIsAISuiteOpen(false)}
        selectedJob={contextJobForAI}
        userProfile={userProfile}
        onSelectJob={(job) => setContextJobForAI(job)}
        jobs={jobs}
      />

      {/* User Authentication & Role Modal (Phase 1) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        activeRole={activeRole}
        onLoginAsRole={(role) => {
          setActiveRole(role);
          if (role === 'admin') setActiveTab('admin');
          else if (role === 'enterprise') setActiveTab('enterprise_panel');
          else setActiveTab('jobs');
        }}
      />

      {/* Floating Real-Time Notifications Toast Container */}
      <NotificationToastContainer
        notifications={toasts}
        onDismiss={dismissToast}
        onAction={handleNotificationAction}
      />

      {/* Platform Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src={APP_LOGO_URL}
              alt="WorkPulse Logo"
              className="h-6 w-auto object-contain"
            />
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              WorkPulse Platform
            </span>
            <span>•</span>
            <span>10 Operational Phases Digital Employment Ecosystem</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Real-Time Push Gateway: Active
            </span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-blue-600 dark:text-blue-400 transition font-medium"
            >
              Authentication &amp; Security
            </button>
            <button
              onClick={() => {
                if (activeRole === 'job_seeker') {
                  setActiveRole('enterprise');
                  setActiveTab('enterprise_panel');
                } else if (activeRole === 'enterprise') {
                  setActiveRole('admin');
                  setActiveTab('admin');
                } else {
                  setActiveRole('job_seeker');
                  setActiveTab('jobs');
                }
              }}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition font-bold text-blue-600 dark:text-blue-400"
            >
              Switch Role ({activeRole === 'job_seeker' ? 'Enter Enterprise Panel' : activeRole === 'enterprise' ? 'Enter Admin Mode' : 'Enter Candidate Mode'})
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
