import React, { useState, useMemo } from 'react';
import { Enterprise, EnterpriseAnnouncement, Job } from '../types/job';
import {
  Building2,
  Megaphone,
  Plus,
  Pin,
  Trash2,
  Edit3,
  ExternalLink,
  Heart,
  Eye,
  Send,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  MapPin,
  Briefcase,
  AlertCircle,
  Share2,
  Check,
  ChevronDown,
  Server
} from 'lucide-react';

interface EnterprisePanelProps {
  enterprises: Enterprise[];
  currentEnterpriseId: string;
  onSelectEnterpriseId: (id: string) => void;
  jobs: Job[];
  onPostAnnouncement: (ann: EnterpriseAnnouncement, broadcastToCandidates?: boolean) => void;
  onUpdateAnnouncement: (ann: EnterpriseAnnouncement) => void;
  onDeleteAnnouncement: (annId: string) => void;
  onTogglePinAnnouncement: (annId: string) => void;
  onBroadcastAnnouncement: (ann: EnterpriseAnnouncement) => void;
  onViewPublicPage: (enterprise: Enterprise) => void;
  onUpdateEnterpriseProfile?: (enterpriseId: string, updates: Partial<Enterprise>) => void;
  onOpenLaragonModal?: () => void;
}

export const EnterprisePanel: React.FC<EnterprisePanelProps> = ({
  enterprises,
  currentEnterpriseId,
  onSelectEnterpriseId,
  jobs,
  onPostAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onTogglePinAnnouncement,
  onBroadcastAnnouncement,
  onViewPublicPage,
  onUpdateEnterpriseProfile,
  onOpenLaragonModal,
}) => {
  // Current active enterprise being managed
  const currentEnterprise = useMemo(() => {
    return enterprises.find((e) => e.id === currentEnterpriseId) || enterprises[0];
  }, [enterprises, currentEnterpriseId]);

  // Jobs belonging to this enterprise
  const enterpriseJobs = useMemo(() => {
    if (!currentEnterprise) return [];
    return jobs.filter(
      (j) =>
        (j.companyId && j.companyId === currentEnterprise.id) ||
        j.company.toLowerCase().includes(currentEnterprise.name.toLowerCase())
    );
  }, [jobs, currentEnterprise]);

  // Tab states
  const [panelTab, setPanelTab] = useState<'announcements' | 'preview' | 'analytics' | 'profile'>('announcements');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pinned' | 'active'>('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<EnterpriseAnnouncement | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState<string | null>(null);

  // Form states for Create
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EnterpriseAnnouncement['category']>('Hiring Blitz');
  const [newContent, setNewContent] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkText, setNewLinkText] = useState('');
  const [newPinned, setNewPinned] = useState(false);
  const [newTargetAudience, setNewTargetAudience] = useState('All Candidates');
  const [newRelatedJobId, setNewRelatedJobId] = useState('');
  const [newBroadcastInstant, setNewBroadcastInstant] = useState(true);

  // Form states for Edit
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<EnterpriseAnnouncement['category']>('General');
  const [editContent, setEditContent] = useState('');
  const [editLinkUrl, setEditLinkUrl] = useState('');
  const [editLinkText, setEditLinkText] = useState('');
  const [editPinned, setEditPinned] = useState(false);
  const [editTargetAudience, setEditTargetAudience] = useState('All Candidates');
  const [editRelatedJobId, setEditRelatedJobId] = useState('');

  // Form states for Company Profile tab
  const [profileHeadline, setProfileHeadline] = useState(currentEnterprise?.headline || '');
  const [profileWebsite, setProfileWebsite] = useState(currentEnterprise?.website || '');
  const [profileDescription, setProfileDescription] = useState(currentEnterprise?.description || '');
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Update profile edit fields when enterprise changes
  React.useEffect(() => {
    if (currentEnterprise) {
      setProfileHeadline(currentEnterprise.headline);
      setProfileWebsite(currentEnterprise.website);
      setProfileDescription(currentEnterprise.description);
    }
  }, [currentEnterprise]);

  // Announcements of the selected enterprise
  const announcements = currentEnterprise?.announcements || [];

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ann.title.toLowerCase().includes(q);
        const matchContent = ann.content.toLowerCase().includes(q);
        if (!matchTitle && !matchContent) return false;
      }
      if (categoryFilter !== 'All' && ann.category !== categoryFilter) {
        return false;
      }
      if (statusFilter === 'pinned' && !ann.pinned) {
        return false;
      }
      return true;
    });
  }, [announcements, searchQuery, categoryFilter, statusFilter]);

  // Analytics aggregates
  const totalLikes = announcements.reduce((sum, a) => sum + (a.likesCount || 0), 0);
  const totalImpressions = announcements.reduce((sum, a) => sum + (a.impressionsCount || (a.likesCount ? a.likesCount * 14 : 120)), 0);
  const pinnedCount = announcements.filter((a) => a.pinned).length;

  // Open Edit Modal
  const handleOpenEdit = (ann: EnterpriseAnnouncement) => {
    setEditingAnnouncement(ann);
    setEditTitle(ann.title);
    setEditCategory(ann.category);
    setEditContent(ann.content);
    setEditLinkUrl(ann.linkUrl || '');
    setEditLinkText(ann.linkText || '');
    setEditPinned(Boolean(ann.pinned));
    setEditTargetAudience(ann.targetAudience || 'All Candidates');
    setEditRelatedJobId(ann.relatedJobId || '');
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !currentEnterprise) return;

    const created: EnterpriseAnnouncement = {
      id: `ann-${Date.now()}`,
      enterpriseId: currentEnterprise.id,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      date: 'Just now',
      authorName: 'Talent & Hiring Team',
      authorRole: `${currentEnterprise.name} Official`,
      pinned: newPinned,
      linkUrl: newLinkUrl.trim() || undefined,
      linkText: newLinkText.trim() || (newLinkUrl.trim() ? 'Learn More' : undefined),
      likesCount: 1,
      impressionsCount: 24,
      targetAudience: newTargetAudience,
      relatedJobId: newRelatedJobId || undefined,
      status: 'published',
    };

    onPostAnnouncement(created, newBroadcastInstant);

    // Reset create state
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
    setNewLinkUrl('');
    setNewLinkText('');
    setNewPinned(false);
    setNewTargetAudience('All Candidates');
    setNewRelatedJobId('');

    setBroadcastSuccessNotice(`Announcement "${created.title}" published successfully.`);
    setTimeout(() => setBroadcastSuccessNotice(null), 4000);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editTitle.trim() || !editContent.trim()) return;

    const updated: EnterpriseAnnouncement = {
      ...editingAnnouncement,
      title: editTitle.trim(),
      category: editCategory,
      content: editContent.trim(),
      pinned: editPinned,
      linkUrl: editLinkUrl.trim() || undefined,
      linkText: editLinkText.trim() || undefined,
      targetAudience: editTargetAudience,
      relatedJobId: editRelatedJobId || undefined,
    };

    onUpdateAnnouncement(updated);
    setEditingAnnouncement(null);

    setBroadcastSuccessNotice(`Announcement updated.`);
    setTimeout(() => setBroadcastSuccessNotice(null), 3000);
  };

  // Instant Broadcast Trigger
  const handleTriggerBroadcast = (ann: EnterpriseAnnouncement) => {
    onBroadcastAnnouncement(ann);
    setBroadcastSuccessNotice(`Live notification alert dispatched to candidates for "${ann.title}".`);
    setTimeout(() => setBroadcastSuccessNotice(null), 4500);
  };

  // Save company profile updates
  const handleSaveProfileUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEnterprise || !onUpdateEnterpriseProfile) return;

    onUpdateEnterpriseProfile(currentEnterprise.id, {
      headline: profileHeadline.trim(),
      website: profileWebsite.trim(),
      description: profileDescription.trim(),
    });

    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 3000);
  };

  const getCategoryBadgeClass = (cat: EnterpriseAnnouncement['category']) => {
    switch (cat) {
      case 'Hiring Blitz':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Company Milestone':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'Tech Talk':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Workplace & Culture':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Product Launch':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  if (!currentEnterprise) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500">No enterprise accounts available.</p>
      </div>
    );
  }

  return (
    <div id="enterprise-panel-root" className="space-y-6">
      
      {/* Top Banner: Enterprise Identity & Switcher */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-md border border-slate-200 dark:border-slate-700 shrink-0">
              <img
                src={currentEnterprise.logo}
                alt={currentEnterprise.name}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Enterprise Management Portal
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Announcement Feed
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentEnterprise.name}
                </h1>
                {currentEnterprise.verified && (
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                {currentEnterprise.headline}
              </p>
            </div>
          </div>

          {/* Right Controls: Enterprise Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Enterprise Selector */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-2xl px-3 py-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <div className="text-left">
                <span className="text-[10px] block font-bold text-slate-400 uppercase leading-none">
                  Managing Company
                </span>
                <select
                  value={currentEnterprise.id}
                  onChange={(e) => onSelectEnterpriseId(e.target.value)}
                  className="text-xs font-extrabold bg-transparent text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                >
                  {enterprises.map((ent) => (
                    <option key={ent.id} value={ent.id} className="text-slate-900 dark:text-slate-900">
                      {ent.name} ({ent.announcements.length} announcements)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Public Page Button */}
            <button
              id="btn-view-public-enterprise"
              onClick={() => onViewPublicPage(currentEnterprise)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Page</span>
            </button>

            {/* Laragon Local Testing Button */}
            {onOpenLaragonModal && (
              <button
                id="btn-enterprise-laragon-hub"
                onClick={onOpenLaragonModal}
                className="px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Open Laragon & Localhost Hub for local prototyping & testing"
              >
                <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Laragon Local Testing</span>
              </button>
            )}

            {/* New Announcement Button */}
            <button
              id="btn-create-announcement"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post Announcement</span>
            </button>
          </div>

        </div>

        {/* Aggregate KPI Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              Active Announcements
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {announcements.length}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              Pinned Priorities
            </span>
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 block">
              {pinnedCount}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              Candidate Likes
            </span>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5 block">
              {totalLikes}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              Candidate Impressions
            </span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {totalImpressions.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* Broadcast Alert Feedback Toast */}
      {broadcastSuccessNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{broadcastSuccessNotice}</span>
        </div>
      )}

      {/* Panel Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            id="tab-manage-announcements"
            onClick={() => setPanelTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              panelTab === 'announcements'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Manage Announcements ({announcements.length})</span>
          </button>

          <button
            id="tab-candidate-preview"
            onClick={() => setPanelTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              panelTab === 'preview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Candidate Feed Preview</span>
          </button>

          <button
            id="tab-enterprise-analytics"
            onClick={() => setPanelTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              panelTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engagement Analytics</span>
          </button>

          <button
            id="tab-enterprise-profile"
            onClick={() => setPanelTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              panelTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Presence & Culture</span>
          </button>
        </div>

        {/* Fast Action */}
        {panelTab === 'announcements' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 border border-blue-200 dark:border-blue-900/60"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Announcement</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: MANAGE ANNOUNCEMENTS */}
      {panelTab === 'announcements' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 transition-colors">
            
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search announcements..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {['All', 'Hiring Blitz', 'Company Milestone', 'Tech Talk', 'Workplace & Culture', 'Product Launch'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setStatusFilter(statusFilter === 'pinned' ? 'all' : 'pinned')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                  statusFilter === 'pinned'
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                <span>Pinned Only ({pinnedCount})</span>
              </button>
            </div>

          </div>

          {/* Announcements List */}
          {filteredAnnouncements.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No announcements found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || categoryFilter !== 'All' || statusFilter !== 'all'
                  ? 'No announcements match your filter criteria. Try clearing search.'
                  : `Publish your first announcement to share hiring blitzes, webinars, or milestone updates with candidates.`}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Announcement</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnnouncements.map((ann) => {
                const linkedJob = ann.relatedJobId ? jobs.find((j) => j.id === ann.relatedJobId) : null;

                return (
                  <div
                    key={ann.id}
                    id={`ann-panel-item-${ann.id}`}
                    className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                      ann.pinned
                        ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/10'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    
                    {/* Left: Content & Meta */}
                    <div className="space-y-2 flex-1">
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {ann.pinned && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            Pinned Priority
                          </span>
                        )}

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeClass(ann.category)}`}>
                          {ann.category}
                        </span>

                        {ann.targetAudience && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Target: {ann.targetAudience}
                          </span>
                        )}

                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {ann.date}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {ann.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                        {ann.content}
                      </p>

                      {/* Associated Link or Job Link */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {ann.linkUrl && (
                          <a
                            href={ann.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span>{ann.linkText || 'Open Action Link'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {linkedJob && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            <Briefcase className="w-3 h-3" />
                            Linked Role: {linkedJob.title}
                          </span>
                        )}
                      </div>

                      {/* Performance Metas */}
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          {ann.likesCount || 0} candidate likes
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          {ann.impressionsCount || 140} candidate impressions
                        </span>
                        <span>Author: {ann.authorName}</span>
                      </div>

                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-start pt-2 md:pt-0">
                      {/* Pin/Unpin Toggle */}
                      <button
                        onClick={() => onTogglePinAnnouncement(ann.id)}
                        className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                          ann.pinned
                            ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                        title={ann.pinned ? 'Unpin announcement' : 'Pin to top of page'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${ann.pinned ? 'fill-amber-500' : ''}`} />
                        <span className="hidden sm:inline">{ann.pinned ? 'Pinned' : 'Pin'}</span>
                      </button>

                      {/* Push to Candidate Alert Gateway */}
                      <button
                        onClick={() => handleTriggerBroadcast(ann)}
                        className="p-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 transition flex items-center gap-1"
                        title="Broadcast alert to candidate notification feeds"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Push Alert</span>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(ann)}
                        className="p-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
                        title="Edit announcement"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteConfirmId(ann.id)}
                        className="p-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: LIVE CANDIDATE FEED PREVIEW */}
      {panelTab === 'preview' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200 uppercase tracking-wide">
                Candidate Feed Simulation
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                This is how announcements appear to candidates visiting {currentEnterprise.name}'s official hub.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Interactive Preview
            </span>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentEnterprise.logo}
                      alt={currentEnterprise.name}
                      className="w-10 h-10 rounded-xl object-cover p-1 bg-white border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {currentEnterprise.name}
                        </span>
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        {ann.date} • {ann.category}
                      </span>
                    </div>
                  </div>

                  {ann.pinned && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      Pinned
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>

                {ann.linkUrl && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                      <span>{ann.linkText || 'Learn More'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-rose-600 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      {ann.likesCount || 0}
                    </span>
                    <span>candidate likes</span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Official Enterprise Broadcast
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENGAGEMENT ANALYTICS */}
      {panelTab === 'analytics' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Candidate Reach &amp; Announcement Engagement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live metrics across candidate notification impressions, bookmarking rates, and direct applications generated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                Announcement Conversion Rate
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                24.8%
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Candidates viewing announcements who proceed to 1-Click apply to linked positions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                Total Talent Followers
              </span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
                {(currentEnterprise.followerCount || 240).toLocaleString()}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Subscribed candidate profiles receiving your instant push alerts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                Push Gateway Delivery
              </span>
              <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
                99.9%
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Real-time WebSocket &amp; browser notification dispatch rate.
              </p>
            </div>
          </div>

          {/* Announcement Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Performance by Announcement
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Announcement Title</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Audience</th>
                    <th className="px-3 py-3">Impressions</th>
                    <th className="px-3 py-3">Likes</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {announcements.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {a.title}
                      </td>
                      <td className="px-3 py-3 font-medium">
                        {a.category}
                      </td>
                      <td className="px-3 py-3 text-slate-500">
                        {a.targetAudience || 'All'}
                      </td>
                      <td className="px-3 py-3 font-extrabold text-blue-600 dark:text-blue-400">
                        {a.impressionsCount || 140}
                      </td>
                      <td className="px-3 py-3 font-extrabold text-rose-600 dark:text-rose-400">
                        {a.likesCount || 0}
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {a.pinned ? 'Pinned Live' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: COMPANY PROFILE & CULTURE SETTINGS */}
      {panelTab === 'profile' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Company Presence &amp; Culture Hub Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize your enterprise's public presentation, employee perks, and technology pillars.
            </p>
          </div>

          {profileSavedNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Company details updated successfully across candidate view.</span>
            </div>
          )}

          <form onSubmit={handleSaveProfileUpdates} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Headline *
              </label>
              <input
                type="text"
                required
                value={profileHeadline}
                onChange={(e) => setProfileHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Website URL
              </label>
              <input
                type="text"
                value={profileWebsite}
                onChange={(e) => setProfileWebsite(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Overview &amp; Mission Statement
              </label>
              <textarea
                rows={4}
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
              >
                Save Company Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CREATE ANNOUNCEMENT */}
      {showCreateModal && (
        <div 
          id="modal-create-announcement"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Publish Enterprise Announcement
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Posting officially as {currentEnterprise.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q3 Engineering Sprint: 15 New Systems Roles Opened"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
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

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newTargetAudience}
                    onChange={(e) => setNewTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  >
                    <option value="All Candidates">All Candidates</option>
                    <option value="Software Engineers">Software Engineers</option>
                    <option value="Machine Learning & AI">Machine Learning & AI</option>
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="Remote Talent">Remote Talent</option>
                    <option value="Product & Design">Product & Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Details &amp; Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe the opportunity, milestone highlights, event timing, or why candidates should connect with your team..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Optional Linked Open Job */}
              {enterpriseJobs.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Attach Open Position (Optional)
                  </label>
                  <select
                    value={newRelatedJobId}
                    onChange={(e) => setNewRelatedJobId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  >
                    <option value="">None (General announcement)</option>
                    {enterpriseJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.workplaceType})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Call-to-Action URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
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
                    value={newLinkText}
                    onChange={(e) => setNewLinkText(e.target.value)}
                    placeholder="e.g. Register Now / Apply"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Options: Pin and Push Notification */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={newPinned}
                    onChange={(e) => setNewPinned(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Pin announcement to top of {currentEnterprise.name}'s page 📌</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={newBroadcastInstant}
                    onChange={(e) => setNewBroadcastInstant(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Dispatch instant push notification alert to candidate network ⚡</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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

      {/* MODAL: EDIT ANNOUNCEMENT */}
      {editingAnnouncement && (
        <div 
          id="modal-edit-announcement"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Edit Announcement
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Modifying {editingAnnouncement.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingAnnouncement(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Hiring Blitz">Hiring Blitz</option>
                    <option value="Company Milestone">Company Milestone</option>
                    <option value="Tech Talk">Tech Talk / Webinar</option>
                    <option value="Workplace & Culture">Workplace & Culture</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="General">General Update</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={editTargetAudience}
                    onChange={(e) => setEditTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={editLinkUrl}
                    onChange={(e) => setEditLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Link Text
                  </label>
                  <input
                    type="text"
                    value={editLinkText}
                    onChange={(e) => setEditLinkText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={editPinned}
                    onChange={(e) => setEditPinned(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Pin announcement to top of company page</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAnnouncement(null)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Delete Announcement?
              </h3>
              <p className="text-slate-500 mt-1">
                Are you sure you want to remove this announcement? It will be removed from your company's profile and the candidate feed.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAnnouncement(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
