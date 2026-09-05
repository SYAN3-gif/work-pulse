import React, { useState } from 'react';
import { 
  UserProfile, 
  ExperienceItem, 
  EducationItem, 
  CertificationItem, 
  LanguageItem, 
  SkillDetailed 
} from '../types/job';
import { USER_PRESET_LOCATIONS } from '../utils/geo';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle, 
  Sparkles, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe2, 
  Github, 
  Linkedin, 
  DollarSign, 
  Save, 
  ShieldCheck,
  Compass,
  FileCode,
  Languages,
  Clock,
  Building,
  Check
} from 'lucide-react';

interface ProfileSetupProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onOpenAISuite: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({
  userProfile,
  onSaveProfile,
  onOpenAISuite,
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [newSkillTag, setNewSkillTag] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'cv' | 'experience' | 'skills' | 'education' | 'preferences'>('cv');

  // Experience modal/inline form states
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('');
  const [newExpLoc, setNewExpLoc] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAchievement, setNewExpAchievement] = useState('');

  // Education inline form states
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduInst, setNewEduInst] = useState('');
  const [newEduYear, setNewEduYear] = useState('');
  const [newEduField, setNewEduField] = useState('');
  const [newEduGpa, setNewEduGpa] = useState('');

  // Cert inline form states
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');

  // Language inline form states
  const [showAddLang, setShowAddLang] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangProficiency, setNewLangProficiency] = useState<'Native' | 'Fluent' | 'Conversational' | 'Basic'>('Fluent');

  // Detailed Skill inline state
  const [showAddSkillDetailed, setShowAddSkillDetailed] = useState(false);
  const [newSkillDetName, setNewSkillDetName] = useState('');
  const [newSkillDetLevel, setNewSkillDetLevel] = useState<'Expert' | 'Advanced' | 'Intermediate' | 'Beginner'>('Advanced');

  // Save changes
  const handleSave = () => {
    onSaveProfile(profile);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  // Location selector change with automated coordinate sync
  const handleLocationPresetChange = (locName: string) => {
    const preset = USER_PRESET_LOCATIONS.find((p) => p.name === locName || p.city === locName);
    if (preset) {
      setProfile({
        ...profile,
        location: preset.city,
        userLatitude: preset.coords.latitude,
        userLongitude: preset.coords.longitude,
      });
    } else {
      setProfile({ ...profile, location: locName });
    }
  };

  // Fast skill tag handler
  const handleAddSkillTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillTag.trim() && !profile.skills.includes(newSkillTag.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkillTag.trim()],
      });
      setNewSkillTag('');
    }
  };

  const handleRemoveSkillTag = (tag: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== tag),
    });
  };

  // Experience operations
  const handleCreateExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpRole.trim() || !newExpCompany.trim()) return;

    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExpRole.trim(),
      company: newExpCompany.trim(),
      period: newExpPeriod.trim() || '2024 - Present',
      location: newExpLoc.trim() || profile.location,
      description: newExpDesc.trim() || 'Spearheaded key product engineering initiatives.',
      achievements: newExpAchievement.trim() ? [newExpAchievement.trim()] : undefined,
    };

    setProfile({
      ...profile,
      experience: [newExp, ...(profile.experience || [])],
    });

    // Reset
    setShowAddExp(false);
    setNewExpRole('');
    setNewExpCompany('');
    setNewExpPeriod('');
    setNewExpLoc('');
    setNewExpDesc('');
    setNewExpAchievement('');
  };

  const handleDeleteExperience = (id: string) => {
    setProfile({
      ...profile,
      experience: (profile.experience || []).filter((exp) => exp.id !== id),
    });
  };

  // Education operations
  const handleCreateEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduDegree.trim() || !newEduInst.trim()) return;

    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: newEduDegree.trim(),
      institution: newEduInst.trim(),
      year: newEduYear.trim() || '2020 - 2024',
      fieldOfStudy: newEduField.trim() || undefined,
      gpa: newEduGpa.trim() || undefined,
    };

    setProfile({
      ...profile,
      education: [newEdu, ...(profile.education || [])],
    });

    setShowAddEdu(false);
    setNewEduDegree('');
    setNewEduInst('');
    setNewEduYear('');
    setNewEduField('');
    setNewEduGpa('');
  };

  const handleDeleteEducation = (id: string) => {
    setProfile({
      ...profile,
      education: (profile.education || []).filter((edu) => edu.id !== id),
    });
  };

  // Certification operations
  const handleCreateCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertIssuer.trim()) return;

    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: newCertName.trim(),
      issuer: newCertIssuer.trim(),
      year: newCertYear.trim() || '2024',
    };

    setProfile({
      ...profile,
      certifications: [newCert, ...(profile.certifications || [])],
    });

    setShowAddCert(false);
    setNewCertName('');
    setNewCertIssuer('');
    setNewCertYear('');
  };

  const handleDeleteCert = (id: string) => {
    setProfile({
      ...profile,
      certifications: (profile.certifications || []).filter((c) => c.id !== id),
    });
  };

  // Language operations
  const handleCreateLang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;

    const newLang: LanguageItem = {
      language: newLangName.trim(),
      proficiency: newLangProficiency,
    };

    setProfile({
      ...profile,
      languages: [...(profile.languages || []), newLang],
    });

    setShowAddLang(false);
    setNewLangName('');
    setNewLangProficiency('Fluent');
  };

  const handleDeleteLang = (langName: string) => {
    setProfile({
      ...profile,
      languages: (profile.languages || []).filter((l) => l.language !== langName),
    });
  };

  // Detailed skill operations
  const handleCreateDetailedSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillDetName.trim()) return;

    const newSkill: SkillDetailed = {
      name: newSkillDetName.trim(),
      level: newSkillDetLevel,
    };

    setProfile({
      ...profile,
      skillsDetailed: [...(profile.skillsDetailed || []), newSkill],
    });

    setShowAddSkillDetailed(false);
    setNewSkillDetName('');
  };

  const handleDeleteDetailedSkill = (name: string) => {
    setProfile({
      ...profile,
      skillsDetailed: (profile.skillsDetailed || []).filter((s) => s.name !== name),
    });
  };

  // Simulated CV File Upload
  const handleResumeSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile({
        ...profile,
        resumeFileName: file.name,
        resumeLastUpdated: 'Uploaded today • Ready for 1-Click Apply',
      });
    }
  };

  return (
    <div id="profile-setup-view" className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Identity Hero */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profile.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  Verified CV Profile
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl font-medium">
                {profile.headline}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {profile.noticePeriod || '2 weeks notice'}
                </span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ${(profile.expectedSalaryMin / 1000).toFixed(0)}k - ${(profile.expectedSalaryMax / 1000).toFixed(0)}k / yr
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="open-ai-suite-from-profile-btn"
              onClick={onOpenAISuite}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              AI CV Optimizer
            </button>
            <button
              id="save-profile-btn"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </div>

        {savedAlert && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 transition-all">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Profile &amp; CV characteristics saved successfully! Your 1-Click Applications and Geolocation have been updated.
          </div>
        )}

        {/* Profile Section Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setActiveSubTab('cv')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'cv'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Basic Info &amp; CV Document
          </button>

          <button
            onClick={() => setActiveSubTab('experience')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'experience'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Work Experience ({(profile.experience || []).length})
          </button>

          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'skills'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Skills &amp; Languages
          </button>

          <button
            onClick={() => setActiveSubTab('education')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'education'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Education &amp; Certifications
          </button>

          <button
            onClick={() => setActiveSubTab('preferences')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'preferences'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Job Preferences &amp; Location
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Basic Info & CV Document */}
      {activeSubTab === 'cv' && (
        <div className="space-y-6">
          {/* CV Document Attachment Box */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Primary CV / Resume File for 1-Click Apply
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              This document is automatically submitted when you use 1-Click Apply to employers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-sm shrink-0">
                  PDF
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {profile.resumeFileName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {profile.resumeLastUpdated} • Parsed and ready
                  </p>
                </div>
              </div>

              <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                Upload New CV / Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeSimulatedUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Personal &amp; Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Headline *
                </label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Current City / Location *</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">Centers Job Map</span>
                </label>
                <select
                  value={profile.location}
                  onChange={(e) => handleLocationPresetChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  {USER_PRESET_LOCATIONS.map((loc) => (
                    <option key={loc.name} value={loc.city}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Authorization Status
                </label>
                <input
                  type="text"
                  value={profile.workAuthorization || 'US Citizen / Authorized'}
                  onChange={(e) => setProfile({ ...profile, workAuthorization: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                Professional Bio &amp; Summary
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Social & Portfolio Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Portfolio / Website
                </label>
                <input
                  type="text"
                  value={profile.portfolioUrl || ''}
                  onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={profile.linkedinUrl || ''}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Profile
                </label>
                <input
                  type="text"
                  value={profile.githubUrl || ''}
                  onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Work Experience */}
      {activeSubTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Professional Work Experience
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detail your previous employment, responsibilities, and achievements for recruiter reviews.
              </p>
            </div>

            <button
              onClick={() => setShowAddExp(!showAddExp)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Experience
            </button>
          </div>

          {/* Add Experience Form */}
          {showAddExp && (
            <form
              onSubmit={handleCreateExperience}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-300 dark:border-blue-700 p-5 shadow-sm space-y-3 text-xs"
            >
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                New Employment Position
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpRole}
                    onChange={(e) => setNewExpRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpCompany}
                    onChange={(e) => setNewExpCompany(e.target.value)}
                    placeholder="e.g. Acme Cloud Corp"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration Period
                  </label>
                  <input
                    type="text"
                    value={newExpPeriod}
                    onChange={(e) => setNewExpPeriod(e.target.value)}
                    placeholder="e.g. 2022 - Present"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newExpLoc}
                    onChange={(e) => setNewExpLoc(e.target.value)}
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Role Description &amp; Scope
                </label>
                <textarea
                  rows={2}
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  placeholder="Summarize key responsibilities..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Key Metric / Measurable Achievement
                </label>
                <input
                  type="text"
                  value={newExpAchievement}
                  onChange={(e) => setNewExpAchievement(e.target.value)}
                  placeholder="e.g. Scaled platform to 10M daily active users and improved latency by 35%"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExp(false)}
                  className="px-3.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Save Experience
                </button>
              </div>
            </form>
          )}

          {/* Experience List */}
          <div className="space-y-3">
            {(profile.experience || []).map((exp) => (
              <div
                key={exp.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {exp.role}
                    </h3>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">
                      {exp.company}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>{exp.period}</span>
                    {exp.location && (
                      <>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-500 dark:text-slate-400 space-y-0.5 pt-1">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="text-slate-400 hover:text-rose-600 transition self-start sm:self-auto p-1"
                  title="Delete experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Skills & Languages */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6">
          {/* Detailed Skills with Proficiency Level */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Technical Skills &amp; Proficiencies
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rate your key frameworks, languages, and architectures.
                </p>
              </div>

              <button
                onClick={() => setShowAddSkillDetailed(!showAddSkillDetailed)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </div>

            {showAddSkillDetailed && (
              <form
                onSubmit={handleCreateDetailedSkill}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSkillDetName}
                      onChange={(e) => setNewSkillDetName(e.target.value)}
                      placeholder="e.g. Next.js & Server Components"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Proficiency Level
                    </label>
                    <select
                      value={newSkillDetLevel}
                      onChange={(e) => setNewSkillDetLevel(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Expert">Expert (5+ yrs)</option>
                      <option value="Advanced">Advanced (3-5 yrs)</option>
                      <option value="Intermediate">Intermediate (1-3 yrs)</option>
                      <option value="Beginner">Beginner (&lt;1 yr)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSkillDetailed(false)}
                    className="px-3 py-1 text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(profile.skillsDetailed || []).map((s) => (
                <div
                  key={s.name}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      {s.name}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {s.level}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteDetailedSkill(s.name)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Skills Keyword Tags */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Quick Search &amp; Keyword Match Tags ({profile.skills.length})
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center gap-1.5"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkillTag(skill)}
                      className="hover:text-rose-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddSkillTag} className="flex gap-2">
                <input
                  type="text"
                  value={newSkillTag}
                  onChange={(e) => setNewSkillTag(e.target.value)}
                  placeholder="Add skill tag (e.g. PyTorch, GraphQL, Redis)..."
                  className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white w-64"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 rounded-xl"
                >
                  + Add Tag
                </button>
              </form>
            </div>
          </div>

          {/* Languages Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Spoken Languages
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Global and multilingual communication proficiencies.
                </p>
              </div>

              <button
                onClick={() => setShowAddLang(!showAddLang)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Language
              </button>
            </div>

            {showAddLang && (
              <form
                onSubmit={handleCreateLang}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Language *
                    </label>
                    <input
                      type="text"
                      required
                      value={newLangName}
                      onChange={(e) => setNewLangName(e.target.value)}
                      placeholder="e.g. German, Japanese, Spanish"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Proficiency
                    </label>
                    <select
                      value={newLangProficiency}
                      onChange={(e) => setNewLangProficiency(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Native">Native / Bilingual</option>
                      <option value="Fluent">Fluent Professional</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Basic">Basic Elementary</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLang(false)}
                    className="px-3 py-1 text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(profile.languages || []).map((l) => (
                <div
                  key={l.language}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      {l.language}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {l.proficiency}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteLang(l.language)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Education & Certifications */}
      {activeSubTab === 'education' && (
        <div className="space-y-6">
          {/* Education List */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Education &amp; Degrees
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Universities, colleges, and academic degrees.
                </p>
              </div>

              <button
                onClick={() => setShowAddEdu(!showAddEdu)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Education
              </button>
            </div>

            {showAddEdu && (
              <form
                onSubmit={handleCreateEducation}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Degree / Qualification *
                    </label>
                    <input
                      type="text"
                      required
                      value={newEduDegree}
                      onChange={(e) => setNewEduDegree(e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Institution / University *
                    </label>
                    <input
                      type="text"
                      required
                      value={newEduInst}
                      onChange={(e) => setNewEduInst(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      value={newEduYear}
                      onChange={(e) => setNewEduYear(e.target.value)}
                      placeholder="e.g. 2018 - 2022"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={newEduField}
                      onChange={(e) => setNewEduField(e.target.value)}
                      placeholder="e.g. Artificial Intelligence"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      GPA / Honors
                    </label>
                    <input
                      type="text"
                      value={newEduGpa}
                      onChange={(e) => setNewEduGpa(e.target.value)}
                      placeholder="e.g. 3.9 / 4.0"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEdu(false)}
                    className="px-3 py-1 text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Education
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {(profile.education || []).map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {edu.degree}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                      {edu.institution} • {edu.year}
                    </p>
                    {edu.fieldOfStudy && (
                      <p className="text-[11px] text-slate-500">
                        {edu.fieldOfStudy} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications List */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Industry Certifications &amp; Licenses
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cloud certificates, Kubernetes qualifications, and security verifications.
                </p>
              </div>

              <button
                onClick={() => setShowAddCert(!showAddCert)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Certificate
              </button>
            </div>

            {showAddCert && (
              <form
                onSubmit={handleCreateCert}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                      placeholder="e.g. AWS Solutions Architect"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Issuing Authority *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Year Issued
                    </label>
                    <input
                      type="text"
                      value={newCertYear}
                      onChange={(e) => setNewCertYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCert(false)}
                    className="px-3 py-1 text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Certificate
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(profile.certifications || []).map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.issuer} • {c.year}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCert(c.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: Job Preferences & Salary Expectations */}
      {activeSubTab === 'preferences' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Employment Preferences &amp; Compensation Target
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Minimum Annual Compensation ($ USD)
              </label>
              <input
                type="number"
                step="5000"
                value={profile.expectedSalaryMin}
                onChange={(e) => setProfile({ ...profile, expectedSalaryMin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Annual Compensation ($ USD)
              </label>
              <input
                type="number"
                step="5000"
                value={profile.expectedSalaryMax}
                onChange={(e) => setProfile({ ...profile, expectedSalaryMax: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notice Period
              </label>
              <input
                type="text"
                value={profile.noticePeriod || '2 weeks'}
                onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Years of Total Professional Experience
              </label>
              <input
                type="number"
                value={profile.yearsOfExperience || 7}
                onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.openToRemote}
                onChange={(e) => setProfile({ ...profile, openToRemote: e.target.checked })}
                className="w-4 h-4 rounded-sm accent-blue-600"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Open to 100% Remote Opportunities (Shows Remote filter by default)
              </span>
            </label>
          </div>
        </div>
      )}

    </div>
  );
};
