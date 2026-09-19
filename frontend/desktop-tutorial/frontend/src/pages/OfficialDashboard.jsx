import React, { useEffect, useState } from 'react';
import { getAdminDashboard, getCurrentUser } from '../api/cropApi';
import { useLanguage } from '../context/LanguageContext';

const textContent = {
  en: {
    eyebrow: 'AGRICULTURE OFFICIAL PORTAL',
    title: 'State Agriculture Surveillance Dashboard',
    subtitle: 'Comprehensive monitoring of district disease trends, expert review queues, follow-up compliance rates, and pest trap analytics.',
    kpiHotspots: 'Active Hotspots',
    kpiReviews: 'Pending Expert Reviews',
    kpiCompliance: 'Follow-Up Compliance',
    kpiSurveillance: 'Registered Farms',
    chartDistrictTitle: 'District Disease Incidents Breakdown',
    chartTrendTitle: '14-Day Field Incident & Pest Trapping Trends',
    reviewQueueTitle: 'Pending Expert & Laboratory Escalation Queue',
    colId: 'Sample / Referral ID',
    colFarmer: 'Farmer / Extension Worker',
    colCrop: 'Crop & District',
    colDiagnosis: 'AI Diagnosis Candidate',
    colStatus: 'Status',
    colAction: 'Action',
    approve: 'Approve Advisory',
    assign: 'Assign KVK Officer',
    approvedToast: 'Advisory approved and dispatched to farmer via SMS & App notification.',
    exportCsv: '📥 Export CSV Report',
    kpiHotspotsSub: 'High severity clusters (14d)',
    kpiReviewsSub: 'Escalated KVK laboratory queue',
    kpiComplianceSub: '7-day follow-up field check-ins',
    kpiSurveillanceSub: 'Monitored agricultural holdings',
    legendBlight: 'Blight',
    legendBlast: 'Blast',
    legendAphid: 'Aphid',
    incidents: 'incidents',
    legendDiagnoses: 'Diagnoses',
    legendTraps: 'Trap Counts',
    pendingItems: 'pending items',
    allReviewed: 'All expert escalations and laboratory referrals have been reviewed and dispatched.',
    colDistrict: 'District',
    colTotal: 'Total',
  },
  bn: {
    eyebrow: 'কৃষি আধিকারিক পোর্টাল',
    title: 'রাজ্য কৃষি নজরদারি ড্যাশবোর্ড',
    subtitle: 'জেলাভিত্তিক রোগের প্রবণতা, বিশেষজ্ঞ পর্যালোচনা সারি, অনুস্মারক পালনের হার এবং পোকা ফাঁদের তথ্য পর্যবেক্ষণ।',
    kpiHotspots: 'সক্রিয় হটস্পট',
    kpiReviews: 'অনুমোদনের অপেক্ষায় কেস',
    kpiCompliance: 'অনুসরণ পালনের হার',
    kpiSurveillance: 'নিবন্ধিত খামার',
    chartDistrictTitle: 'জেলাভিত্তিক রোগের প্রাদুর্ভাব',
    chartTrendTitle: '১৪ দিনের ফিল্ড রিপোর্ট ও ফাঁদের প্রবণতা',
    reviewQueueTitle: 'বিশেষজ্ঞ ও ল্যাব অনুসন্ধানের সারি',
    colId: 'নমুনা / রেফারেল আইডি',
    colFarmer: 'কৃষক / সমপ্রসারণ কর্মী',
    colCrop: 'ফসল ও জেলা',
    colDiagnosis: 'এআই রোগ নির্ণয়',
    colStatus: 'অবস্থা',
    colAction: 'ব্যবস্থা',
    approve: 'পরামর্শ অনুমোদন',
    assign: 'KVK অফিসার নিয়োগ',
    approvedToast: 'পরামর্শ অনুমোদিত হয়েছে এবং এসএমএস ও অ্যাপের মাধ্যমে পাঠানো হয়েছে।',
    exportCsv: '📥 CSV রিপোর্ট ডাউনলোড',
    kpiHotspotsSub: 'উচ্চ ঝুঁকির ক্লাস্টার (১৪ দিন)',
    kpiReviewsSub: 'কেভিকে ল্যাবরেটরি পর্যালোচনা সারি',
    kpiComplianceSub: '৭ দিনের ফলো-আপ ক্ষেত্র পরিদর্শন',
    kpiSurveillanceSub: 'নজরদারির আওতাধীন কৃষি খামার',
    legendBlight: 'ব্লাইট / ধ্বসা',
    legendBlast: 'ব্লাস্ট',
    legendAphid: 'জাবপোকা',
    incidents: 'টি ঘটনা',
    legendDiagnoses: 'রোগ নির্ণয়',
    legendTraps: 'ফাঁদের সংখ্যা',
    pendingItems: 'টি অপেক্ষমান',
    allReviewed: 'সকল বিশেষজ্ঞ পর্যালোচনা ও ল্যাব রেফারেল সম্পন্ন ও পাঠানো হয়েছে।',
    colDistrict: 'জেলা',
    colTotal: 'মোট',
  },
  hi: {
    eyebrow: 'कृषि अधिकारी पोर्टल',
    title: 'राज्य कृषि निगरानी डैशबोर्ड',
    subtitle: 'जिलावार रोग रुझान, विशेषज्ञ समीक्षा कतार, अनुपालन दर और कीट जाल विश्लेषण का व्यापक अवलोकन।',
    kpiHotspots: 'सक्रिय हॉटस्पॉट',
    kpiReviews: 'लंबित विशेषज्ञ समीक्षाएं',
    kpiCompliance: 'फॉलो-अप अनुपालन दर',
    kpiSurveillance: 'पंजीकृत खेत',
    chartDistrictTitle: 'जिलावार रोग प्रकोप ब्रेकडाउन',
    chartTrendTitle: '14-दिवसीय मैदानी रिपोर्ट और जाल रुझान',
    reviewQueueTitle: 'लंबित विशेषज्ञ और प्रयोगशाला कतार',
    colId: 'नमूना / रेफरल आईडी',
    colFarmer: 'किसान / विस्तार कार्यकर्ता',
    colCrop: 'फसल और जिला',
    colDiagnosis: 'एआई निदान',
    colStatus: 'स्थिति',
    colAction: 'कार्रवाई',
    approve: 'सलाह स्वीकृत करें',
    assign: 'केवीके अधिकारी सौंपें',
    approvedToast: 'सलाह स्वीकृत की गई और एसएमएस तथा ऐप सूचना द्वारा भेजी गई।',
    exportCsv: '📥 सीएसवी रिपोर्ट डाउनलोड',
    kpiHotspotsSub: 'उच्च जोखिम वाले क्लस्टर (14 दिन)',
    kpiReviewsSub: 'केवीके प्रयोगशाला समीक्षा कतार',
    kpiComplianceSub: '7-दिवसीय फॉलो-अप निरीक्षण',
    kpiSurveillanceSub: 'निगरानी में पंजीकृत खेत',
    legendBlight: 'झुलसा रोग',
    legendBlast: 'ब्लास्ट रोग',
    legendAphid: 'माहू / एफिड',
    incidents: 'घटनाएं',
    legendDiagnoses: 'रोग निदान',
    legendTraps: 'जाल गणना',
    pendingItems: 'लंबित मामले',
    allReviewed: 'सभी विशेषज्ञ समीक्षाएं और प्रयोगशाला रेफरल संसाधित और प्रेषित कर दिए गए हैं।',
    colDistrict: 'ज़िला',
    colTotal: 'कुल',
  },
};

const DISTRICT_DATA = [
  { district: 'Nadia', Blight: 18, Blast: 6, Aphid: 4, Total: 28 },
  { district: 'Murshidabad', Blight: 12, Blast: 14, Aphid: 8, Total: 34 },
  { district: 'Hooghly', Blight: 8, Blast: 4, Aphid: 15, Total: 27 },
  { district: 'Bardhaman', Blight: 15, Blast: 9, Aphid: 6, Total: 30 },
  { district: 'Bankura', Blight: 6, Blast: 11, Aphid: 5, Total: 22 },
];

const TREND_DATA = [
  { day: 'Sep 03', reports: 12, traps: 45 },
  { day: 'Sep 05', reports: 18, traps: 62 },
  { day: 'Sep 07', reports: 15, traps: 58 },
  { day: 'Sep 09', reports: 24, traps: 79 },
  { day: 'Sep 11', reports: 29, traps: 94 },
  { day: 'Sep 13', reports: 22, traps: 88 },
  { day: 'Sep 15', reports: 35, traps: 112 },
  { day: 'Sep 17', reports: 31, traps: 105 },
];

const DEFAULT_REVIEWS = [
  { id: 'REF-2026-881', farmer: 'Subhash Mondal', location: 'Nadia (Chapra)', crop: 'Potato (Tuber Bulking)', diagnosis: 'Suspected Late Blight Resistance', status: 'PENDING_EXPERT' },
  { id: 'REF-2026-882', farmer: 'Animesh Ghosh', location: 'Murshidabad (Beldanga)', crop: 'Rice (Flowering)', diagnosis: 'BPH Infestation > ETL Threshold', status: 'PENDING_LAB' },
  { id: 'REF-2026-883', farmer: 'Priya Biswas', location: 'Hooghly (Singur)', crop: 'Tomato (Fruiting)', diagnosis: 'Leaf Curl Virus Vector Infestation', status: 'PENDING_EXPERT' },
];

const MOCK_SUMMARY = {
  activeHotspots: 6,
  complianceRate: 92.4,
  farmCount: 33,
};

export default function OfficialDashboard() {
  const { language } = useLanguage();
  const text = textContent[language] || textContent.en;

  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [toast, setToast] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('fasal-sathi-session-token');
    if (!token) return;
    getCurrentUser()
      .then(({ data }) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    getAdminDashboard()
      .then(({ data }) => {
        setSummary(data);
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.warn('Using default admin dashboard summary fallback', err));
  }, []);

  const handleApprove = (id) => {
    if (currentUser?.role !== 'ADMIN') return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setToast(text.approvedToast);
    setTimeout(() => setToast(''), 4000);
  };

  const handleExportCSV = () => {
    const headers = [
      text.colDistrict || 'District',
      `${text.legendBlight || 'Blight'} ${text.incidents || 'incidents'}`,
      `${text.legendBlast || 'Blast'} ${text.incidents || 'incidents'}`,
      `${text.legendAphid || 'Aphid'} ${text.incidents || 'incidents'}`,
      text.colTotal || 'Total'
    ];
    const rows = DISTRICT_DATA.map((d) => [d.district, d.Blight, d.Blast, d.Aphid, d.Total]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `state_surveillance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 text-slate-100">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-lime-300 border border-lime-400/20">
            {text.eyebrow}
          </span>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            {text.title}
          </h1>
          <p className="mt-2 text-slate-300 max-w-3xl">
            {text.subtitle}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="rounded-xl border border-emerald-500/40 bg-emerald-950/80 hover:bg-emerald-900 px-4 py-2.5 text-sm font-bold text-emerald-200 shadow-lg backdrop-blur-md transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-2"
        >
          {text.exportCsv}
        </button>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-950/80 p-4 text-emerald-200 shadow-xl flex items-center gap-3">
          <span className="text-xl">✅</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Top 4 KPI Metric Cards */}
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/40 to-[#120808] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">{text.kpiHotspots}</span>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="mt-3 text-3xl font-black text-white">{summary?.activeHotspots ?? MOCK_SUMMARY.activeHotspots}</p>
          <p className="mt-1 text-xs text-slate-400">{text.kpiHotspotsSub}</p>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-950/40 to-[#141006] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">{text.kpiReviews}</span>
            <span className="text-2xl">👨‍🔬</span>
          </div>
          <p className="mt-3 text-3xl font-black text-white">{reviews.length}</p>
          <p className="mt-1 text-xs text-slate-400">{text.kpiReviewsSub}</p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-950/40 to-[#071b14] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{text.kpiCompliance}</span>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="mt-3 text-3xl font-black text-white">{summary?.complianceRate ?? MOCK_SUMMARY.complianceRate}%</p>
          <p className="mt-1 text-xs text-slate-400">{text.kpiComplianceSub}</p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 to-[#07161c] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">{text.kpiSurveillance}</span>
            <span className="text-2xl">🌾</span>
          </div>
          <p className="mt-3 text-3xl font-black text-white">{summary?.farmCount ?? MOCK_SUMMARY.farmCount}</p>
          <p className="mt-1 text-xs text-slate-400">{text.kpiSurveillanceSub}</p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* District Breakdown SVG Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a1914] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">{text.chartDistrictTitle}</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> {text.legendBlight}</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> {text.legendBlast}</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> {text.legendAphid}</span>
            </div>
          </div>
          <div className="space-y-4">
            {DISTRICT_DATA.map((item) => (
              <div key={item.district} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{item.district}</span>
                  <span>{item.Total} {text.incidents}</span>
                </div>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-900">
                  <div style={{ width: `${(item.Blight / 40) * 100}%` }} className="bg-red-500 transition-all" title={`Blight: ${item.Blight}`} />
                  <div style={{ width: `${(item.Blast / 40) * 100}%` }} className="bg-amber-400 transition-all" title={`Blast: ${item.Blast}`} />
                  <div style={{ width: `${(item.Aphid / 40) * 100}%` }} className="bg-emerald-400 transition-all" title={`Aphid: ${item.Aphid}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 14-Day Trapping Trend SVG Line Chart */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a1914] p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">{text.chartTrendTitle}</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> {text.legendDiagnoses}</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-lime-400" /> {text.legendTraps}</span>
            </div>
          </div>
          <div className="relative w-full h-56 flex items-end justify-between pt-6 border-b border-slate-800 gap-2">
            {TREND_DATA.map((t, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div style={{ height: `${(t.reports / 40) * 100}%` }} className="w-2.5 rounded-t bg-sky-400 group-hover:bg-sky-300 transition-all" title={`Diagnoses: ${t.reports}`} />
                  <div style={{ height: `${(t.traps / 120) * 100}%` }} className="w-2.5 rounded-t bg-lime-400 group-hover:bg-lime-300 transition-all" title={`Traps: ${t.traps}`} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono truncate">{t.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expert Review Queue Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a1813] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{text.reviewQueueTitle}</h3>
          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
            {reviews.length} {text.pendingItems}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs font-extrabold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">{text.colId}</th>
                <th className="px-4 py-3">{text.colFarmer}</th>
                <th className="px-4 py-3">{text.colCrop}</th>
                <th className="px-4 py-3">{text.colDiagnosis}</th>
                <th className="px-4 py-3">{text.colStatus}</th>
                <th className="px-4 py-3 text-right">{text.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                    {text.allReviewed}
                  </td>
                </tr>
              ) : (
                reviews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{item.id}</td>
                    <td className="px-4 py-3.5 font-bold text-white">{item.farmer}</td>
                    <td className="px-4 py-3.5 text-slate-300">{item.crop} · <span className="text-emerald-400">{item.location}</span></td>
                    <td className="px-4 py-3.5 text-amber-300 font-semibold">{item.diagnosis}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-black text-amber-300 uppercase">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {currentUser?.role === 'ADMIN' && <>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 transition-colors"
                        >
                          {text.approve}
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 transition-colors"
                        >
                          {text.assign}
                        </button>
                      </>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
