import React, { useState, useMemo } from 'react';
import { Enterprise, EnterpriseAnnouncement, Job } from '../types/job';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  Bell, 
  Briefcase, 
  Megaphone, 
  Plus, 
  Heart, 
  ArrowLeft, 
  ExternalLink, 
  Check, 
  Zap, 
  Sparkles, 
  Share2, 
  MessageSquare,
  Tag,
  Search,
  Filter
} from 'lucide-react';

interface EnterprisePageProps {
  enterprise: Enterprise;
  jobs: Job[];
  onBackToDirectory: () => void;
  onSelectJob: (job: Job) => void;
  onOneClickApply: (job: Job) => void;
  appliedJobIds: string[];
  onPostAnnouncement: (announcement: EnterpriseAnnouncement) => void;
  onToggleFollow: (enterpriseId: string) => void;
  onOpenEnterprisePanel?: (enterpriseId: string) => void;
}

export const EnterprisePage: React.FC<EnterprisePageProps> = ({
  enterprise,
  jobs,
  onBackToDirectory,
  onSelectJob,
  onOneClickApply,
  appliedJobIds,
  onPostAnnouncement,
  onToggleFollow,
  onOpenEnterprisePanel,
}) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'jobs' | 'about' | 'culture'>('announcements');
  const [showPostModal, setShowPostModal] = useState(false);
  
  // Announcement Post Form state
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<EnterpriseAnnouncement['category']>('Hiring Blitz');
  const [annContent, setAnnContent] = useState('');
  const [annLinkUrl, setAnnLinkUrl] = useState('');
  const [annLinkText, setAnnLinkText] = useState('');
  const [annPinned, setAnnPinned] = useState(false);
  const [likedAnnouncementIds, setLikedAnnouncementIds] = useState<string[]>([]);

  // Jobs belonging to this enterprise
  const enterpriseJobs = useMemo(() => {
    return jobs.filter(
      (j) => 
        (j.companyId && j.companyId === enterprise.id) ||
        j.company.toLowerCase().includes(enterprise.name.toLowerCase())
    );
  }, [jobs, enterprise]);

  const handleLikeAnnouncement = (annId: string) => {
    if (likedAnnouncementIds.includes(annId)) {
      setLikedAnnouncementIds((prev) => prev.filter((id) => id !== annId));
    } else {
      setLikedAnnouncementIds((prev) => [...prev, annId]);
    }
  };

  const handleSubmitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const newAnnouncement: EnterpriseAnnouncement = {
      id: `ann-${Date.now()}`,
      enterpriseId: enterprise.id,
      title: annTitle.trim(),
      category: annCategory,
      content: annContent.trim(),
      date: 'Just now',
      authorName: 'Recruitment & Talent Team',
      authorRole: `${enterprise.name} Official`,
      pinned: annPinned,
      linkUrl: annLinkUrl.trim() || undefined,
      linkText: annLinkText.trim() || (annLinkUrl.trim() ? 'Learn More' : undefined),
      likesCount: 1,
    };

    onPostAnnouncement(newAnnouncement);
    setShowPostModal(false);
    // Reset
    setAnnTitle('');
    setAnnContent('');
    setAnnLinkUrl('');
    setAnnLinkText('');
    setAnnPinned(false);
  };

  return (
    <div id="enterprise-detail-view" className="space-y-6">
      
      {/* Back to Directory Button */}
      <button
        id="back-to-enterprises-btn"
        onClick={onBackToDirectory}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Enterprises Directory
      </button>

      {/* Enterprise Header Hero Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors">
        
        {/* Cover Banner */}
        <div className="h-48 sm:h-64 w-full relative">
          <img
            src={enterprise.coverImage}
            alt={enterprise.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              id="enterprise-share-btn"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900/80 transition shadow-sm"
              title="Copy Profile Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <button
              id="enterprise-follow-btn"
              onClick={() => onToggleFollow(enterprise.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                enterprise.isFollowing
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {enterprise.isFollowing ? 'Following Updates' : 'Follow Announcements'}
            </button>
          </div>
        </div>

        {/* Profile Identity Bar */}
        <div className="p-6 sm:p-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-xl border border-slate-200 dark:border-slate-700 shrink-0">
                <img
                  src={enterprise.logo}
                  alt={enterprise.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {enterprise.name}
                  </h1>
                  {enterprise.verified && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      Verified Enterprise
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-2xl mt-0.5">
                  {enterprise.headline}
                </p>
              </div>
            </div>

            {/* Quick Actions: Post Announcement & Open Enterprise Panel */}
            <div className="flex flex-wrap items-center gap-2">
              {onOpenEnterprisePanel && (
                <button
                  id="open-enterprise-panel-btn"
                  onClick={() => onOpenEnterprisePanel(enterprise.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition flex items-center gap-1.5 shadow-2xs"
                  title="Open dedicated announcement management panel"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Enterprise Panel</span>
                </button>
              )}

              <button
                id="post-announcement-btn"
                onClick={() => setShowPostModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition flex items-center gap-1.5"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            </div>
          </div>

          {/* Quick Meta Data Chips */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {enterprise.industry}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              HQ: {enterprise.headquarters}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {enterprise.size}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Founded {enterprise.founded}
            </span>
            <a
              href={enterprise.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              <Globe className="w-3.5 h-3.5" />
              Official Website
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              id="enterprise-tab-announcements"
              onClick={() => setActiveTab('announcements')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'announcements'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              Announcements Board ({enterprise.announcements.length})
            </button>

            <button
              id="enterprise-tab-jobs"
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Open Positions ({enterpriseJobs.length})
            </button>

            <button
              id="enterprise-tab-about"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'about'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              About & Mission
            </button>

            <button
              id="enterprise-tab-culture"
              onClick={() => setActiveTab('culture')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'culture'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Perks & Culture
            </button>
          </div>

        </div>
      </div>

      {/* Tab 1: Official Announcements Feed */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Official Enterprise Announcements
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct broadcasts, hiring news, engineering spotlights, and updates from {enterprise.name}
              </p>
            </div>

            <button
              id="announcements-post-btn"
              onClick={() => setShowPostModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Pass Announcement
            </button>
          </div>

          {enterprise.announcements.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center text-slate-500">
              No announcements published yet. Be the first to publish an announcement!
            </div>
          ) : (
            <div className="space-y-3.5">
              {enterprise.announcements.map((ann) => {
                const isLiked = likedAnnouncementIds.includes(ann.id);
                const currentLikes = (ann.likesCount || 0) + (isLiked ? 1 : 0);

                let categoryBg = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
                if (ann.category === 'Hiring Blitz') {
                  categoryBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
                } else if (ann.category === 'Company Milestone') {
                  categoryBg = 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
                } else if (ann.category === 'Tech Talk') {
                  categoryBg = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
                }

                return (
                  <div
                    key={ann.id}
                    id={`announcement-${ann.id}`}
                    className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition ${
                      ann.pinned
                        ? 'border-blue-300 dark:border-blue-700 ring-1 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide ${categoryBg}`}>
                          {ann.category}
                        </span>
                        {ann.pinned && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center gap-1">
                            📌 Pinned Announcement
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-slate-400">
                        {ann.date}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {ann.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                      {ann.content}
                    </p>

                    {/* Announcement Footer: Author, Action Link, Like Button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                          {ann.authorName[0]}
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {ann.authorName}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 text-[11px]">
                          {ann.authorRole}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {ann.linkUrl && (
                          <a
                            href={ann.linkUrl}
                            onClick={(e) => {
                              if (ann.linkUrl === '#jobs') {
                                e.preventDefault();
                                setActiveTab('jobs');
                              }
                            }}
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 text-xs"
                          >
                            {ann.linkText || 'Read More'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <button
                          id={`like-ann-${ann.id}`}
                          onClick={() => handleLikeAnnouncement(ann.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            isLiked
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                          <span>{currentLikes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Open Roles from this Enterprise */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Active Open Roles ({enterpriseJobs.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Apply directly to positions verified and hiring at {enterprise.name}
              </p>
            </div>
          </div>

          {enterpriseJobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center text-slate-500">
              No active job openings currently listed for this enterprise. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enterpriseJobs.map((job) => {
                const isApplied = appliedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4 shadow-xs hover:border-blue-400 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {job.department}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                            {job.title}
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          {job.matchScore}% Match
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location} ({job.workplaceType})
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                        </span>
                        <span>•</span>
                        <span>{job.jobType}</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectJob(job)}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600"
                      >
                        View Full Specs
                      </button>

                      {isApplied ? (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => onOneClickApply(job)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          1-Click Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: About & Mission */}
      {activeTab === 'about' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              About {enterprise.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {enterprise.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Core Technologies & Architecture
            </h4>
            <div className="flex flex-wrap gap-2">
              {enterprise.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Perks & Culture */}
      {activeTab === 'culture' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3">
              Benefits & Employee Perks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enterprise.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Culture Pillars
            </h4>
            <div className="space-y-2">
              {enterprise.cultureHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Post New Announcement */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Publish Official Announcement
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Posting as {enterprise.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAnnouncement} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Q3 Engineering Hiring Blitz: 20 New Roles Opened"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Category
                  </label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Hiring Blitz">Hiring Blitz</option>
                    <option value="Company Milestone">Company Milestone</option>
                    <option value="Tech Talk">Tech Talk / Webinar</option>
                    <option value="Workplace & Culture">Workplace & Culture</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="General">General Update</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={annPinned}
                      onChange={(e) => setAnnPinned(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    <span>Pin to top of page 📌</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Provide context, details, open role areas, or milestone notes for candidates..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Optional Action Link URL
                  </label>
                  <input
                    type="text"
                    value={annLinkUrl}
                    onChange={(e) => setAnnLinkUrl(e.target.value)}
                    placeholder="https://... or #jobs"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={annLinkText}
                    onChange={(e) => setAnnLinkText(e.target.value)}
                    placeholder="e.g. View Roles / Register"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

interface EnterpriseDirectoryProps {
  enterprises: Enterprise[];
  onSelectEnterprise: (enterprise: Enterprise) => void;
  onToggleFollow: (enterpriseId: string) => void;
  onOpenEnterprisePanel?: (enterpriseId?: string) => void;
}

export const EnterpriseDirectory: React.FC<EnterpriseDirectoryProps> = ({
  enterprises,
  onSelectEnterprise,
  onToggleFollow,
  onOpenEnterprisePanel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = useMemo(() => {
    const set = new Set(enterprises.map((e) => e.industry));
    return ['All', ...Array.from(set)];
  }, [enterprises]);

  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((e) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = e.name.toLowerCase().includes(q);
        const matchHq = e.headquarters.toLowerCase().includes(q);
        const matchIndustry = e.industry.toLowerCase().includes(q);
        if (!matchName && !matchHq && !matchIndustry) return false;
      }
      if (selectedIndustry !== 'All' && e.industry !== selectedIndustry) {
        return false;
      }
      return true;
    });
  }, [enterprises, searchTerm, selectedIndustry]);

  return (
    <div id="enterprise-directory-container" className="space-y-6">
      
      {/* Directory Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                Verified Hiring Network
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {enterprises.length} Global Employers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Enterprise Hub & Official Pages
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Explore enterprise headquarters, follow company announcements, read direct hiring updates, and apply directly to verified teams.
            </p>
          </div>

          {/* Search, Filter & Enterprise Panel Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search enterprise or HQ..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white font-medium"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === 'All' ? 'All Industries' : ind}
                </option>
              ))}
            </select>

            {onOpenEnterprisePanel && (
              <button
                id="btn-directory-open-enterprise-panel"
                onClick={() => onOpenEnterprisePanel()}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Enterprise Panel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enterprises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEnterprises.map((ent) => {
          const latestAnnouncement = ent.announcements[0];

          return (
            <div
              key={ent.id}
              id={`enterprise-card-${ent.id}`}
              onClick={() => onSelectEnterprise(ent)}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Mini Cover */}
                <div className="h-28 w-full relative">
                  <img
                    src={ent.coverImage}
                    alt={ent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFollow(ent.id);
                    }}
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold transition shadow-xs flex items-center gap-1 ${
                      ent.isFollowing
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/90 text-slate-800 hover:bg-white'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    {ent.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-5 pt-0 relative">
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 p-1 shadow-md border border-slate-200 dark:border-slate-700 -mt-7 mb-3 shrink-0">
                    <img
                      src={ent.logo}
                      alt={ent.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {ent.name}
                    </h3>
                    {ent.verified && (
                      <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {ent.industry}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {ent.headline}
                  </p>

                  {/* Latest Announcement Preview */}
                  {latestAnnouncement && (
                    <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 font-bold mb-1">
                        <Megaphone className="w-3 h-3" />
                        <span>Latest Announcement</span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {latestAnnouncement.title}
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {ent.headquarters}
                </span>

                <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Visit Page →
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
