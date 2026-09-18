import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { createPestObservation, getPestObservations, getFarms } from '../api/cropApi';

const copy = {
  en: {
    badge: 'PEST & TRAP SURVEILLANCE',
    title: 'Log Pest Observations & Trap Counts',
    subtitle: 'Record trap readings and field sweep counts to track pest pressure, detect outbreaks early, and trigger timely advisories.',
    formTitle: 'Manual Trap / Field Entry',
    formDesc: 'Submit trap counts collected during routine field monitoring by farmers or extension officers.',
    farmLabel: 'Farm / Location',
    selectFarm: 'Select registered farm',
    manualFarmId: 'Or enter custom Farm ID',
    noFarmsFound: 'No farms found (defaulting to Farm #1)',
    pestLabel: 'Pest Species / Type',
    customPestPlaceholder: 'Or enter other pest name...',
    countLabel: 'Trap Count (Observed Pests)',
    countHint: 'Enter the total count of insects caught in the trap or found per sweep.',
    sourceLabel: 'Observation Source',
    sourceManual: 'Manual Trap / Inspection',
    sourceSensor: 'Automated Trap / Sensor',
    timestampLabel: 'Date & Time',
    notesLabel: 'Trap Type / Field Notes (Optional)',
    notesPlaceholder: 'e.g., Yellow sticky trap in North plot, pheromone trap #2...',
    submitBtn: 'Submit Pest Observation',
    submitting: 'Saving Observation...',
    successMsg: 'Pest observation recorded successfully!',
    errorMsg: 'Failed to record observation. Please check required fields.',
    historyTitle: 'Recent Pest Observations',
    historyDesc: 'Latest trap counts and field sweeps across registered farms.',
    filterAll: 'All Farms',
    filterByFarm: 'Filter by Farm:',
    refreshBtn: 'Refresh',
    noHistory: 'No pest observations recorded yet. Log your first count above.',
    colFarm: 'Farm ID',
    colPest: 'Pest Type',
    colCount: 'Count',
    colSource: 'Source',
    colDate: 'Timestamp',
    colPressure: 'Pressure',
    pressureLow: 'Low',
    pressureMed: 'Moderate',
    pressureHigh: 'High Alert',
  },
  bn: {
    badge: 'কীটপতঙ্গ ও ফাঁদ পর্যবেক্ষণ',
    title: 'কীটপতঙ্গ ও ফাঁদের সংখ্যা লগ করুন',
    subtitle: 'ক্ষেতের ফাঁদের সংখ্যা এবং পোকা পর্যবেক্ষণের হিসাব রাখুন যাতে দ্রুত প্রাদুর্ভাব শনাক্ত করা যায়।',
    formTitle: 'হাতে-কলমে ফাঁদ / ক্ষেতের তথ্য নথিভুক্তি',
    formDesc: 'কৃষক বা কৃষি সম্প্রসারণ কর্মীদের সংগ্রহ করা ফাঁদের তথ্য জমা দিন।',
    farmLabel: 'খামার / অবস্থান',
    selectFarm: 'নিবন্ধিত খামার নির্বাচন করুন',
    manualFarmId: 'অথবা খামার আইডি লিখুন',
    noFarmsFound: 'কোনো খামার পাওয়া যায়নি (খামার ১ নির্ধারিত)',
    pestLabel: 'পোকার ধরন / প্রজাতি',
    customPestPlaceholder: 'অন্য পোকার নাম লিখুন...',
    countLabel: 'ফাঁদে ধরা পোকার সংখ্যা',
    countHint: 'ফাঁদে আটক পোকার মোট সংখ্যা লিখুন।',
    sourceLabel: 'উৎস',
    sourceManual: 'হাতে পর্যবেক্ষণ',
    sourceSensor: 'স্বয়ংক্রিয় সেন্সর',
    timestampLabel: 'তারিখ ও সময়',
    notesLabel: 'ফাঁদের ধরন / মন্তব্য (ঐচ্ছিক)',
    notesPlaceholder: 'যেমন: হলুদ আঠালো ফাঁদ, ফেরোমন ফাঁদ...',
    submitBtn: 'পর্যবেক্ষণ সংরক্ষণ করুন',
    submitting: 'সংরক্ষণ করা হচ্ছে...',
    successMsg: 'কীটপতঙ্গের তথ্য সফলভাবে সংরক্ষিত হয়েছে!',
    errorMsg: 'সংরক্ষণ ব্যর্থ হয়েছে। সব প্রয়োজনীয় তথ্য দিন।',
    historyTitle: 'সাম্প্রতিক পর্যবেক্ষণ রেকর্ড',
    historyDesc: 'খামার জুড়ে সাম্প্রতিক ফাঁদের গণনা ও পর্যবেক্ষণের বিবরণ।',
    filterAll: 'সব খামার',
    filterByFarm: 'খামার অনুযায়ী বাছাই:',
    refreshBtn: 'রিফ্রেশ',
    noHistory: 'এখনও কোনো পর্যবেক্ষণ তথ্য জমা হয়নি। প্রথম তথ্য নথিভুক্ত করুন।',
    colFarm: 'খামার আইডি',
    colPest: 'পোকার নাম',
    colCount: 'সংখ্যা',
    colSource: 'উৎস',
    colDate: 'সময়',
    colPressure: 'তীব্রতা',
    pressureLow: 'স্বাভাবিক',
    pressureMed: 'মাঝারি',
    pressureHigh: 'উচ্চ সতর্কতা',
  },
  hi: {
    badge: 'कीट एवं ट्रैप निगरानी',
    title: 'कीट निगरानी और ट्रैप गणना दर्ज करें',
    subtitle: 'खेतों में कीटों के प्रकोप को समय रहते पहचानने और सलाह पाने के लिए ट्रैप की गिनती दर्ज करें।',
    formTitle: 'मैनुअल ट्रैप / फील्ड प्रविष्टि',
    formDesc: 'किसान या कृषि विस्तार कार्यकर्ताओं द्वारा नियमित निगरानी में मिले कीटों की संख्या दर्ज करें।',
    farmLabel: 'खेत / स्थान',
    selectFarm: 'पंजीकृत खेत चुनें',
    manualFarmId: 'या खेत आईडी दर्ज करें',
    noFarmsFound: 'कोई खेत नहीं मिला (खेत #1 डिफ़ॉल्ट)',
    pestLabel: 'कीट का प्रकार / प्रजाति',
    customPestPlaceholder: 'या अन्य कीट का नाम लिखें...',
    countLabel: 'ट्रैप में पाए गए कीटों की संख्या',
    countHint: 'ट्रैप में पकड़े गए कीटों की कुल संख्या दर्ज करें।',
    sourceLabel: 'अवलोकन का स्रोत',
    sourceManual: 'मैनुअल ट्रैप / निरीक्षण',
    sourceSensor: 'सेंसर / ऑटोमेटेड',
    timestampLabel: 'दिनांक व समय',
    notesLabel: 'ट्रैप का प्रकार / टिप्पणी (वैकल्पिक)',
    notesPlaceholder: 'जैसे: पीला स्टिकी ट्रैप, फेरोमोन ट्रैप...',
    submitBtn: 'निगरानी रिकॉर्ड सहेजें',
    submitting: 'सहेजा जा रहा है...',
    successMsg: 'कीट निगरानी रिकॉर्ड सफलतापूर्वक दर्ज किया गया!',
    errorMsg: 'रिकॉर्ड दर्ज करने में विफल। कृपया आवश्यक फ़ील्ड जांचें।',
    historyTitle: 'हालिया कीट निगरानी रिकॉर्ड',
    historyDesc: 'पंजीकृत खेतों से हाल ही में एकत्र किए गए ट्रैप काउंट।',
    filterAll: 'सभी खेत',
    filterByFarm: 'खेत अनुसार छांटें:',
    refreshBtn: 'रिफ्रेश',
    noHistory: 'अभी कोई रिकॉर्ड उपलब्ध नहीं है। ऊपर पहला रिकॉर्ड दर्ज करें।',
    colFarm: 'खेत आईडी',
    colPest: 'कीट का प्रकार',
    colCount: 'संख्या',
    colSource: 'स्रोत',
    colDate: 'समय',
    colPressure: 'दबाव',
    pressureLow: 'सामान्य',
    pressureMed: 'मध्यम',
    pressureHigh: 'उच्च चेतावनी',
  },
};

const COMMON_PESTS = [
  'Fall Armyworm',
  'Yellow Stem Borer',
  'Aphids',
  'Whitefly',
  'Fruit & Shoot Borer',
  'Brown Planthopper',
  'Thrips',
  'Termites',
  'Cutworm',
  'Leafhopper',
];

export default function PestLogPage() {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;

  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('1');
  const [pestType, setPestType] = useState('Fall Armyworm');
  const [customPest, setCustomPest] = useState('');
  const [count, setCount] = useState('5');
  const [source, setSource] = useState('manual');
  const [timestamp, setTimestamp] = useState(() => new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  const [observations, setObservations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [filterFarmId, setFilterFarmId] = useState('');

  // Load registered farms
  useEffect(() => {
    getFarms()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setFarms(list);
        if (list.length > 0) {
          setSelectedFarmId(String(list[0].id));
        }
      })
      .catch((err) => {
        console.warn('Could not load farms list', err);
      });
  }, []);

  // Fetch recent observations
  const fetchObservations = (farmId) => {
    setLoadingHistory(true);
    getPestObservations(farmId || null)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setObservations(list);
      })
      .catch((err) => {
        console.warn('Could not fetch observations', err);
      })
      .finally(() => setLoadingHistory(false));
  };

  useEffect(() => {
    fetchObservations(filterFarmId);
  }, [filterFarmId]);

  const activePestName = customPest.trim() || pestType;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const numericCount = parseInt(count, 10);
    const numericFarmId = parseInt(selectedFarmId, 10);

    if (isNaN(numericFarmId) || numericFarmId <= 0) {
      setFeedback({ type: 'error', message: 'Please provide a valid Farm ID.' });
      return;
    }

    if (!activePestName.trim()) {
      setFeedback({ type: 'error', message: 'Please select or enter a pest type.' });
      return;
    }

    if (isNaN(numericCount) || numericCount < 0) {
      setFeedback({ type: 'error', message: 'Count cannot be negative.' });
      return;
    }

    let isoTimestamp = new Date().toISOString();
    if (timestamp) {
      try {
        isoTimestamp = new Date(timestamp).toISOString();
      } catch {
        isoTimestamp = new Date().toISOString();
      }
    }

    const payload = {
      farmId: numericFarmId,
      pestType: activePestName.trim(),
      count: numericCount,
      source: source || 'manual',
      timestamp: isoTimestamp,
    };

    setSubmitting(true);
    try {
      await createPestObservation(payload);
      setFeedback({
        type: 'success',
        message: `${t.successMsg} (${activePestName}: ${numericCount} on Farm #${numericFarmId})`,
      });
      // Reset some fields
      setCustomPest('');
      setNotes('');
      setTimestamp(new Date().toISOString().slice(0, 16));
      // Refresh history
      fetchObservations(filterFarmId);
    } catch (err) {
      const errMsg = err?.response?.data?.message || t.errorMsg;
      setFeedback({ type: 'error', message: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const getPressureBadge = (cnt) => {
    if (cnt > 20) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          {t.pressureHigh}
        </span>
      );
    }
    if (cnt >= 6) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
          {t.pressureMed}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        {t.pressureLow}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0a231c]/90 via-[#0d2f25]/85 to-[#061712]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-300">
            <span>🪤</span> {t.badge}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-2 text-base text-emerald-100/80 leading-relaxed sm:text-lg">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Main Grid: Form + History */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Log Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0c241d]/85 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <div className="border-b border-emerald-500/15 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📝</span> {t.formTitle}
              </h2>
              <p className="mt-1 text-xs text-emerald-200/70">
                {t.formDesc}
              </p>
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`mt-4 rounded-xl border p-3.5 text-sm transition-all ${
                  feedback.type === 'success'
                    ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-200'
                    : 'border-rose-500/40 bg-rose-950/60 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{feedback.type === 'success' ? '✅' : '⚠️'}</span>
                  <span>{feedback.message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Farm Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  {t.farmLabel}
                </label>
                {farms.length > 0 ? (
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    className="w-full rounded-xl border border-emerald-500/30 bg-[#061813] px-3.5 py-2.5 text-sm text-white outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/50"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} (ID #{f.id}) — {f.district || 'West Bengal'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    min="1"
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    placeholder={t.manualFarmId}
                    className="w-full rounded-xl border border-emerald-500/30 bg-[#061813] px-3.5 py-2.5 text-sm text-white placeholder-emerald-400/40 outline-none focus:border-lime-400"
                  />
                )}
              </div>

              {/* Pest Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  {t.pestLabel}
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {COMMON_PESTS.slice(0, 6).map((pest) => {
                    const isSelected = pestType === pest && !customPest;
                    return (
                      <button
                        type="button"
                        key={pest}
                        onClick={() => {
                          setPestType(pest);
                          setCustomPest('');
                        }}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-lime-400 text-emerald-950 font-bold shadow-md shadow-lime-400/20'
                            : 'bg-emerald-900/40 text-emerald-200 hover:bg-emerald-800/50 border border-emerald-700/30'
                        }`}
                      >
                        {pest}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={customPest}
                  onChange={(e) => setCustomPest(e.target.value)}
                  placeholder={t.customPestPlaceholder}
                  className="w-full rounded-xl border border-emerald-500/30 bg-[#061813] px-3.5 py-2 text-sm text-white placeholder-emerald-400/40 outline-none focus:border-lime-400"
                />
              </div>

              {/* Trap Count with Increment / Decrement */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    {t.countLabel}
                  </label>
                  {getPressureBadge(parseInt(count, 10) || 0)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCount(String(Math.max(0, (parseInt(count, 10) || 0) - 1)))}
                    className="h-10 w-10 rounded-xl border border-emerald-500/30 bg-emerald-900/30 text-lg font-bold text-emerald-200 hover:bg-emerald-800/50 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="flex-1 rounded-xl border border-emerald-500/30 bg-[#061813] px-3.5 py-2 text-center text-lg font-bold text-white outline-none focus:border-lime-400"
                  />
                  <button
                    type="button"
                    onClick={() => setCount(String((parseInt(count, 10) || 0) + 1))}
                    className="h-10 w-10 rounded-xl border border-emerald-500/30 bg-emerald-900/30 text-lg font-bold text-emerald-200 hover:bg-emerald-800/50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-emerald-300/60">{t.countHint}</p>
              </div>

              {/* Source Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  {t.sourceLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSource('manual')}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold border transition-all ${
                      source === 'manual'
                        ? 'border-lime-400 bg-lime-400/15 text-lime-200 shadow-inner'
                        : 'border-emerald-800/50 bg-[#061813] text-emerald-300 hover:bg-emerald-900/30'
                    }`}
                  >
                    <span>🖐️</span> {t.sourceManual}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSource('sensor')}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold border transition-all ${
                      source === 'sensor'
                        ? 'border-lime-400 bg-lime-400/15 text-lime-200 shadow-inner'
                        : 'border-emerald-800/50 bg-[#061813] text-emerald-300 hover:bg-emerald-900/30'
                    }`}
                  >
                    <span>📡</span> {t.sourceSensor}
                  </button>
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  {t.timestampLabel}
                </label>
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-[#061813] px-3.5 py-2 text-sm text-white outline-none focus:border-lime-400"
                />
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                  {t.notesLabel}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full rounded-xl border border-emerald-500/30 bg-[#061813] px-3.5 py-2 text-sm text-white placeholder-emerald-400/40 outline-none focus:border-lime-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? t.submitting : t.submitBtn}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live History & Trend Feed (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0c241d]/85 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/15 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📊</span> {t.historyTitle}
                </h2>
                <p className="mt-1 text-xs text-emerald-200/70">
                  {t.historyDesc}
                </p>
              </div>

              {/* Filter by Farm */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-300 whitespace-nowrap">{t.filterByFarm}</span>
                <select
                  value={filterFarmId}
                  onChange={(e) => setFilterFarmId(e.target.value)}
                  className="rounded-lg border border-emerald-500/30 bg-[#061813] px-2.5 py-1.5 text-xs text-white outline-none focus:border-lime-400"
                >
                  <option value="">{t.filterAll}</option>
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      Farm #{f.id} ({f.name})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => fetchObservations(filterFarmId)}
                  disabled={loadingHistory}
                  className="rounded-lg border border-emerald-600/40 bg-emerald-800/40 px-2.5 py-1.5 text-xs text-emerald-200 hover:bg-emerald-700/50 transition-colors"
                >
                  {loadingHistory ? '...' : '↻'}
                </button>
              </div>
            </div>

            {/* Observations Table / List */}
            <div className="mt-5">
              {observations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-emerald-700/30 bg-[#071914]/60 p-8 text-center">
                  <span className="text-3xl">📭</span>
                  <p className="mt-2 text-sm text-emerald-200/70">
                    {loadingHistory ? 'Loading records...' : t.noHistory}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-emerald-800/40 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        <th className="pb-3 pr-2">{t.colFarm}</th>
                        <th className="pb-3 px-2">{t.colPest}</th>
                        <th className="pb-3 px-2">{t.colCount}</th>
                        <th className="pb-3 px-2">{t.colPressure}</th>
                        <th className="pb-3 px-2">{t.colSource}</th>
                        <th className="pb-3 pl-2 text-right">{t.colDate}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-800/20">
                      {observations.map((obs) => (
                        <tr key={obs.id} className="hover:bg-emerald-900/20 transition-colors">
                          <td className="py-3 pr-2 font-mono text-xs text-emerald-300">
                            #{obs.farmId}
                          </td>
                          <td className="py-3 px-2 font-semibold text-white">
                            {obs.pestType}
                          </td>
                          <td className="py-3 px-2 font-mono text-base font-bold text-lime-300">
                            {obs.count}
                          </td>
                          <td className="py-3 px-2">
                            {getPressureBadge(obs.count)}
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                obs.source === 'sensor'
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  : 'bg-emerald-800/40 text-emerald-300 border border-emerald-700/30'
                              }`}
                            >
                              {obs.source === 'sensor' ? '📡 Sensor' : '🖐️ Manual'}
                            </span>
                          </td>
                          <td className="py-3 pl-2 text-right font-mono text-xs text-emerald-200/60 whitespace-nowrap">
                            {obs.timestamp
                              ? new Date(obs.timestamp).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
