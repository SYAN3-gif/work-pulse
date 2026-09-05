import React, { useState, useMemo } from 'react';
import { Job, WorkplaceType, JobType, ExperienceLevel } from '../types/job';
import { CITIES_LIST } from '../data/mockData';
import { JobCard } from './JobCard';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Sparkles, 
  RotateCcw, 
  Building2, 
  DollarSign, 
  Check, 
  Globe, 
  Compass
} from 'lucide-react';

interface JobSearchSectionProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onOneClickApply: (job: Job) => void;
  bookmarkedJobIds: string[];
  onToggleBookmark: (jobId: string) => void;
  appliedJobIds: string[];
}

export const JobSearchSection: React.FC<JobSearchSectionProps> = ({
  jobs,
  onSelectJob,
  onOneClickApply,
  bookmarkedJobIds,
  onToggleBookmark,
  appliedJobIds,
}) => {
  // Filters state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedRadius, setSelectedRadius] = useState('Exact location');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('All');
  const [selectedJobType, setSelectedJobType] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<string>('All');
  const [minSalary, setMinSalary] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'salary'>('match');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter computation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Keyword match (title, company, description, requirements)
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesDept = job.department.toLowerCase().includes(query);
        const matchesReqs = job.requirements.some((r) => r.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesDept && !matchesReqs) {
          return false;
        }
      }

      // Location match
      if (selectedLocation !== 'All Locations') {
        if (selectedLocation === 'Remote') {
          if (job.workplaceType !== 'Remote') return false;
        } else {
          if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }
      }

      // Workplace type
      if (selectedWorkplace !== 'All') {
        if (job.workplaceType !== selectedWorkplace) return false;
      }

      // Job type
      if (selectedJobType !== 'All') {
        if (job.jobType !== selectedJobType) return false;
      }

      // Experience level
      if (selectedExp !== 'All') {
        if (job.experienceLevel !== selectedExp) return false;
      }

      // Min salary filter
      if (minSalary > 0) {
        if (job.salaryMax < minSalary) return false;
      }

      // Only bookmarked
      if (onlyBookmarked && !bookmarkedJobIds.includes(job.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'salary') return b.salaryMax - a.salaryMax;
      return 0; // Default/recent
    });
  }, [
    jobs,
    searchKeyword,
    selectedLocation,
    selectedWorkplace,
    selectedJobType,
    selectedExp,
    minSalary,
    sortBy,
    onlyBookmarked,
    bookmarkedJobIds,
  ]);

  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedLocation('All Locations');
    setSelectedRadius('Exact location');
    setSelectedWorkplace('All');
    setSelectedJobType('All');
    setSelectedExp('All');
    setMinSalary(0);
    setOnlyBookmarked(false);
  };

  const hasActiveFilters =
    searchKeyword !== '' ||
    selectedLocation !== 'All Locations' ||
    selectedWorkplace !== 'All' ||
    selectedJobType !== 'All' ||
    selectedExp !== 'All' ||
    minSalary > 0 ||
    onlyBookmarked;

  return (
    <div id="job-search-section" className="space-y-6">
      
      {/* Search Bar & Primary Location Filter Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Keyword Input */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="job-keyword-search-input"
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Job title, skills (e.g. React, Python), or company..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition"
            />
          </div>

          {/* Location Dropdown Filter */}
          <div className="md:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              id="job-location-select-input"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition text-slate-800 dark:text-slate-100 appearance-none font-medium"
            >
              {CITIES_LIST.map((city) => (
                <option key={city} value={city} className="dark:bg-slate-900 dark:text-white">
                  {city}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-xs">
              ▼
            </div>
          </div>

          {/* Location Radius */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              id="location-radius-select"
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="Exact location" className="dark:bg-slate-900">Exact location</option>
              <option value="+10 miles" className="dark:bg-slate-900">+10 miles radius</option>
              <option value="+25 miles" className="dark:bg-slate-900">+25 miles radius</option>
              <option value="+50 miles" className="dark:bg-slate-900">+50 miles radius</option>
              <option value="+100 miles" className="dark:bg-slate-900">+100 miles radius</option>
            </select>
            
            <button
              id="toggle-advanced-filters-btn"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2.5 rounded-xl border transition shrink-0 ${
                showAdvancedFilters || hasActiveFilters
                  ? 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="More Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Quick Workplace Pills (Remote, Hybrid, On-site) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-semibold mr-1">Workplace:</span>
            {['All', 'Remote', 'Hybrid', 'On-site'].map((type) => (
              <button
                key={type}
                id={`filter-workplace-${type.toLowerCase()}`}
                onClick={() => setSelectedWorkplace(type)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedWorkplace === type
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type === 'Remote' ? '🌍 Remote Only' : type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="filter-only-saved-btn"
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                onlyBookmarked
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Saved Jobs ({bookmarkedJobIds.length})
            </button>

            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filters (Salary slider, Experience, Job Type) */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in">
            {/* Salary Range */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Minimum Salary:</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                  {minSalary === 0 ? 'Any' : `$${(minSalary / 1000).toFixed(0)}k+`}
                </span>
              </div>
              <input
                id="min-salary-slider"
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                <span>$0</span>
                <span>$100k</span>
                <span>$200k+</span>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Experience Level
              </label>
              <select
                id="filter-exp-select"
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 font-medium"
              >
                <option value="All">All Experience Levels</option>
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Architect</option>
              </select>
            </div>

            {/* Job Type */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Commitment Type
              </label>
              <select
                id="filter-jobtype-select"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 font-medium"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* Results Header: Count and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover Opportunities
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
            {filteredJobs.length} available
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
          <div className="flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            <button
              id="sort-by-match-btn"
              onClick={() => setSortBy('match')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                sortBy === 'match'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Best Match
            </button>
            <button
              id="sort-by-salary-btn"
              onClick={() => setSortBy('salary')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                sortBy === 'salary'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Highest Compensation
            </button>
            <button
              id="sort-by-recent-btn"
              onClick={() => setSortBy('recent')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                sortBy === 'recent'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Newest First
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matching positions found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search keywords, location filters, or expanding the radius distance.
          </p>
          <button
            id="empty-reset-filters-btn"
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelectJob={onSelectJob}
              onOneClickApply={onOneClickApply}
              isBookmarked={bookmarkedJobIds.includes(job.id)}
              onToggleBookmark={onToggleBookmark}
              isApplied={appliedJobIds.includes(job.id)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
