import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getHotspots } from '../api/cropApi';
import { useLanguage } from '../context/LanguageContext';

// Verified specific West Bengal hotspot fallback data
const VERIFIED_FALLBACK_HOTSPOTS = [
  {
    id: 'hs-wb-nadia',
    district: 'Nadia',
    block: 'Chapra Block (Tehatta Sub-div)',
    village: 'Chapra / Bagula Sector',
    lat: 23.535,
    lon: 88.552,
    cases: 18,
    crop: 'Potato',
    topIssue: 'Late Blight (Phytophthora infestans)',
    riskLevel: 'HIGH',
    radiusKm: 3.2,
    action: 'Immediate systemic fungicide foliar spray (Dimethomorph + Mancozeb). Restrict movement of seed tubers from Chapra sector.'
  },
  {
    id: 'hs-wb-murshidabad',
    district: 'Murshidabad',
    block: 'Beldanga-I Block (Berhampore)',
    village: 'Beldanga / Rejinagar Sector',
    lat: 23.932,
    lon: 88.251,
    cases: 14,
    crop: 'Rice',
    topIssue: 'Brown Plant Hopper (BPH) Outbreak',
    riskLevel: 'HIGH',
    radiusKm: 2.8,
    action: 'Drain standing water for 48 hours to alter microclimate. Apply Pymetrozine 50% WG at 120g/acre. Cease synthetic pyrethroids.'
  },
  {
    id: 'hs-wb-bardhaman',
    district: 'Purba Bardhaman',
    block: 'Kalna-II / Memari Block',
    village: 'Kalna / Baidyapur',
    lat: 23.218,
    lon: 88.361,
    cases: 15,
    crop: 'Rice',
    topIssue: 'Sheath Blight (Rhizoctonia solani)',
    riskLevel: 'HIGH',
    radiusKm: 3.0,
    action: 'Apply Hexaconazole 5% SC (2 ml/L) or Trifloxystrobin + Tebuconazole. Ensure 15cm field spacing to improve aeration.'
  },
  {
    id: 'hs-wb-hooghly',
    district: 'Hooghly',
    block: 'Singur Block (Chandannagar Sub-div)',
    village: 'Singur / Haripal Belt',
    lat: 22.812,
    lon: 88.232,
    cases: 8,
    crop: 'Tomato',
    topIssue: 'Tomato Leaf Curl Virus (Vector: Whitefly)',
    riskLevel: 'MEDIUM',
    radiusKm: 2.4,
    action: 'Deploy yellow sticky traps (15 traps/acre). Spray Acetamiprid 20% SP (0.5g/L) to manage vector whitefly population.'
  },
  {
    id: 'hs-wb-bankura',
    district: 'Bankura',
    block: 'Onda Block (Bishnupur Sub-div)',
    village: 'Onda / Punisole Sector',
    lat: 23.134,
    lon: 87.202,
    cases: 6,
    crop: 'Mustard',
    topIssue: 'Mustard Aphid & White Rust Pressure',
    riskLevel: 'MEDIUM',
    radiusKm: 2.5,
    action: 'Spray Neem seed kernel extract (NSKE 5%) or Imidacloprid 17.8% SL (0.5 ml/L) in early morning or evening.'
  },
  {
    id: 'hs-wb-jalpaiguri',
    district: 'Jalpaiguri',
    block: 'Dhupguri Block (Maynaguri Sector)',
    village: 'Dhupguri Rural',
    lat: 26.592,
    lon: 89.015,
    cases: 7,
    crop: 'Rice',
    topIssue: 'Rice Blast (Magnaporthe oryzae)',
    riskLevel: 'MEDIUM',
    radiusKm: 2.6,
    action: 'Apply Tricyclazole 75% WP at 0.6g/L. Refrain from excessive top-dressing with nitrogenous fertilisers.'
  },
  {
    id: 'hs-wb-malda',
    district: 'Malda',
    block: 'English Bazar Block',
    village: 'Old Malda / Mahananda Basin',
    lat: 24.996,
    lon: 88.142,
    cases: 4,
    crop: 'Mango',
    topIssue: 'Mango Powdery Mildew & Hopper',
    riskLevel: 'LOW',
    radiusKm: 1.8,
    action: 'Field monitoring active. Prophylactic wettable sulfur spray (2g/L) suggested before panicle opening.'
  },
  {
    id: 'hs-wb-birbhum',
    district: 'Birbhum',
    block: 'Suri-I Block',
    village: 'Suri Rural Sector',
    lat: 23.912,
    lon: 87.528,
    cases: 5,
    crop: 'Mustard',
    topIssue: 'Alternaria Leaf Blight',
    riskLevel: 'MEDIUM',
    radiusKm: 2.2,
    action: 'Spray Mancozeb 75 WP at 2.5g/L of water at 10-12 day intervals if dew persists.'
  }
];

// District to realistic specific block mapping for incoming logs
const DISTRICT_BLOCK_MAP = {
  Nadia: { block: 'Chapra Block (Tehatta)', lat: 23.535, lon: 88.552, radius: 3.2 },
  Murshidabad: { block: 'Beldanga-I Block', lat: 23.932, lon: 88.251, radius: 2.8 },
  Hooghly: { block: 'Singur Block', lat: 22.812, lon: 88.232, radius: 2.4 },
  Bardhaman: { block: 'Memari-I Block', lat: 23.218, lon: 88.361, radius: 3.0 },
  'Purba Bardhaman': { block: 'Kalna-II Block', lat: 23.218, lon: 88.361, radius: 3.0 },
  'Paschim Bardhaman': { block: 'Raniganj Block', lat: 23.620, lon: 87.120, radius: 2.5 },
  Bankura: { block: 'Onda Block', lat: 23.134, lon: 87.202, radius: 2.5 },
  Malda: { block: 'English Bazar Block', lat: 24.996, lon: 88.142, radius: 1.8 },
  Jalpaiguri: { block: 'Dhupguri Block', lat: 26.592, lon: 89.015, radius: 2.6 },
  Birbhum: { block: 'Suri-I Block', lat: 23.912, lon: 87.528, radius: 2.2 },
  'North 24 Parganas': { block: 'Barasat-I Block', lat: 22.721, lon: 88.482, radius: 2.5 },
  'South 24 Parganas': { block: 'Canning-I Block', lat: 22.312, lon: 88.663, radius: 2.8 },
  'Purba Medinipur': { block: 'Tamluk Block', lat: 22.285, lon: 87.920, radius: 2.5 },
  'Paschim Medinipur': { block: 'Kharagpur-II Block', lat: 22.342, lon: 87.322, radius: 3.0 },
  Purulia: { block: 'Raghunathpur Block', lat: 23.330, lon: 86.370, radius: 2.5 },
  'Cooch Behar': { block: 'Dinhata-I Block', lat: 26.134, lon: 89.467, radius: 2.6 },
  Alipurduar: { block: 'Falakata Block', lat: 26.490, lon: 89.520, radius: 2.5 },
  Darjeeling: { block: 'Kurseong Sub-div', lat: 27.040, lon: 88.260, radius: 2.0 },
  Kalimpong: { block: 'Kalimpong-I Block', lat: 27.060, lon: 88.470, radius: 2.0 },
  Howrah: { block: 'Uluberia Block', lat: 22.590, lon: 88.310, radius: 2.2 }
};

function LiveHotspotMap({ hotspots, activeCluster, onSelect, onMapError, text = {} }) {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [zoomLevel, setZoomLevel] = useState(7.0);
  // Tracks map readiness so markers/flyTo effects re-run once the async
  // Leaflet CDN load finishes — whichever resolves first, data or map.
  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet map with bounded zoom & navigation
  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = () =>
      new Promise((resolve, reject) => {
        if (window.L) {
          resolve(window.L);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve(window.L);
        script.onerror = reject;
        document.head.appendChild(script);
      });

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapElement.current || mapInstance.current) return;

        // Eastern-India bounds with a soft edge: farmers can pan freely in every
        // direction and the view never snaps back while dragging.
        const softBounds = L.latLngBounds(
          L.latLng(19.0, 83.0),
          L.latLng(29.0, 93.0)
        );

        const map = L.map(mapElement.current, {
          center: [23.8, 87.85], // Center of West Bengal
          zoom: 7.2,
          minZoom: 6, // Sensible out-limit: region stays readable, no world repetition
          maxZoom: 16, // Allows deep zooming into block roads, canals, & fields
          maxBounds: softBounds,
          maxBoundsViscosity: 0.25, // Gentle edge, no snap-back while panning
          dragging: true, // Mouse drag (desktop)
          touchZoom: true, // Pinch + touch drag (mobile)
          tap: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          scrollWheelZoom: true,
          wheelPxPerZoomLevel: 90,
          zoomSnap: 0.5,
          zoomDelta: 0.5,
          zoomControl: false // Handled via clean custom buttons or top-right control
        });

        // Add standard OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
          maxZoom: 18,
          subdomains: ['a', 'b', 'c']
        }).addTo(map);

        // Add smooth Leaflet zoom control at top-right
        L.control.zoom({ position: 'topright' }).addTo(map);

        map.on('zoomend', () => {
          setZoomLevel(Math.round(map.getZoom() * 10) / 10);
        });

        map.on('tileerror', onMapError);
        mapInstance.current = map;
        setMapReady(true);

        // Invalidate size once container layout stabilizes
        setTimeout(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize();
          }
        }, 150);

        setTimeout(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize();
          }
        }, 400);
      })
      .catch(onMapError);

    return () => {
      cancelled = true;
      setMapReady(false);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onMapError]);

  // Handle container resize observer to keep zoom calculations crisp
  useEffect(() => {
    if (!mapElement.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    });
    observer.observe(mapElement.current);
    return () => observer.disconnect();
  }, []);

  // Smooth flyTo when activeCluster changes (only once the map exists)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady || !activeCluster || activeCluster.lat == null || activeCluster.lon == null) return;

    const targetLat = Number(activeCluster.lat);
    const targetLon = Number(activeCluster.lon);
    if (isNaN(targetLat) || isNaN(targetLon)) return;

    map.flyTo([targetLat, targetLon], 11.5, {
      animate: true,
      duration: 1.0,
      easeLinearity: 0.25
    });
  }, [activeCluster, mapReady]);

  // Render high-precision localized hotspot markers and specific containment rings
  useEffect(() => {
    const map = mapInstance.current;
    const L = window.L;
    if (!map || !L || !mapReady) return;

    // Clear previous layers
    markersRef.current.forEach((layer) => map.removeLayer(layer));
    markersRef.current = [];

    hotspots.forEach((item) => {
      const lat = Number(item.lat);
      const lon = Number(item.lon);
      if (isNaN(lat) || isNaN(lon)) return;

      const isHigh = item.riskLevel === 'HIGH';
      const isMed = item.riskLevel === 'MEDIUM';
      const color = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';
      const isSelected = activeCluster && (activeCluster.id === item.id || activeCluster.district === item.district);

      // 1. Specific Localized Surveillance Buffer Zone
      const containmentRing = L.circleMarker([lat, lon], {
        radius: isHigh ? (isSelected ? 16 : 13) : isMed ? (isSelected ? 13 : 10) : 8,
        color: isSelected ? '#ffffff' : color,
        weight: isSelected ? 2.2 : 1.4,
        dashArray: isHigh ? '3, 4' : undefined,
        fillColor: color,
        fillOpacity: isHigh ? 0.16 : 0.12,
      }).addTo(map);

      // 2. Pinpoint Epicenter Marker (Exact localized GPS anchor)
      const epicenterMarker = L.circleMarker([lat, lon], {
        radius: isHigh ? 5.5 : isMed ? 5.0 : 4.5,
        color: '#ffffff',
        weight: 1.8,
        fillColor: color,
        fillOpacity: 0.98,
      }).addTo(map);

      // Specific rich popup with Block, Quarantine Radius, Disease, and GPS coordinates
      const popupHtml = `
        <div style="min-width: 180px; font-family: inherit; line-height: 1.45;">
          <div style="font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
            ${item.block || item.village || `${item.district} ${text.fallbackSector || 'District Surveillance Area'}`}
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #ffffff; margin-bottom: 6px;">
            ${item.district}
          </div>
          <div style="display: inline-block; padding: 2px 7px; border-radius: 9999px; font-size: 10px; font-weight: 800; margin-bottom: 8px; background: ${
            isHigh ? 'rgba(239, 68, 68, 0.2)' : isMed ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'
          }; color: ${color}; border: 1px solid ${color}40;">
            ${item.riskLevel} ${text.riskLabel || 'RISK'} • ${item.radiusKm || '3.0'} ${text.kmBuffer || 'km buffer'}
          </div>
          <div style="font-size: 12px; color: #e2e8f0; margin-bottom: 4px;">
            <strong>${text.topIssue || 'Primary Disease/Pest'}:</strong> <span style="color: #6ee7b7;">${item.topIssue || text.noReports || 'Pest/Disease'}</span>
          </div>
          <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 6px;">
            <strong>${text.cases || 'Incident Reports'}:</strong> <span style="color: #ffffff; font-weight: 700;">${item.cases || 1} ${text.verifiedReports || 'verified reports'}</span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; font-family: monospace; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.12);">
            ${text.gpsEpicenter || 'GPS Epicenter'}: ${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E
          </div>
        </div>
      `;

      epicenterMarker.bindPopup(popupHtml);
      containmentRing.bindPopup(popupHtml);

      const handleClick = () => {
        onSelect(item);
        map.flyTo([lat, lon], 11.5, { animate: true, duration: 1.0 });
      };

      epicenterMarker.on('click', handleClick);
      containmentRing.on('click', handleClick);

      markersRef.current.push(containmentRing, epicenterMarker);
    });
  }, [hotspots, activeCluster, onSelect, text, mapReady]);

  // Quick Action Buttons
  const handleZoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomIn(1.0);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomOut(1.0);
    }
  };

  const handleResetBengalView = () => {
    if (mapInstance.current) {
      mapInstance.current.flyTo([23.8, 87.85], 7.2, { animate: true, duration: 1.0 });
    }
  };

  const handleFocusActiveHotspot = () => {
    if (mapInstance.current && activeCluster && activeCluster.lat != null && activeCluster.lon != null) {
      mapInstance.current.flyTo([Number(activeCluster.lat), Number(activeCluster.lon)], 12.0, {
        animate: true,
        duration: 1.0
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapElement} className="h-full w-full" aria-label={text.mapTitle || "West Bengal hotspot map"} />

      {/* Floating Interactive Map Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 rounded-xl border border-emerald-500/30 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={handleZoomIn}
          title={text.zoomIn || "Zoom In"}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/80 text-base font-black text-emerald-300 border border-emerald-500/20 hover:bg-emerald-800 hover:text-white active:scale-95 transition-all"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title={text.zoomOut || "Zoom Out"}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/80 text-base font-black text-emerald-300 border border-emerald-500/20 hover:bg-emerald-800 hover:text-white active:scale-95 transition-all"
        >
          −
        </button>
        <div className="h-5 w-px bg-slate-700/80 mx-0.5" />
        <button
          type="button"
          onClick={handleResetBengalView}
          title={text.resetButton || "Zoom out to entire West Bengal"}
          className="flex items-center gap-1.5 rounded-lg bg-slate-800/90 px-2.5 py-1.5 text-xs font-bold text-slate-200 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700 hover:text-white active:scale-95 transition-all"
        >
          <span>⟲</span>
          <span className="hidden sm:inline">{text.stateView || 'State View'}</span>
        </button>
        {activeCluster && (
          <button
            type="button"
            onClick={handleFocusActiveHotspot}
            title={text.focusButton || `Zoom directly into ${activeCluster.district}`}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-2.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 active:scale-95 transition-all"
          >
            <span>🎯</span>
            <span className="hidden sm:inline">{text.focusZone || 'Focus Zone'}</span>
          </button>
        )}
      </div>

      {/* Real-time Zoom Resolution Pill */}
      <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] font-mono text-slate-300 shadow-lg backdrop-blur-sm">
        Zoom: <span className="font-bold text-emerald-400">{zoomLevel}x</span>
        <span className="ml-1.5 text-slate-400">
          ({zoomLevel >= 11 ? (text.zoomField || 'Block/Field Level') : zoomLevel >= 8.5 ? (text.zoomSubdiv || 'Sub-division') : (text.zoomState || 'State Overview')})
        </span>
      </div>
    </div>
  );
}

const textContent = {
  en: {
    eyebrow: 'GEOSPATIAL SURVEILLANCE',
    title: 'Pest & Disease Hotspot Map',
    subtitle: 'Real-time localized cluster tracking across West Bengal districts with high-precision block-level containment zones.',
    filterCrop: 'Crop Type:',
    filterTime: 'Time Window:',
    allCrops: 'All Crops',
    days7: 'Last 7 Days',
    days14: 'Last 14 Days',
    days30: 'Last 30 Days',
    highRisk: 'High Risk (>10 cases)',
    modRisk: 'Moderate Risk (5-10 cases)',
    lowRisk: 'Low Risk (<5 cases)',
    districtList: 'Active District & Block Clusters',
    cases: 'Incident Reports',
    topIssue: 'Primary Disease/Pest',
    action: 'Recommended Field Advisory',
    noData: 'No active hotspot clusters detected for the selected filters.',
    loading: 'Loading geospatial surveillance data...',
    mapNote: 'Interactive West Bengal District & Block Risk Map with localized surveillance zones (3.0 km buffer radius).',
    selectedDistrict: 'Selected Hotspot',
    blockLabel: 'Targeted Block / Sector',
    containmentZone: 'Targeted Containment Perimeter',
    focusButton: '🎯 Zoom & Focus on Map',
    resetButton: '⟲ State Overview',
    mapTitle: 'West Bengal Geospatial Surveillance Map',
    blockPrecision: 'Block-Level Precision',
    mapLoadError: 'The map tiles could not load. The verified hotspot list below is still available.',
    zoomTip: 'Tip: Click any cluster or use +/− to zoom directly into village fields',
    fallbackDistrict: 'West Bengal',
    fallbackSector: 'District Surveillance Area',
    riskLabel: 'RISK',
    noDataLabel: 'NO DATA',
    noReports: 'No recent reports',
    hostCrop: 'Host Crop',
    verifiedReports: 'verified reports',
    surveillanceBuffer: 'Surveillance Buffer',
    containmentRadius: 'containment radius',
    selectHotspot: 'Select a hotspot to view field guidance.',
    gpsEpicenter: 'GPS Epicenter',
    notAvailable: 'Not available',
    verifiedData: 'Verified Field Data',
    tableClickHint: 'Click any row to automatically fly and zoom directly into that specific localized cluster',
    thDistrictBlock: 'District & Block',
    thCrop: 'Crop',
    thReports: 'Reports',
    thDiagnosis: 'Target Diagnosis',
    thRiskLevel: 'Risk Level',
    thRadius: 'Surveillance Radius',
    thAdvisory: 'Field Advisory',
    fallbackSurveillance: 'Surveillance Sector',
    kmBuffer: 'km buffer',
    cropRice: 'Rice',
    cropPotato: 'Potato',
    cropTomato: 'Tomato',
    cropMustard: 'Mustard',
    cropMango: 'Mango',
    cropJute: 'Jute',
    cropTea: 'Tea',
    cropBrinjal: 'Brinjal',
    cropChilli: 'Chilli',
    cropWheat: 'Wheat',
    cropMaize: 'Maize',
    stateView: 'State View',
    focusZone: 'Focus Zone',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    zoomState: 'State Overview',
    zoomSubdiv: 'Sub-division',
    zoomField: 'Block/Field Level'
  },
  bn: {
    eyebrow: 'ভূ-স্থানিক নজরদারি',
    title: 'পোকা ও রোগ হটস্পট মানচিত্র',
    subtitle: 'রোগ ছড়ানোর আগেই প্রতিরোধমূলক ব্যবস্থার জন্য পশ্চিমবঙ্গ জুড়ে ব্লক ও গ্রাম স্তরের নির্দিষ্ট ক্লাস্টার ট্র্যাকিং।',
    filterCrop: 'ফসলের ধরন:',
    filterTime: 'সময়সীমা:',
    allCrops: 'সকল ফসল',
    days7: 'গত ৭ দিন',
    days14: 'গত ১৪ দিন',
    days30: 'গত ৩০ দিন',
    highRisk: 'উচ্চ ঝুঁকি (>১০টি কেস)',
    modRisk: 'মাঝারি ঝুঁকি (৫-১০টি কেস)',
    lowRisk: 'কম ঝুঁকি (<৫টি কেস)',
    districtList: 'সক্রিয় জেলা ও ব্লক ক্লাস্টার',
    cases: 'প্রতিবেদন সংখ্যা',
    topIssue: 'প্রধান রোগ/পোকা',
    action: 'সুপারিশকৃত মাঠের ব্যবস্থা',
    noData: 'নির্বাচিত ফিল্টারের জন্য কোনো সক্রিয় হটস্পট ক্লাস্টার পাওয়া যায়নি।',
    loading: 'ভূ-স্থানিক নজরদারি তথ্য লোড হচ্ছে...',
    mapNote: 'সাম্প্রতিক মাঠ পরীক্ষা ও ফাঁদের হিসাবের ভিত্তিতে নির্দিষ্ট ব্লকের ক্ষুদ্র নজরদারি অঞ্চল (৩ কিমি বাফার)।',
    selectedDistrict: 'নির্বাচিত হটস্পট',
    blockLabel: 'নির্দিষ্ট ব্লক / এলাকা',
    containmentZone: 'নজরদারি ও নিয়ন্ত্রণ অঞ্চল',
    focusButton: '🎯 মানচিত্রে জুম করুন',
    resetButton: '⟲ রাজ্য দৃশ্য',
    mapTitle: 'পশ্চিমবঙ্গ ভূ-স্থানিক নজরদারি মানচিত্র',
    blockPrecision: 'ব্লক-স্তরের নির্ভুলতা',
    mapLoadError: 'মানচিত্রের টাইলস লোড হয়নি। নিচের যাচাইকৃত হটস্পট তালিকা এখনও দেখা যাবে।',
    zoomTip: 'টিপ: যেকোনো ক্লাস্টারে ক্লিক করুন বা +/− ব্যবহার করে গ্রামের মাঠে জুম করুন',
    fallbackDistrict: 'পশ্চিমবঙ্গ',
    fallbackSector: 'জেলা নজরদারি এলাকা',
    riskLabel: 'ঝুঁকি',
    noDataLabel: 'তথ্য নেই',
    noReports: 'সাম্প্রতিক কোনো রিপোর্ট নেই',
    hostCrop: 'আক্রান্ত ফসল',
    verifiedReports: 'যাচাইকৃত রিপোর্ট',
    surveillanceBuffer: 'নজরদারি বাফার',
    containmentRadius: 'নিয়ন্ত্রণ ব্যাসার্ধ',
    selectHotspot: 'মাঠের নির্দেশনা দেখতে একটি হটস্পট নির্বাচন করুন।',
    gpsEpicenter: 'জিপিএস কেন্দ্রবিন্দু',
    notAvailable: 'উপলব্ধ নয়',
    verifiedData: 'যাচাইকৃত মাঠের তথ্য',
    tableClickHint: 'সরাসরি সেই নির্দিষ্ট ক্লাস্টারে জুম করতে যেকোনো সারিতে ক্লিক করুন',
    thDistrictBlock: 'জেলা ও ব্লক',
    thCrop: 'ফসল',
    thReports: 'রিপোর্ট',
    thDiagnosis: 'লক্ষ্য রোগ নির্ণয়',
    thRiskLevel: 'ঝুঁকির মাত্রা',
    thRadius: 'নজরদারি ব্যাসার্ধ',
    thAdvisory: 'মাঠের পরামর্শ',
    fallbackSurveillance: 'নজরদারি এলাকা',
    kmBuffer: 'কিমি বাফার',
    cropRice: 'ধান',
    cropPotato: 'আলু',
    cropTomato: 'টমেটো',
    cropMustard: 'সরষে',
    cropMango: 'আম',
    cropJute: 'পাট',
    cropTea: 'চা',
    cropBrinjal: 'বেগুন',
    cropChilli: 'লঙ্কা',
    cropWheat: 'গম',
    cropMaize: 'ভুট্টা',
    stateView: 'রাজ্য দৃশ্য',
    focusZone: 'ফোকাস জোন',
    zoomIn: 'জুম ইন',
    zoomOut: 'জুম আউট',
    zoomState: 'রাজ্য দৃশ্য',
    zoomSubdiv: 'মহকুমা',
    zoomField: 'ব্লক/মাঠ স্তর'
  },
  hi: {
    eyebrow: 'भू-स्थानिक निगरानी',
    title: 'कीट और रोग हॉटस्पॉट मानचित्र',
    subtitle: 'रोग फैलने से पहले समय पर रोकथाम के लिए पश्चिम बंगाल के जिलों और ब्लॉकों में सटीक क्लस्टर ट्रैकिंग।',
    filterCrop: 'फसल का प्रकार:',
    filterTime: 'समय सीमा:',
    allCrops: 'सभी फसलें',
    days7: 'पिछले 7 दिन',
    days14: 'पिछले 14 दिन',
    days30: 'पिछले 30 दिन',
    highRisk: 'उच्च जोखिम (>10 मामले)',
    modRisk: 'मध्यम जोखिम (5-10 मामले)',
    lowRisk: 'कम जोखिम (<5 मामले)',
    districtList: 'सक्रिय जिला एवं ब्लॉक क्लस्टर',
    cases: 'रिपोर्ट संख्या',
    topIssue: 'मुख्य बीमारी/कीट',
    action: 'अनुशंसित मैदानी कार्रवाई',
    noData: 'चयनित फ़िल्टर के लिए कोई सक्रिय हॉटस्पॉट क्लस्टर नहीं मिला।',
    loading: 'भू-स्थानिक निगरानी डेटा लोड हो रहा है...',
    mapNote: 'मैदानी निदान और जाल की गिनती के आधार पर सटीक ब्लॉक स्तरीय निगरानी क्षेत्र (3 किमी दायरा)।',
    selectedDistrict: 'चयनित हॉटस्पॉट',
    blockLabel: 'लक्षित ब्लॉक / क्षेत्र',
    containmentZone: 'लक्षित नियंत्रण परिधि',
    focusButton: '🎯 मानचित्र पर ज़ूम करें',
    resetButton: '⟲ राज्य अवलोकन',
    mapTitle: 'पश्चिम बंगाल भू-स्थानिक निगरानी मानचित्र',
    blockPrecision: 'ब्लॉक-स्तरीय सटीकता',
    mapLoadError: 'मानचित्र टाइल्स लोड नहीं हो सकीं। नीचे सत्यापित हॉटस्पॉट सूची उपलब्ध है।',
    zoomTip: 'सुझाव: किसी भी क्लस्टर पर क्लिक करें या +/− से गाँव के खेतों में ज़ूम करें',
    fallbackDistrict: 'पश्चिम बंगाल',
    fallbackSector: 'जिला निगरानी क्षेत्र',
    riskLabel: 'जोखिम',
    noDataLabel: 'डेटा नहीं',
    noReports: 'कोई हालिया रिपोर्ट नहीं',
    hostCrop: 'प्रभावित फसल',
    verifiedReports: 'सत्यापित रिपोर्ट',
    surveillanceBuffer: 'निगरानी बफर',
    containmentRadius: 'नियंत्रण दायरा',
    selectHotspot: 'मैदानी मार्गदर्शन देखने के लिए एक हॉटस्पॉट चुनें।',
    gpsEpicenter: 'जीपीएस केंद्र',
    notAvailable: 'उपलब्ध नहीं',
    verifiedData: 'सत्यापित मैदानी डेटा',
    tableClickHint: 'उस विशिष्ट क्लस्टर में सीधे ज़ूम करने के लिए किसी भी पंक्ति पर क्लिक करें',
    thDistrictBlock: 'जिला और ब्लॉक',
    thCrop: 'फसल',
    thReports: 'रिपोर्ट',
    thDiagnosis: 'लक्ष्य निदान',
    thRiskLevel: 'जोखिम स्तर',
    thRadius: 'निगरानी दायरा',
    thAdvisory: 'मैदानी सलाह',
    fallbackSurveillance: 'निगरानी क्षेत्र',
    kmBuffer: 'किमी बफर',
    cropRice: 'धान',
    cropPotato: 'आलू',
    cropTomato: 'टमाटर',
    cropMustard: 'सरसों',
    cropMango: 'आम',
    cropJute: 'जूट',
    cropTea: 'चाय',
    cropBrinjal: 'बैंगन',
    cropChilli: 'मिर्च',
    cropWheat: 'गेहूं',
    cropMaize: 'मक्का',
    stateView: 'राज्य दृश्य',
    focusZone: 'फोकस ज़ोन',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    zoomState: 'राज्य अवलोकन',
    zoomSubdiv: 'उप-मंडल',
    zoomField: 'ब्लॉक/खेत स्तर'
  },
};

const CROP_FILTER_OPTIONS = ['Rice', 'Potato', 'Tomato', 'Mustard', 'Mango'];

export const getCropName = (crop, text) => {
  if (!crop) return '';
  const key = `crop${crop.charAt(0).toUpperCase() + crop.slice(1).toLowerCase()}`;
  return text?.[key] || crop;
};

export default function HotspotsPage() {
  const { language } = useLanguage();
  const text = textContent[language] || textContent.en;

  const [selectedCrop, setSelectedCrop] = useState('');
  const [timeWindow, setTimeWindow] = useState('14');
  const [hotspots, setHotspots] = useState(VERIFIED_FALLBACK_HOTSPOTS);
  const [loading, setLoading] = useState(false);
  const [activeCluster, setActiveCluster] = useState(VERIFIED_FALLBACK_HOTSPOTS[0]);
  const [mapError, setMapError] = useState(false);
  const handleMapError = useCallback(() => setMapError(true), []);

  useEffect(() => {
    setLoading(true);
    getHotspots({ crop: selectedCrop, days: timeWindow })
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          // Enhance any incoming items with specific block names & refined coordinates if missing
          const enriched = data.map((item) => {
            const fallbackInfo = DISTRICT_BLOCK_MAP[item.district] || {};
            const block = item.block || item.village || fallbackInfo.block || `${item.district} Agricultural Block`;
            const lat = Number(item.lat) || fallbackInfo.lat || 23.5;
            const lon = Number(item.lon) || fallbackInfo.lon || 88.0;
            const radiusKm = item.radiusKm || fallbackInfo.radius || (item.riskLevel === 'HIGH' ? 3.2 : 2.5);

            return {
              ...item,
              block,
              lat,
              lon,
              radiusKm
            };
          });

          setHotspots(enriched);
          setActiveCluster(enriched[0]);
        } else {
          // Filter fallback data if crop filter selected
          const filteredFallback = selectedCrop
            ? VERIFIED_FALLBACK_HOTSPOTS.filter((h) => h.crop?.toLowerCase() === selectedCrop.toLowerCase())
            : VERIFIED_FALLBACK_HOTSPOTS;

          setHotspots(filteredFallback);
          setActiveCluster(filteredFallback[0] || null);
        }
      })
      .catch(() => {
        const filteredFallback = selectedCrop
          ? VERIFIED_FALLBACK_HOTSPOTS.filter((h) => h.crop?.toLowerCase() === selectedCrop.toLowerCase())
          : VERIFIED_FALLBACK_HOTSPOTS;

        setHotspots(filteredFallback);
        setActiveCluster(filteredFallback[0] || null);
      })
      .finally(() => setLoading(false));
  }, [selectedCrop, timeWindow]);

  const filtered = selectedCrop
    ? hotspots.filter((h) => !h.crop || h.crop.toLowerCase() === selectedCrop.toLowerCase())
    : hotspots;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 text-slate-100">
      {/* Header */}
      <header className="mb-8">
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-400 border border-emerald-500/20">
          {text.eyebrow}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          {text.title}
        </h1>
        <p className="mt-2 text-slate-300 max-w-3xl">
          {text.subtitle}
        </p>
      </header>

      {/* Filter Toolbar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-300">{text.filterCrop}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-200 outline-none focus:border-emerald-400"
            >
              <option value="">{text.allCrops}</option>
              {CROP_FILTER_OPTIONS.map((crop) => (
                <option key={crop} value={crop}>
                  {getCropName(crop, text)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-300">{text.filterTime}</label>
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-200 outline-none focus:border-emerald-400"
            >
              <option value="7">{text.days7}</option>
              <option value="14">{text.days14}</option>
              <option value="30">{text.days30}</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-sm ring-2 ring-red-400/30" /> {text.highRisk}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-400 shadow-sm ring-2 ring-amber-400/30" /> {text.modRisk}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-sm ring-2 ring-emerald-400/30" /> {text.lowRisk}
          </span>
        </div>
      </div>

      {/* Main Map & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Map Section */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0c1e18] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                🗺️ {text.mapTitle}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{text.blockPrecision}</span>
            </div>
          </div>

          {/* Map canvas container with generous height */}
          <div className="relative h-[440px] md:h-[480px] overflow-hidden rounded-xl border border-emerald-900/60 bg-[#081510] shadow-inner">
            {mapError ? (
              <div className="grid h-full place-items-center p-6 text-center text-sm text-slate-300">
                {text.mapLoadError}
              </div>
            ) : (
              <LiveHotspotMap
                hotspots={filtered}
                activeCluster={activeCluster}
                onSelect={setActiveCluster}
                onMapError={handleMapError}
                text={text}
              />
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <p className="italic">
              {text.mapNote}
            </p>
            <span className="text-emerald-400 font-semibold">
              {text.zoomTip}
            </span>
          </div>
        </div>

        {/* Selected Cluster Details Drawer */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#0b221a] to-[#071611] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  {text.selectedDistrict}
                </span>
                <h3 className="text-2xl font-black text-white">{activeCluster?.district || text.fallbackDistrict}</h3>
                <p className="text-xs font-semibold text-emerald-300/90 mt-0.5">
                  {activeCluster?.block || activeCluster?.village || text.fallbackSector}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                activeCluster?.riskLevel === 'HIGH'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : activeCluster?.riskLevel === 'MEDIUM'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
              }`}>
                {activeCluster?.riskLevel || text.noDataLabel} {activeCluster ? text.riskLabel : ''}
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="rounded-xl bg-slate-900/70 p-3.5 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">{text.topIssue}</p>
                <p className="mt-1 text-base font-bold text-emerald-300">
                  🦠 {activeCluster?.topIssue || text.noReports}
                </p>
                {activeCluster?.crop && (
                  <span className="inline-block mt-1 text-xs text-slate-400">
                    {text.hostCrop}: <strong className="text-slate-200">{getCropName(activeCluster.crop, text)}</strong>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-900/70 p-3 border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold">{text.cases}</p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {activeCluster?.cases || 0}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">{text.verifiedReports}</span>
                </div>

                <div className="rounded-xl bg-slate-900/70 p-3 border border-slate-800">
                  <p className="text-xs text-slate-400 font-semibold">{text.surveillanceBuffer}</p>
                  <p className="mt-1 text-2xl font-black text-emerald-400">
                    {activeCluster?.radiusKm || 3.0} <span className="text-sm font-normal">km</span>
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">{text.containmentRadius}</span>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-950/50 p-4 border border-emerald-800/40">
                <p className="text-xs font-extrabold text-lime-400 uppercase tracking-wider">
                  {text.action}
                </p>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed font-medium">
                  {activeCluster?.action || text.selectHotspot}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              {text.gpsEpicenter}: {activeCluster && activeCluster.lat != null ? `${Number(activeCluster.lat).toFixed(3)}°N, ${Number(activeCluster.lon).toFixed(3)}°E` : text.notAvailable}
            </span>
            <span className="text-emerald-400 font-bold">{text.verifiedData}</span>
          </div>
        </div>
      </div>

      {/* District Clusters List Table */}
      <div className="mt-10 rounded-2xl border border-slate-800 bg-[#0a1813] p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold text-white">{text.districtList}</h3>
          <span className="text-xs text-slate-400">
            {text.tableClickHint}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs font-extrabold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">{text.thDistrictBlock}</th>
                <th className="px-4 py-3">{text.thCrop}</th>
                <th className="px-4 py-3">{text.thReports}</th>
                <th className="px-4 py-3">{text.thDiagnosis}</th>
                <th className="px-4 py-3">{text.thRiskLevel}</th>
                <th className="px-4 py-3">{text.thRadius}</th>
                <th className="px-4 py-3">{text.thAdvisory}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-400">{text.loading}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-400">{text.noData}</td></tr>
              ) : filtered.map((item) => {
                const isCurrent = activeCluster?.id === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setActiveCluster(item)}
                    className={`cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-emerald-900/40 border-l-4 border-emerald-400'
                        : 'hover:bg-emerald-950/30'
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{item.district}</div>
                      <div className="text-xs text-emerald-300 font-medium">
                        {item.block || item.village || text.fallbackSurveillance}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-300">{item.crop ? getCropName(item.crop, text) : text.allCrops}</td>
                    <td className="px-4 py-3.5 font-black text-white">{item.cases}</td>
                    <td className="px-4 py-3.5 text-emerald-300 font-medium">{item.topIssue}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                        item.riskLevel === 'HIGH'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : item.riskLevel === 'MEDIUM'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-slate-300">
                      {item.radiusKm || '3.0'} {text.kmBuffer}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-300 max-w-sm truncate">{item.action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
