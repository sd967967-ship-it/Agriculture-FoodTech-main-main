import React, { useCallback, useEffect, useState } from 'react';
import { getHotspots } from '../api/cropApi';
import { useLanguage } from '../context/LanguageContext';

function LiveHotspotMap({ hotspots, onSelect, onMapError }) {
  const mapElement = React.useRef(null);
  const mapInstance = React.useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loadLeaflet = () => new Promise((resolve, reject) => {
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

    const loadStyles = () => {
      if (document.querySelector('link[data-fasalsathi-leaflet]')) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.dataset.fasalsathiLeaflet = 'true';
      document.head.appendChild(link);
    };

    loadStyles();
    loadLeaflet().then((L) => {
      if (cancelled || !mapElement.current || mapInstance.current) return;
      const map = L.map(mapElement.current, { scrollWheelZoom: true }).setView([23.5, 87.8], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);
      map.on('tileerror', onMapError);
      mapInstance.current = map;
    }).catch(onMapError);

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onMapError]);

  useEffect(() => {
    const map = mapInstance.current;
    const L = window.L;
    if (!map || !L) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });
    hotspots.forEach((item) => {
      const color = item.riskLevel === 'HIGH' ? '#ef4444' : item.riskLevel === 'MEDIUM' ? '#fbbf24' : '#34d399';
      const marker = L.circleMarker([Number(item.lat), Number(item.lon)], {
        radius: Math.max(8, Math.min(18, 6 + Number(item.cases || 0))),
        color,
        fillColor: color,
        fillOpacity: 0.75,
      }).addTo(map);
      marker.bindPopup(`<strong>${item.district}</strong><br>${item.topIssue}<br>${item.cases} reported case(s)`);
      marker.on('click', () => onSelect(item));
    });
  }, [hotspots, onSelect]);

  return <div ref={mapElement} className="h-full w-full" aria-label="West Bengal hotspot map" />;
}

const textContent = {
  en: {
    eyebrow: 'GEOSPATIAL SURVEILLANCE',
    title: 'Pest & Disease Hotspot Map',
    subtitle: 'Real-time 14-day cluster tracking across West Bengal districts for early preventive interventions.',
    filterCrop: 'Crop Type:',
    filterTime: 'Time Window:',
    allCrops: 'All Crops',
    days7: 'Last 7 Days',
    days14: 'Last 14 Days',
    days30: 'Last 30 Days',
    highRisk: 'High Risk (>10 cases)',
    modRisk: 'Moderate Risk (5-10 cases)',
    lowRisk: 'Low Risk (<5 cases)',
    districtList: 'Active District Clusters',
    cases: 'Incident Reports',
    topIssue: 'Primary Disease/Pest',
    action: 'Recommended Field Action',
    noData: 'No active hotspot clusters detected for the selected filters.',
    loading: 'Loading geospatial surveillance data...',
    mapNote: 'Interactive West Bengal District Risk Map based on recent field diagnoses & trap counts.',
  },
  bn: {
    eyebrow: 'ভূ-স্থানিক নজরদারি',
    title: 'পোকা ও রোগ হটস্পট মানচিত্র',
    subtitle: 'রোগ ছড়ানোর আগেই প্রতিরোধমূলক ব্যবস্থার জন্য পশ্চিমবঙ্গ জুড়ে ১৪ দিনের ক্লাস্টার ট্র্যাকিং।',
    filterCrop: 'ফসলের ধরন:',
    filterTime: 'সময়সীমা:',
    allCrops: 'সকল ফসল',
    days7: 'গত ৭ দিন',
    days14: 'গত ১৪ দিন',
    days30: 'গত ৩০ দিন',
    highRisk: 'উচ্চ ঝুঁকি (>১০টি কেস)',
    modRisk: 'মাঝারি ঝুঁকি (৫-১০টি কেস)',
    lowRisk: 'কম ঝুঁকি (<৫টি কেস)',
    districtList: 'সক্রিয় জেলা ক্লাস্টার',
    cases: 'প্রতিবেদন সংখ্যা',
    topIssue: 'প্রধান রোগ/পোকা',
    action: 'সুপারিশকৃত মাঠের ব্যবস্থা',
    noData: 'নির্বাচিত ফিল্টারের জন্য কোনো সক্রিয় হটস্পট ক্লাস্টার পাওয়া যায়নি।',
    loading: 'ভূ-স্থানিক নজরদারি তথ্য লোড হচ্ছে...',
    mapNote: 'সাম্প্রতিক মাঠ পরীক্ষা ও ফাঁদের হিসাবের ভিত্তিতে পশ্চিমবঙ্গের জেলা ঝুঁকি মানচিত্র।',
  },
  hi: {
    eyebrow: 'भू-स्थानिक निगरानी',
    title: 'कीट और रोग हॉटस्पॉट मानचित्र',
    subtitle: 'रोग फैलने से पहले निवारक उपायों के लिए पश्चिम बंगाल के जिलों में 14 दिवसीय क्लस्टर ट्रैकिंग।',
    filterCrop: 'फसल का प्रकार:',
    filterTime: 'समय सीमा:',
    allCrops: 'सभी फसलें',
    days7: 'पिछले 7 दिन',
    days14: 'पिछले 14 दिन',
    days30: 'पिछले 30 दिन',
    highRisk: 'उच्च जोखिम (>10 मामले)',
    modRisk: 'मध्यम जोखिम (5-10 मामले)',
    lowRisk: 'कम जोखिम (<5 मामले)',
    districtList: 'सक्रिय जिला क्लस्टर',
    cases: 'रिपोर्ट संख्या',
    topIssue: 'मुख्य बीमारी/कीट',
    action: 'अनुशंसित मैदानी कार्रवाई',
    noData: 'चयनित फ़िल्टर के लिए कोई सक्रिय हॉटस्पॉट क्लस्टर नहीं मिला।',
    loading: 'भू-स्थानिक निगरानी डेटा लोड हो रहा है...',
    mapNote: 'हाल के मैदानी निदान और जाल की गिनती के आधार पर पश्चिम बंगाल जिला जोखिम मानचित्र।',
  },
};

export default function HotspotsPage() {
  const { language } = useLanguage();
  const text = textContent[language] || textContent.en;
  
  const [selectedCrop, setSelectedCrop] = useState('');
  const [timeWindow, setTimeWindow] = useState('14');
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCluster, setActiveCluster] = useState(null);
  const [mapError, setMapError] = useState(false);
  const handleMapError = useCallback(() => setMapError(true), []);

  useEffect(() => {
    setLoading(true);
    getHotspots({ crop: selectedCrop, days: timeWindow })
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setHotspots(data);
          setActiveCluster(data[0]);
        } else {
          setHotspots([]);
          setActiveCluster(null);
        }
      })
      .catch(() => {
        setHotspots([]);
        setActiveCluster(null);
      })
      .finally(() => setLoading(false));
  }, [selectedCrop, timeWindow]);

  const filtered = hotspots;

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
              <option value="Rice">Rice</option>
              <option value="Potato">Potato</option>
              <option value="Tomato">Tomato</option>
              <option value="Mustard">Mustard</option>
              <option value="Chilli">Chilli</option>
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
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-500 shadow-sm" /> {text.highRisk}</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-amber-400 shadow-sm" /> {text.modRisk}</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-400 shadow-sm" /> {text.lowRisk}</span>
        </div>
      </div>

      {/* Main Map & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Map Section */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0c1e18] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🗺️ West Bengal Surveillance Map
            </h2>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          {/* Real West Bengal map using OpenStreetMap tiles. */}
          <div className="relative h-[320px] overflow-hidden rounded-xl border border-emerald-900/50 bg-[#081510]">
            {mapError ? (
              <div className="grid h-full place-items-center p-6 text-center text-sm text-slate-300">
                The map tiles could not load. The verified hotspot list below is still available.
              </div>
            ) : (
              <LiveHotspotMap hotspots={filtered} onSelect={setActiveCluster} onMapError={handleMapError} />
            )}
          </div>

          <p className="mt-4 text-xs text-slate-400 italic">
            {text.mapNote}
          </p>
        </div>

        {/* Selected Cluster Details Drawer */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#0b221a] to-[#071611] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Selected District</span>
                <h3 className="text-2xl font-black text-white">{activeCluster?.district || 'West Bengal'}</h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                activeCluster?.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                activeCluster?.riskLevel === 'MEDIUM' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
              }`}>
                {activeCluster?.riskLevel || 'NO DATA'} {activeCluster ? 'RISK' : ''}
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-900/70 p-3.5 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">{text.topIssue}</p>
                <p className="mt-1 text-base font-bold text-emerald-300">🦠 {activeCluster?.topIssue || 'No recent reports'}</p>
              </div>

              <div className="rounded-xl bg-slate-900/70 p-3.5 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">{text.cases}</p>
                <p className="mt-1 text-2xl font-black text-white">{activeCluster?.cases || 0} <span className="text-xs font-normal text-slate-400">reported cases</span></p>
              </div>

              <div className="rounded-xl bg-emerald-950/50 p-4 border border-emerald-800/40">
                <p className="text-xs font-extrabold text-lime-400 uppercase tracking-wider">{text.action}</p>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed font-medium">
                  {activeCluster?.action || 'Select a hotspot to view field guidance.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Coordinates: {activeCluster ? `${Number(activeCluster.lat).toFixed(2)}°N, ${Number(activeCluster.lon).toFixed(2)}°E` : 'Not available'}</span>
            <span className="text-emerald-400 font-bold">Updated from recent reports</span>
          </div>
        </div>
      </div>

      {/* District Clusters List Table */}
      <div className="mt-10 rounded-2xl border border-slate-800 bg-[#0a1813] p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">{text.districtList}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs font-extrabold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Reports</th>
                <th className="px-4 py-3">Primary Diagnosis</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Field Advisory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400">{text.loading}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400">{text.noData}</td></tr>
              ) : filtered.map((item) => (
                <tr key={item.id} onClick={() => setActiveCluster(item)} className="cursor-pointer transition-colors hover:bg-emerald-950/30">
                  <td className="px-4 py-3.5 font-bold text-white">{item.district}</td>
                  <td className="px-4 py-3.5 font-black text-slate-200">{item.cases}</td>
                  <td className="px-4 py-3.5 text-emerald-300 font-medium">{item.topIssue}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      item.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-300' : item.riskLevel === 'MEDIUM' ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-400/20 text-emerald-300'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-300 max-w-md truncate">{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
