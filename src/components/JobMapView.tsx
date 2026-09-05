import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job, UserProfile } from '../types/job';
import { 
  GeoCoordinate, 
  USER_PRESET_LOCATIONS, 
  calculateDistanceMiles, 
  getCommuteEstimate, 
  classifyProximity,
  ProximityClassification
} from '../utils/geo';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Crosshair, 
  Zap, 
  Clock, 
  Building2, 
  DollarSign, 
  ExternalLink, 
  Check, 
  Car, 
  Train, 
  Laptop, 
  Search, 
  Filter,
  CheckCircle2,
  Bookmark,
  Layers,
  ArrowRight
} from 'lucide-react';

interface JobMapViewProps {
  jobs: Job[];
  userProfile?: UserProfile;
  userLocationName?: string;
  userCoords?: GeoCoordinate;
  onSelectJob: (job: Job) => void;
  onOneClickApply: (job: Job) => void;
  onNavigateToEnterprise?: (companyId: string) => void;
  bookmarkedJobIds?: string[];
  appliedJobIds?: string[];
  onToggleBookmark?: (jobId: string) => void;
  isDarkMode?: boolean;
}

export const JobMapView: React.FC<JobMapViewProps> = ({
  jobs,
  userProfile,
  userLocationName = 'San Francisco, CA',
  userCoords = { latitude: 37.7749, longitude: -122.4194 },
  onSelectJob,
  onOneClickApply,
  onNavigateToEnterprise,
  bookmarkedJobIds = [],
  appliedJobIds = [],
  onToggleBookmark,
  isDarkMode = false,
}) => {
  // Map element & instance refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Active user location state
  const [currentUserLocation, setCurrentUserLocation] = useState<{
    name: string;
    coords: GeoCoordinate;
  }>({
    name: userProfile?.location || userLocationName,
    coords: userCoords,
  });

  // UI States
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);
  const [proximityFilter, setProximityFilter] = useState<'all' | 'very_close' | 'nearby' | 'far' | 'remote'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRings, setShowRings] = useState(true);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Synchronize location if userProfile updates
  useEffect(() => {
    if (userProfile?.location && userProfile.location !== currentUserLocation.name) {
      const match = USER_PRESET_LOCATIONS.find((p) => p.city.toLowerCase() === userProfile.location.toLowerCase());
      if (match) {
        setCurrentUserLocation({ name: match.name, coords: match.coords });
      }
    }
  }, [userProfile?.location]);

  // Compute distances & proximity for all jobs
  const jobsWithGeo = useMemo(() => {
    return jobs.map((job) => {
      const jobCoords: GeoCoordinate = {
        latitude: job.latitude ?? 37.7749,
        longitude: job.longitude ?? -122.4194,
      };

      const isRemote = job.workplaceType === 'Remote';
      const distance = isRemote ? 0 : calculateDistanceMiles(currentUserLocation.coords, jobCoords);
      const proximity: ProximityClassification = classifyProximity(distance, job.workplaceType);
      const commute = getCommuteEstimate(distance, job.workplaceType);

      return {
        ...job,
        computedDistance: distance,
        computedProximity: proximity,
        computedCommute: commute,
        coordinates: jobCoords,
      };
    });
  }, [jobs, currentUserLocation]);

  // Filtered and sorted jobs list
  const filteredJobs = useMemo(() => {
    return jobsWithGeo
      .filter((job) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.company.toLowerCase().includes(q);
          const matchLoc = job.location.toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchLoc) return false;
        }

        if (proximityFilter === 'very_close') return job.computedProximity === 'very_close';
        if (proximityFilter === 'nearby') return job.computedProximity === 'nearby';
        if (proximityFilter === 'far') return job.computedProximity === 'far';
        if (proximityFilter === 'remote') return job.workplaceType === 'Remote';

        return true;
      })
      .sort((a, b) => {
        // Closest physical jobs first, remote placed with low commute
        if (a.workplaceType === 'Remote' && b.workplaceType !== 'Remote') return 1;
        if (b.workplaceType === 'Remote' && a.workplaceType !== 'Remote') return -1;
        return a.computedDistance - b.computedDistance;
      });
  }, [jobsWithGeo, searchQuery, proximityFilter]);

  // Proximity Counts
  const counts = useMemo(() => {
    return {
      all: jobsWithGeo.length,
      very_close: jobsWithGeo.filter((j) => j.computedProximity === 'very_close').length,
      nearby: jobsWithGeo.filter((j) => j.computedProximity === 'nearby').length,
      far: jobsWithGeo.filter((j) => j.computedProximity === 'far').length,
      remote: jobsWithGeo.filter((j) => j.workplaceType === 'Remote').length,
    };
  }, [jobsWithGeo]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentUserLocation.coords.latitude, currentUserLocation.coords.longitude],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // CartoDB tiles (clean, professional, non-commercial open license)
      const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tiles = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tiles;
      markersLayerRef.current = L.layerGroup().addTo(map);
      circlesLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when Dark Mode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [isDarkMode]);

  // Update Range Radii Circles & User Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    const circlesLayer = circlesLayerRef.current;
    if (!map || !circlesLayer) return;

    circlesLayer.clearLayers();

    const userLat = currentUserLocation.coords.latitude;
    const userLng = currentUserLocation.coords.longitude;

    // Draw Commute Range Radii
    if (showRings) {
      // 15 miles radius (~24,140 meters) - "Very Close"
      const innerRing = L.circle([userLat, userLng], {
        radius: 24140,
        color: '#10b981',
        weight: 1.5,
        dashArray: '4, 6',
        fillColor: '#10b981',
        fillOpacity: isDarkMode ? 0.05 : 0.03,
      });

      // 50 miles radius (~80,467 meters) - "Commutable"
      const outerRing = L.circle([userLat, userLng], {
        radius: 80467,
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '5, 8',
        fillColor: '#f59e0b',
        fillOpacity: isDarkMode ? 0.03 : 0.02,
      });

      circlesLayer.addLayer(innerRing);
      circlesLayer.addLayer(outerRing);
    }

    // User Location Pulse Marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'user-pin-wrapper',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-blue-500/20 user-marker-pulse"></div>
          <div class="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon })
      .bindTooltip(`<b>You are here</b><br/>${currentUserLocation.name}`, {
        permanent: false,
        direction: 'top',
        className: 'user-tooltip',
      })
      .addTo(map);

    userMarkerRef.current = userMarker;
  }, [currentUserLocation, showRings, isDarkMode]);

  // Update Job Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    filteredJobs.forEach((job) => {
      // Slightly jitter coordinates if exactly matching another job so pins don't overlap
      const lat = job.coordinates.latitude;
      const lng = job.coordinates.longitude;

      // Marker badge color based on proximity
      let borderColor = '#3b82f6';
      let tagBg = '#eff6ff';
      let tagText = '#1d4ed8';
      let distanceLabel = `${job.computedDistance} mi`;

      if (job.workplaceType === 'Remote') {
        borderColor = '#8b5cf6';
        tagBg = isDarkMode ? '#2e1065' : '#f5f3ff';
        tagText = isDarkMode ? '#c4b5fd' : '#6d28d9';
        distanceLabel = 'Remote';
      } else if (job.computedProximity === 'very_close') {
        borderColor = '#10b981';
        tagBg = isDarkMode ? '#064e3b' : '#ecfdf5';
        tagText = isDarkMode ? '#6ee7b7' : '#047857';
      } else if (job.computedProximity === 'nearby') {
        borderColor = '#f59e0b';
        tagBg = isDarkMode ? '#451a03' : '#fffbeb';
        tagText = isDarkMode ? '#fcd34d' : '#b45309';
      } else {
        borderColor = '#64748b';
        tagBg = isDarkMode ? '#1e293b' : '#f1f5f9';
        tagText = isDarkMode ? '#94a3b8' : '#475569';
      }

      const isSelected = job.id === selectedJobId;
      const isApplied = appliedJobIds.includes(job.id);

      const customIcon = L.divIcon({
        className: 'job-pin-container',
        html: `
          <div class="relative group cursor-pointer transition-transform duration-150 ${isSelected ? 'scale-110 z-50' : 'hover:scale-105'}">
            <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border-2 shadow-md transition-colors"
                 style="border-color: ${borderColor}">
              <img src="${job.companyLogo}" alt="${job.company}" class="w-4 h-4 rounded-md object-cover" />
              <span class="text-[11px] font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">${job.company}</span>
              <span class="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold whitespace-nowrap" style="background-color: ${tagBg}; color: ${tagText}">
                ${distanceLabel}
              </span>
            </div>
            <div class="w-2 h-2 bg-white dark:bg-slate-900 border-r-2 border-b-2 mx-auto -mt-1 transform rotate-45"
                 style="border-color: ${borderColor}"></div>
          </div>
        `,
        iconSize: [120, 36],
        iconAnchor: [60, 36],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup content with real actions
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-4 min-w-[260px] max-w-[320px] text-left';
      popupHtml.innerHTML = `
        <div class="flex items-center gap-3 mb-2">
          <img src="${job.companyLogo}" alt="${job.company}" class="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
          <div>
            <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400">${job.company}</div>
            <div class="text-sm font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-1">${job.title}</div>
          </div>
        </div>

        <div class="space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-300">
          <div class="flex items-center gap-1.5 font-medium">
            <span class="text-slate-400">📍 Location:</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">${job.location} (${job.workplaceType})</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-slate-400">🚗 Commute:</span>
            <span class="font-semibold text-slate-700 dark:text-slate-300">${job.computedCommute}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-slate-400">💰 Compensation:</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k/yr</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button id="popup-view-details-${job.id}" class="flex-1 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition border border-slate-200 dark:border-slate-700">
            Details
          </button>
          <button id="popup-apply-${job.id}" class="flex-1 py-1.5 text-xs font-bold text-white ${isApplied ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg transition shadow-xs flex items-center justify-center gap-1">
            ${isApplied ? '✓ Applied' : '⚡ 1-Click Apply'}
          </button>
        </div>
      `;

      // Attach DOM event listeners safely
      popupHtml.querySelector(`#popup-view-details-${job.id}`)?.addEventListener('click', () => {
        onSelectJob(job);
      });

      popupHtml.querySelector(`#popup-apply-${job.id}`)?.addEventListener('click', () => {
        if (!isApplied) {
          onOneClickApply(job);
        }
      });

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedJobId(job.id);
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
      });

      markersLayer.addLayer(marker);
    });
  }, [filteredJobs, selectedJobId, appliedJobIds, isDarkMode]);

  // Handle Preset Location Switch
  const handleSelectPreset = (preset: typeof USER_PRESET_LOCATIONS[0]) => {
    setCurrentUserLocation({ name: preset.name, coords: preset.coords });
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([preset.coords.latitude, preset.coords.longitude], 11, {
        duration: 1.2,
      });
    }
  };

  // Handle Browser Geolocation
  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingUser(false);
        const newCoords: GeoCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentUserLocation({
          name: 'Current GPS Location',
          coords: newCoords,
        });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newCoords.latitude, newCoords.longitude], 12, {
            duration: 1.2,
          });
        }
      },
      (error) => {
        setIsLocatingUser(false);
        console.warn('Geolocation error:', error);
        // Fallback to San Francisco default
      },
      { timeout: 8000 }
    );
  };

  // Center on user
  const handleCenterOnUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [currentUserLocation.coords.latitude, currentUserLocation.coords.longitude],
        11,
        { duration: 1 }
      );
    }
  };

  // Fit all jobs in view
  const handleFitAllPositions = () => {
    if (!mapInstanceRef.current || filteredJobs.length === 0) return;
    const bounds = L.latLngBounds(
      filteredJobs.map((j) => [j.coordinates.latitude, j.coordinates.longitude])
    );
    bounds.extend([currentUserLocation.coords.latitude, currentUserLocation.coords.longitude]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
  };

  // Pan to selected job from list
  const handleFocusJob = (job: typeof jobsWithGeo[0]) => {
    setSelectedJobId(job.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([job.coordinates.latitude, job.coordinates.longitude], 13, {
        duration: 0.8,
      });
    }
  };

  return (
    <div id="job-map-view-container" className="space-y-4">
      
      {/* Top Filter and Location Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* User Location Anchor */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-900">
              <Compass className="w-5 h-5" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Your Current Base:
                </span>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                  {currentUserLocation.name}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <select
                  id="user-location-selector"
                  value={currentUserLocation.name}
                  onChange={(e) => {
                    const found = USER_PRESET_LOCATIONS.find((p) => p.name === e.target.value);
                    if (found) handleSelectPreset(found);
                  }}
                  className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  {USER_PRESET_LOCATIONS.map((preset) => (
                    <option key={preset.name} value={preset.name}>
                      📍 {preset.name}
                    </option>
                  ))}
                </select>

                <button
                  id="use-current-gps-btn"
                  onClick={handleUseCurrentGPS}
                  disabled={isLocatingUser}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
                  title="Detect GPS"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Use GPS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search bar inside map */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search map by title or company..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Proximity Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Proximity:</span>
            
            <button
              onClick={() => setProximityFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition text-xs ${
                proximityFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Openings ({counts.all})
            </button>

            <button
              onClick={() => setProximityFilter('very_close')}
              className={`px-3 py-1 rounded-lg font-bold transition text-xs flex items-center gap-1.5 ${
                proximityFilter === 'very_close'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Very Close &lt; 15 mi ({counts.very_close})
            </button>

            <button
              onClick={() => setProximityFilter('nearby')}
              className={`px-3 py-1 rounded-lg font-bold transition text-xs flex items-center gap-1.5 ${
                proximityFilter === 'nearby'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Commutable 15-50 mi ({counts.nearby})
            </button>

            <button
              onClick={() => setProximityFilter('far')}
              className={`px-3 py-1 rounded-lg font-bold transition text-xs flex items-center gap-1.5 ${
                proximityFilter === 'far'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Long Distance &gt; 50 mi ({counts.far})
            </button>

            <button
              onClick={() => setProximityFilter('remote')}
              className={`px-3 py-1 rounded-lg font-bold transition text-xs flex items-center gap-1.5 ${
                proximityFilter === 'remote'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 hover:bg-purple-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              100% Remote ({counts.remote})
            </button>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRings(!showRings)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                showRings
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
              title="Toggle commute range rings"
            >
              Range Radii
            </button>
            <button
              onClick={handleCenterOnUser}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Center on Me
            </button>
            <button
              onClick={handleFitAllPositions}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Fit All
            </button>
          </div>
        </div>

      </div>

      {/* Main Map Viewport & Job List Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Real Leaflet Map Container */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-2">
          <div className="relative w-full h-[520px] sm:h-[580px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* The Leaflet Map Canvas */}
            <div 
              ref={mapContainerRef} 
              id="leaflet-jobs-map" 
              className="w-full h-full"
            />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md text-[11px] space-y-1">
              <div className="font-extrabold text-slate-800 dark:text-slate-200 mb-1">
                Commute &amp; Proximity
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>&lt; 15 mi (Very Close • ~15 min)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>15 - 50 mi (Commutable • ~35-50 min)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>&gt; 50 mi (Long Distance)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>100% Remote</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar: Synchronized Jobs List Sorted by Proximity */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[520px] sm:h-[580px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Proximity Openings
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {filteredJobs.length} visible
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Sorted closest first
            </span>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredJobs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                <MapPin className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-bold">No jobs match this proximity filter</p>
                <p className="text-xs text-slate-400 mt-1">Try switching to &quot;All Openings&quot; or changing your base city.</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = job.id === selectedJobId;
                const isApplied = appliedJobIds.includes(job.id);
                const isBookmarked = bookmarkedJobIds.includes(job.id);

                return (
                  <div
                    key={job.id}
                    id={`map-sidebar-job-${job.id}`}
                    onClick={() => handleFocusJob(job)}
                    className={`pt-2.5 first:pt-0 cursor-pointer rounded-xl p-3 transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 shadow-xs'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-none">
                            {job.company}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 mt-0.5">
                            {job.title}
                          </h4>
                        </div>
                      </div>

                      {/* Proximity Tag */}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold shrink-0 ${
                          job.workplaceType === 'Remote'
                            ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300'
                            : job.computedProximity === 'very_close'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                            : job.computedProximity === 'nearby'
                            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {job.workplaceType === 'Remote'
                          ? 'Remote'
                          : `${job.computedDistance} mi`}
                      </span>
                    </div>

                    {/* Commute and Salary */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      <div className="flex items-center gap-1">
                        {job.workplaceType === 'Remote' ? (
                          <Laptop className="w-3.5 h-3.5 text-purple-500" />
                        ) : job.computedDistance <= 15 ? (
                          <Car className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Train className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span className="line-clamp-1 font-medium">{job.computedCommute}</span>
                      </div>

                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                      </span>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectJob(job);
                        }}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Full Role →
                      </button>

                      <div className="flex items-center gap-1.5">
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3" />
                            Applied
                          </span>
                        ) : (
                          <button
                            id={`map-apply-btn-${job.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOneClickApply(job);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3 fill-white" />
                            <span>1-Click Apply</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
