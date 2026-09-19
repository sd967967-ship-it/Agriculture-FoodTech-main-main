import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProfitCalculator } from './HomePage';
import { useLanguage } from '../context/LanguageContext';
import { getMandiPrices } from '../api/cropApi';

const copy = {
  en: {
    eyebrow: 'FARM TOOLS', title: 'Practical tools for today’s decisions', intro: 'Keep field history, plan irrigation, understand support schemes, and estimate crop profit in one place.', history: 'Pest & disease history', historyCopy: 'Record what you found and what you did so the next inspection starts with context.', crop: 'Crop', issue: 'Issue or symptom', date: 'Date', action: 'Action taken', save: 'Save record', saved: 'Saved records', remove: 'Remove', empty: 'No history yet. Add the first inspection below.', irrigation: 'Irrigation scheduler', irrigationCopy: 'A simple reminder based on your crop, soil, and the next watering date.', soil: 'Soil type', nextWater: 'Next watering date', frequency: 'Frequency (days)', schedule: 'Save schedule', scheduleSaved: 'Irrigation schedule saved on this device.', schemes: 'Government scheme finder', schemesCopy: 'Start with official portals and check eligibility with your local agriculture office.', all: 'All crops', open: 'Open official portal', profit: 'Farm profit calculator', soilOptions: ['Loam', 'Clay', 'Sandy', 'Laterite'], schemeCrop: 'Crop or farm need', schemesFor: 'Showing schemes for', general: 'General farming', schemesList: [
      ['PM-KISAN', 'Income support for eligible landholding farmer families.', 'https://pmkisan.gov.in/'],
      ['PM Fasal Bima Yojana', 'Crop insurance support against covered natural risks.', 'https://pmfby.gov.in/'],
      ['Soil Health Card', 'Soil testing and nutrient recommendations for your field.', 'https://soilhealth.dac.gov.in/'],
    ],
    pestBadge: '🪤 NEW FEATURE',
    pestBannerTitle: 'Pest & Trap Count Surveillance',
    pestBannerDesc: 'Record manual trap readings and field sweep counts to track regional pest pressure in real time.',
    pestBannerBtn: 'Open Pest Logger →',
  },
  bn: {
    eyebrow: 'কৃষি সরঞ্জাম', title: 'আজকের সিদ্ধান্তে কাজে লাগে এমন সরঞ্জাম', intro: 'রোগের ইতিহাস রাখুন, সেচের পরিকল্পনা করুন, সরকারি প্রকল্প বুঝুন এবং লাভ হিসাব করুন।', history: 'পোকা ও রোগের ইতিহাস', historyCopy: 'কী দেখেছেন ও কী ব্যবস্থা নিয়েছেন লিখে রাখুন।', crop: 'ফসল', issue: 'সমস্যা বা লক্ষণ', date: 'তারিখ', action: 'গৃহীত ব্যবস্থা', save: 'রেকর্ড সংরক্ষণ', saved: 'সংরক্ষিত রেকর্ড', remove: 'মুছুন', empty: 'এখনও কোনো রেকর্ড নেই।', irrigation: 'সেচ পরিকল্পনা', irrigationCopy: 'ফসল, মাটি ও পরের সেচের তারিখ অনুযায়ী সহজ অনুস্মারক।', soil: 'মাটির ধরন', nextWater: 'পরের সেচের তারিখ', frequency: 'ব্যবধান (দিন)', schedule: 'পরিকল্পনা সংরক্ষণ', scheduleSaved: 'এই ডিভাইসে সেচের পরিকল্পনা সংরক্ষিত হয়েছে।', schemes: 'সরকারি প্রকল্প খুঁজুন', schemesCopy: 'সরকারি পোর্টাল দেখুন এবং স্থানীয় কৃষি দপ্তরে যোগ্যতা যাচাই করুন।', all: 'সব ফসল', open: 'সরকারি পোর্টাল খুলুন', profit: 'ফসলের লাভের হিসাব', soilOptions: ['দোআঁশ', 'এঁটেল', 'বেলে', 'ল্যাটেরাইট'], schemeCrop: 'ফসল বা প্রয়োজন', schemesFor: 'যার জন্য প্রকল্প দেখানো হচ্ছে', general: 'সাধারণ কৃষি', schemesList: [['পিএম-কিষাণ', 'যোগ্য কৃষক পরিবারের জন্য আয় সহায়তা।', 'https://pmkisan.gov.in/'], ['ফসল বিমা যোজনা', 'প্রাকৃতিক ঝুঁকির বিরুদ্ধে ফসল বিমা সহায়তা।', 'https://pmfby.gov.in/'], ['মাটি স্বাস্থ্য কার্ড', 'মাটি পরীক্ষা ও পুষ্টির পরামর্শ।', 'https://soilhealth.dac.gov.in/']],
    pestBadge: '🪤 নতুন ফিচার',
    pestBannerTitle: 'পোকা ও ফাঁদের নজরদারি',
    pestBannerDesc: 'ম্যানুয়াল ফাঁদের গণনা এবং মাঠের পোকার চাপ ট্র্যাক করতে তথ্য নথিভুক্ত করুন।',
    pestBannerBtn: 'কীটপতঙ্গ লগ খুলুন →',
  },
  hi: {
    eyebrow: 'कृषि उपकरण', title: 'आज के फैसलों के लिए उपयोगी उपकरण', intro: 'रोग का इतिहास रखें, सिंचाई की योजना बनाएं, सरकारी योजनाएं समझें और लाभ का अनुमान लगाएं।', history: 'कीट और रोग इतिहास', historyCopy: 'जो देखा और जो उपचार किया, उसे दर्ज करें।', crop: 'फसल', issue: 'समस्या या लक्षण', date: 'तारीख', action: 'किया गया उपचार', save: 'रिकॉर्ड सहेजें', saved: 'सहेजे रिकॉर्ड', remove: 'हटाएं', empty: 'अभी कोई रिकॉर्ड नहीं है।', irrigation: 'सिंचाई शेड्यूल', irrigationCopy: 'फसल, मिट्टी और अगली सिंचाई की तारीख के आधार पर सरल रिमाइंडर।', soil: 'मिट्टी का प्रकार', nextWater: 'अगली सिंचाई तारीख', frequency: 'अंतर (दिन)', schedule: 'शेड्यूल सहेजें', scheduleSaved: 'सिंचाई शेड्यूल इस डिवाइस पर सहेजा गया है।', schemes: 'सरकारी योजना खोजें', schemesCopy: 'आधिकारिक पोर्टल देखें और स्थानीय कृषि कार्यालय से पात्रता जांचें।', all: 'सभी फसलें', open: 'आधिकारिक पोर्टल खोलें', profit: 'फसल लाभ कैलकुलेटर', soilOptions: ['दोमट', 'चिकनी', 'बलुई', 'लैटेराइट'], schemeCrop: 'फसल या जरूरत', schemesFor: 'योजनाएं दिखाई जा रही हैं', general: 'सामान्य खेती', schemesList: [['पीएम-किसान', 'पात्र किसान परिवारों के लिए आय सहायता।', 'https://pmkisan.gov.in/'], ['प्रधानमंत्री फसल बीमा योजना', 'प्राकृतिक जोखिमों से फसल बीमा सहायता।', 'https://pmfby.gov.in/'], ['मृदा स्वास्थ्य कार्ड', 'मिट्टी जांच और पोषक तत्वों की सलाह।', 'https://soilhealth.dac.gov.in/']],
    pestBadge: '🪤 नई सुविधा',
    pestBannerTitle: 'कीट व जाल गणना निगरानी',
    pestBannerDesc: 'क्षेत्रीय कीट दबाव को वास्तविक समय में ट्रैक करने के लिए जाल गणना दर्ज करें।',
    pestBannerBtn: 'कीट लॉगर खोलें →',
  },
};

const crops = ['Rice', 'Potato', 'Jute', 'Mustard', 'Tea', 'Tomato', 'Brinjal', 'Chilli', 'Mango', 'Wheat', 'Maize'];

const cropSchemes = {
  Rice: [['National Food Security Mission - Rice', 'Official rice productivity and farmer-support programmes.', 'https://nfsm.gov.in/']],
  Potato: [['Mission for Integrated Development of Horticulture - Potato', 'Official horticulture support, planting material, and post-harvest guidance.', 'https://midh.gov.in/']],
  Jute: [['Jute Corporation of India - Farmer Services', 'Official jute procurement and farmer service information.', 'https://jci.gov.in/']],
  Mustard: [['National Mission on Edible Oils - Oilseeds', 'Official oilseed mission information for mustard growers.', 'https://nmeo.dac.gov.in/']],
  Tea: [['Tea Board India - Grower Services', 'Official tea grower registration, schemes, and support services.', 'https://teaboard.gov.in/']],
  Tomato: [['Mission for Integrated Development of Horticulture - Tomato', 'Official horticulture schemes and protected cultivation support for tomato.', 'https://midh.gov.in/']],
  Brinjal: [['Mission for Integrated Development of Horticulture - Brinjal', 'Official horticulture schemes and vegetable production support.', 'https://midh.gov.in/']],
  Chilli: [['Mission for Integrated Development of Horticulture - Chilli', 'Official horticulture schemes and spice-crop support.', 'https://midh.gov.in/']],
  Mango: [['Mission for Integrated Development of Horticulture - Mango', 'Official orchard development, planting material, and post-harvest support.', 'https://midh.gov.in/']],
  Wheat: [['National Food Security Mission - Wheat', 'Official wheat productivity and farmer-support programmes.', 'https://nfsm.gov.in/']],
  Maize: [['National Food Security Mission - Maize', 'Official maize productivity and farmer-support programmes.', 'https://nfsm.gov.in/']],
};

export default function ToolsPage() {
  const { language } = useLanguage();
  const text = copy[language] || copy.en;
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fasal-sathi-pest-history') || '[]'); } catch { return []; }
  });
  const [record, setRecord] = useState({ crop: 'Rice', issue: '', date: new Date().toISOString().slice(0, 10), action: '' });
  const [schedule, setSchedule] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fasal-sathi-irrigation') || 'null') || { soil: text.soilOptions[0], date: '', frequency: '5' }; } catch { return { soil: text.soilOptions[0], date: '', frequency: '5' }; }
  });
  const [scheduleSaved, setScheduleSaved] = useState(false);
  const [schemeCrop, setSchemeCrop] = useState('');
  const [profitInputs, setProfitInputs] = useState({ land: '2', crop: 'Tomato', seed: '4000', fertilizer: '7000', labour: '12000', production: '80', price: '2400' });
  const [profitMarket, setProfitMarket] = useState(null);
  const schemesForCrop = cropSchemes[schemeCrop] || text.schemesList;

  useEffect(() => {
    let active = true;
    getMandiPrices(profitInputs.crop, 'West Bengal', '')
      .then(({ data }) => {
        if (!active) return;
        setProfitMarket(data);
        const modalPrice = Number(data?.records?.[0]?.modalPrice);
        if (modalPrice > 0) {
          setProfitInputs((current) => ({ ...current, price: String(modalPrice) }));
        }
      })
      .catch(() => {
        if (active) setProfitMarket(null);
      });

    return () => {
      active = false;
    };
  }, [profitInputs.crop]);

  const saveHistory = (event) => {
    event.preventDefault();
    if (!record.issue.trim()) return;
    const next = [{ ...record, id: Date.now() }, ...history];
    setHistory(next);
    localStorage.setItem('fasal-sathi-pest-history', JSON.stringify(next));
    setRecord((current) => ({ ...current, issue: '', action: '' }));
  };

  const removeHistory = (id) => {
    const next = history.filter((item) => item.id !== id);
    setHistory(next);
    localStorage.setItem('fasal-sathi-pest-history', JSON.stringify(next));
  };

  const saveSchedule = (event) => {
    event.preventDefault();
    localStorage.setItem('fasal-sathi-irrigation', JSON.stringify(schedule));
    setScheduleSaved(true);
  };

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
    <header className="mb-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">{text.eyebrow}</p><h1 className="mt-2 text-3xl font-bold text-slate-100 sm:text-4xl">{text.title}</h1><p className="mt-3 text-slate-300">{text.intro}</p></header>
    <div className="mb-8 overflow-hidden rounded-2xl border border-lime-400/30 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-[#071d17] p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-300">
          {text.pestBadge}
        </span>
        <h2 className="mt-2 text-xl font-bold text-white">
          {text.pestBannerTitle}
        </h2>
        <p className="mt-1 text-sm text-emerald-200/80">
          {text.pestBannerDesc}
        </p>
      </div>
      <Link
        to="/pest-log"
        className="rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-emerald-950 shadow-md hover:bg-lime-300 transition-colors whitespace-nowrap"
      >
        {text.pestBannerBtn}
      </Link>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-md"><h2 className="text-2xl font-bold text-slate-100">{text.history}</h2><p className="mt-2 text-sm text-slate-400">{text.historyCopy}</p><form onSubmit={saveHistory} className="mt-6 grid gap-4 sm:grid-cols-2"><ToolSelect label={text.crop} value={record.crop} options={crops} onChange={(value) => setRecord({ ...record, crop: value })} /><ToolInput label={text.date} type="date" value={record.date} onChange={(value) => setRecord({ ...record, date: value })} /><ToolInput label={text.issue} value={record.issue} onChange={(value) => setRecord({ ...record, issue: value })} /><ToolInput label={text.action} value={record.action} onChange={(value) => setRecord({ ...record, action: value })} /><button className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500 sm:col-span-2">{text.save}</button></form><div className="mt-6 space-y-3">{history.length === 0 ? <p className="rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400">{text.empty}</p> : <><p className="text-xs font-bold uppercase tracking-wider text-emerald-400">{text.saved}</p>{history.map((item) => <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-700 bg-slate-950/70 p-4"><div><p className="font-bold text-slate-100">{item.crop} · {item.date}</p><p className="mt-1 text-sm text-slate-300">{item.issue}</p>{item.action && <p className="mt-1 text-xs text-slate-400">{item.action}</p>}</div><button type="button" onClick={() => removeHistory(item.id)} className="text-xs font-semibold text-red-300 hover:text-red-200">{text.remove}</button></div>)}</>}</div></section>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-md"><h2 className="text-2xl font-bold text-slate-100">{text.irrigation}</h2><p className="mt-2 text-sm text-slate-400">{text.irrigationCopy}</p><form onSubmit={saveSchedule} className="mt-6 grid gap-4"><ToolSelect label={text.soil} value={schedule.soil} options={text.soilOptions} onChange={(value) => setSchedule({ ...schedule, soil: value })} /><ToolInput label={text.nextWater} type="date" value={schedule.date} onChange={(value) => setSchedule({ ...schedule, date: value })} /><ToolInput label={text.frequency} type="number" min="1" max="30" value={schedule.frequency} onChange={(value) => setSchedule({ ...schedule, frequency: value })} /><button className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500">{text.schedule}</button></form>{scheduleSaved && <p className="mt-4 rounded-lg bg-emerald-950/70 p-3 text-sm text-emerald-300">{text.scheduleSaved}</p>}</section>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-md"><h2 className="text-2xl font-bold text-slate-100">{text.schemes}</h2><p className="mt-2 text-sm text-slate-400">{text.schemesCopy}</p><label className="mt-6 block text-sm font-semibold text-slate-200">{text.schemeCrop}<select value={schemeCrop} onChange={(event) => setSchemeCrop(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100"><option value="">{text.all}</option>{crops.map((crop) => <option key={crop}>{crop}</option>)}</select></label><p className="mt-5 text-xs text-slate-400">{text.schemesFor}: {schemeCrop || text.general}</p><div className="mt-3 space-y-3">{schemesForCrop.map(([name, description, url]) => <div key={name} className="rounded-lg border border-slate-700 bg-slate-950/70 p-4"><h3 className="font-bold text-slate-100">{name}</h3><p className="mt-1 text-sm text-slate-400">{description}</p><a className="mt-3 inline-flex text-sm font-bold text-emerald-300 hover:text-emerald-200" href={url} target="_blank" rel="noreferrer">{text.open} ↗</a></div>)}</div></section>
      <section className="rounded-2xl border border-emerald-900/60 bg-emerald-950/40 p-6 shadow-md"><h2 className="text-2xl font-bold text-slate-100">{text.profit}</h2><div className="mt-6"><ProfitCalculator inputs={profitInputs} onChange={(field, value) => setProfitInputs((current) => ({ ...current, [field]: value }))} market={profitMarket} language={language} /></div></section>
      <section className="rounded-2xl border border-teal-900/60 bg-slate-900/80 p-6 shadow-md lg:col-span-2">
        <FertilizerCalculator language={language} />
      </section>
    </div>
  </div>;
}

function FertilizerCalculator({ language = 'en' }) {
  const [area, setArea] = useState('1'); // acres
  const [nDosage, setNDosage] = useState('40'); // kg/acre N
  const [pDosage, setPDosage] = useState('20'); // kg/acre P
  const [kDosage, setKDosage] = useState('20'); // kg/acre K

  const areaNum = Math.max(0.1, Number(area) || 1);
  const nReq = (Number(nDosage) || 0) * areaNum;
  const pReq = (Number(pDosage) || 0) * areaNum;
  const kReq = (Number(kDosage) || 0) * areaNum;

  // Commercial conversion factors:
  // Urea = 46% N -> kg Urea = N / 0.46
  // SSP = 16% P2O5 -> kg SSP = P / 0.16
  // MOP = 60% K2O -> kg MOP = K / 0.60
  const ureaKg = Math.round(nReq / 0.46);
  const sspKg = Math.round(pReq / 0.16);
  const mopKg = Math.round(kReq / 0.60);

  const t = {
    en: { title: '🧪 NPK Soil Health & Fertilizer Calculator', copy: 'Calculate required bags of Urea, SSP, and MOP based on target nutrient dosage and field size.', acre: 'Field Area (Acres)', n: 'Nitrogen (N) kg/acre', p: 'Phosphorus (P) kg/acre', k: 'Potassium (K) kg/acre', result: 'Estimated Commercial Fertilizer Requirement', urea: 'Urea (46% N)', ssp: 'SSP (16% P₂O₅)', mop: 'MOP (60% K₂O)', bags: 'bags (50kg each)' },
    bn: { title: '🧪 এনপিকে সার ও মাটি পুষ্টির হিসাব', copy: 'জমির পরিমাণ ও পুষ্টি চাহিদার ভিত্তিতে ইউরিয়া, এসএসপি ও এমওপির হিসাব করুন।', acre: 'জমির পরিমাণ (একর)', n: 'নাইট্রোজেন (N) কেজি/একর', p: 'ফসফরাস (P) কেজি/একর', k: 'পটাশিয়াম (K) কেজি/একর', result: 'প্রয়োজনীয় বাণিজ্যিক সারের হিসাব', urea: 'ইউরিয়া (৪৬% N)', ssp: 'এসএসপি (১৬% P₂O₅)', mop: 'এমওপি (৬০% K₂O)', bags: 'বস্তা (৫০ কেজি)' },
    hi: { title: '🧪 एनपीके उर्वरक और मृदा पोषण कैलकुलेटर', copy: 'खेत के आकार और पोषण आवश्यकता के अनुसार यूरिया, एसएसपी और एमओपी की मात्रा जानें।', acre: 'खेत का आकार (एकड़)', n: 'नाइट्रोजन (N) किग्रा/एकड़', p: 'फास्फोरस (P) किग्रा/एकड़', k: 'पोटेशियम (K) किग्रा/एकड़', result: 'अनुमानित व्यावसायिक उर्वरक आवश्यकता', urea: 'यूरिया (46% N)', ssp: 'एसएसपी (16% P₂O₅)', mop: 'एमओपी (60% K₂O)', bags: 'बोरी (50 किग्रा)' },
  }[language] || {};

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-100">{t.title}</h2>
      <p className="mt-2 text-sm text-slate-400">{t.copy}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm font-semibold text-slate-200">
          {t.acre}
          <input type="number" step="0.5" min="0.1" value={area} onChange={(e) => setArea(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100" />
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          {t.n}
          <input type="number" min="0" value={nDosage} onChange={(e) => setNDosage(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100" />
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          {t.p}
          <input type="number" min="0" value={pDosage} onChange={(e) => setPDosage(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100" />
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          {t.k}
          <input type="number" min="0" value={kDosage} onChange={(e) => setKDosage(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100" />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">{t.result}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-950/80 p-3 text-center border border-slate-800">
            <span className="block text-xs font-medium text-slate-400">{t.urea}</span>
            <span className="text-xl font-bold text-emerald-300">{ureaKg} kg</span>
            <span className="block text-xs text-slate-500">~{(ureaKg / 50).toFixed(1)} {t.bags}</span>
          </div>
          <div className="rounded-lg bg-slate-950/80 p-3 text-center border border-slate-800">
            <span className="block text-xs font-medium text-slate-400">{t.ssp}</span>
            <span className="text-xl font-bold text-emerald-300">{sspKg} kg</span>
            <span className="block text-xs text-slate-500">~{(sspKg / 50).toFixed(1)} {t.bags}</span>
          </div>
          <div className="rounded-lg bg-slate-950/80 p-3 text-center border border-slate-800">
            <span className="block text-xs font-medium text-slate-400">{t.mop}</span>
            <span className="text-xl font-bold text-emerald-300">{mopKg} kg</span>
            <span className="block text-xs text-slate-500">~{(mopKg / 50).toFixed(1)} {t.bags}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolInput({ label, value, onChange, type = 'text', ...props }) { return <label className="block text-sm font-semibold text-slate-200">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none focus:border-emerald-400" {...props} /></label>; }
function ToolSelect({ label, value, options, onChange }) { return <label className="block text-sm font-semibold text-slate-200">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }

