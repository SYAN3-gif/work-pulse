import { UserSettings } from '../types/job';

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile' | 'tablet';
}

export const INITIAL_USER_SETTINGS: UserSettings = {
  jobSearch: {
    status: 'actively_looking',
    targetTitles: [
      'Senior Full-Stack Engineer',
      'Staff Frontend Engineer',
      'Cloud Software Architect',
      'Principal Platform Engineer'
    ],
    workplacePreference: 'hybrid',
    minBaseSalary: 165000,
    targetTotalComp: 240000,
    currency: '$',
    compensationFrequency: 'annual',
    targetLocations: [
      'San Francisco, CA',
      'Seattle, WA',
      'New York, NY',
      'Austin, TX',
      'Remote'
    ],
    openToRelocation: true,
    companySizes: [
      'Seed / Series A (1-50)',
      'Growth Stage (51-500)',
      'Enterprise Tech (500+)'
    ],
    targetIndustries: [
      'AI & Machine Learning',
      'Developer Tools & Cloud',
      'FinTech & High Velocity',
      'HealthTech'
    ],
    requiresVisaSponsorship: false,
    noticePeriod: '1 Month',
    commuteMaxMinutes: 45,
  },
  privacy: {
    recruiterVisibility: 'public_all',
    hideFromCurrentEmployer: true,
    currentEmployerName: 'Veloce Cloud Systems',
    showOpenToWorkBadge: true,
    autoShareResumeWithOneClick: true,
    anonymousBrowsing: false,
    readReceiptsEnabled: true,
  },
  notifications: {
    alertFrequency: 'instant',
    emailNewMatches: true,
    emailRecruiterMessages: true,
    emailApplicationUpdates: true,
    emailAnnouncements: true,
    pushEnabled: true,
    soundEnabled: true,
    matchScoreThreshold: 80,
    smsInterviewAlerts: true,
  },
  account: {
    loginEmail: 'alex.morgan@workpulse.io',
    backupEmail: 'alex.morgan.personal@gmail.com',
    phoneNumber: '+1 (555) 382-9104',
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
    lastPasswordChange: 'August 12, 2026',
  },
  appearance: {
    theme: 'light',
    distanceUnit: 'miles',
    jobCardDensity: 'comfortable',
    reducedMotion: false,
    highContrast: false,
  },
};

export const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    device: 'Apple MacBook Pro 16"',
    browser: 'Google Chrome 128.0',
    location: 'San Francisco, California, US',
    ipAddress: '192.168.1.45 (Current Session)',
    lastActive: 'Active right now',
    isCurrent: true,
    type: 'desktop',
  },
  {
    id: 'sess-2',
    device: 'Apple iPhone 15 Pro Max',
    browser: 'WorkPulse Mobile App v3.4',
    location: 'San Francisco, California, US',
    ipAddress: '172.56.21.9',
    lastActive: '18 minutes ago',
    isCurrent: false,
    type: 'mobile',
  },
  {
    id: 'sess-3',
    device: 'Dell XPS 15 (Work Laptop)',
    browser: 'Brave Browser 1.69',
    location: 'San Jose, California, US',
    ipAddress: '108.162.245.12',
    lastActive: '3 days ago',
    isCurrent: false,
    type: 'desktop',
  },
];
