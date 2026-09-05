export type Role = 'job_seeker' | 'admin' | 'enterprise';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
export type WorkplaceType = 'Remote' | 'Hybrid' | 'On-site';
export type ExperienceLevel = 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Executive';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  companyLogo: string;
  location: string;
  latitude?: number;
  longitude?: number;
  workplaceType: WorkplaceType;
  jobType: JobType;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  experienceLevel: ExperienceLevel;
  department: string;
  postedAt: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  matchScore: number;
  applicantsCount: number;
  featured?: boolean;
  urgent?: boolean;
  status: 'active' | 'closed' | 'draft';
  distanceMiles?: number;
  commuteEstimate?: string;
  proximityCategory?: 'very_close' | 'nearby' | 'far' | 'remote';
}

export type ApplicationStage = 'saved' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  appliedDate: string;
  stage: ApplicationStage;
  salary: string;
  appliedWithResume: string;
  matchScore: number;
  notes?: string;
  interviewDate?: string;
  nextStep?: string;
  feedback?: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantRole?: string;
  applicantPhone?: string;
  applicantLocation?: string;
  applicantSkills?: string[];
  applicantExperienceYears?: number;
}

export interface SkillItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export type SkillDetailed = SkillItem;

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  achievements?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  fieldOfStudy?: string;
  gpa?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface LanguageItem {
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational';
}

export type JobSearchStatus = 'actively_looking' | 'open_to_offers' | 'casually_browsing' | 'not_looking';

export interface UserSettings {
  jobSearch: {
    status: JobSearchStatus;
    targetTitles: string[];
    workplacePreference: 'remote_only' | 'hybrid' | 'onsite' | 'open_to_any';
    minBaseSalary: number;
    targetTotalComp: number;
    currency: string;
    compensationFrequency: 'annual' | 'hourly';
    targetLocations: string[];
    openToRelocation: boolean;
    companySizes: string[];
    targetIndustries: string[];
    requiresVisaSponsorship: boolean;
    noticePeriod: string;
    commuteMaxMinutes: number;
  };
  privacy: {
    recruiterVisibility: 'public_all' | 'applied_only' | 'private';
    hideFromCurrentEmployer: boolean;
    currentEmployerName: string;
    showOpenToWorkBadge: boolean;
    autoShareResumeWithOneClick: boolean;
    anonymousBrowsing: boolean;
    readReceiptsEnabled: boolean;
  };
  notifications: {
    alertFrequency: 'instant' | 'daily_digest' | 'weekly' | 'off';
    emailNewMatches: boolean;
    emailRecruiterMessages: boolean;
    emailApplicationUpdates: boolean;
    emailAnnouncements: boolean;
    pushEnabled: boolean;
    soundEnabled: boolean;
    matchScoreThreshold: number;
    smsInterviewAlerts: boolean;
  };
  account: {
    loginEmail: string;
    backupEmail: string;
    phoneNumber: string;
    twoFactorEnabled: boolean;
    twoFactorMethod: 'authenticator' | 'sms';
    lastPasswordChange: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    distanceUnit: 'miles' | 'km';
    jobCardDensity: 'comfortable' | 'compact';
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  userLatitude?: number;
  userLongitude?: number;
  bio: string;
  avatarUrl: string;
  resumeFileName: string;
  resumeLastUpdated: string;
  skills: string[];
  skillsDetailed?: SkillItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications?: CertificationItem[];
  languages?: LanguageItem[];
  preferredJobTitles: string[];
  preferredLocations: string[];
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  openToRemote: boolean;
  workAuthorization?: string;
  noticePeriod?: string;
  yearsOfExperience?: number;
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface EnterpriseAnnouncement {
  id: string;
  enterpriseId: string;
  title: string;
  category: 'Hiring Blitz' | 'Company Milestone' | 'Tech Talk' | 'Workplace & Culture' | 'Product Launch' | 'General';
  content: string;
  date: string;
  authorName: string;
  authorRole: string;
  pinned?: boolean;
  linkUrl?: string;
  linkText?: string;
  likesCount?: number;
  impressionsCount?: number;
  targetAudience?: string;
  relatedJobId?: string;
  status?: 'published' | 'draft' | 'archived';
}

export interface Enterprise {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  headline: string;
  industry: string;
  headquarters: string;
  latitude: number;
  longitude: number;
  size: string;
  founded: string;
  website: string;
  description: string;
  verified: boolean;
  perks: string[];
  techStack: string[];
  cultureHighlights: string[];
  announcements: EnterpriseAnnouncement[];
  followerCount?: number;
  isFollowing?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'application' | 'interview' | 'message' | 'ai_match' | 'system';
  read: boolean;
  actionLabel?: string;
  actionTarget?: string;
  companyLogo?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isRecruiter: boolean;
  attachment?: {
    name: string;
    size: string;
  };
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  participantCompany: string;
  participantAvatar: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  jobTitle: string;
  messages: ChatMessage[];
}

export interface OperationalPhase {
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  targetTab: string;
  seekerFocus: string;
  adminFocus: string;
}

