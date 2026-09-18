import React, { useMemo, useState } from 'react';
import { askKisanMitra } from '../api/cropApi';
import { useLanguage } from '../context/LanguageContext';

const copies = {
  en: {
    heading: 'KisanMitra',
    intro: 'Ask about crop care, disease symptoms, weather, mandi prices, field planning, or local follow-up steps.',
    placeholder: 'Ask a question about your crop, district, weather, soil, or disease...',
    ask: 'Ask',
    crop: 'Crop',
    district: 'District',
    answer: 'Answer',
    safety: 'Safety note',
    empty: 'Type a farming question to get a grounded answer.',
    grounded: 'Grounded local guidance',
    offline: 'This answer is based on local agronomy knowledge and should be confirmed with a local KVK or agriculture office for critical decisions.'
  },
  bn: {
    heading: 'কিষানমিত্র',
    intro: 'ফসলের সার্বিক পরিচর্যা, রোগের লক্ষণ, আবহাওয়া, বাজার দর বা মাঠ পরিকল্পনা সম্পর্কে জিজ্ঞাসা করুন।',
    placeholder: 'ফসল, জেলা, আবহাওয়া, মাটি বা রোগ সম্পর্কে প্রশ্ন করুন...',
    ask: 'জিজ্ঞাসা করুন',
    crop: 'ফসল',
    district: 'জেলা',
    answer: 'উত্তর',
    safety: 'নিরাপত্তা নোট',
    empty: 'একটি কৃষি প্রশ্ন লিখুন।',
    grounded: 'স্থানীয় ভিত্তিক নির্দেশনা',
    offline: 'এই উত্তর স্থানীয় কৃষি জ্ঞানভিত্তিক। গুরুত্বপূর্ণ সিদ্ধান্তে স্থানীয় KVK বা কৃষি দপ্তরের সঙ্গে যাচাই করুন।'
  },
  hi: {
    heading: 'किसानमित्र',
    intro: 'फसल देखभाल, रोग लक्षण, मौसम, मंडी भाव, खेत योजना या स्थानीय सहायता के बारे में पूछें।',
    placeholder: 'अपनी फसल, जिला, मौसम, मिट्टी या रोग के बारे में प्रश्न पूछें...',
    ask: 'पूछें',
    crop: 'फसल',
    district: 'जिला',
    answer: 'उत्तर',
    safety: 'सुरक्षा नोट',
    empty: 'कृषि प्रश्न लिखें।',
    grounded: 'स्थानिक आधारिक मार्गदर्शन',
    offline: 'यह उत्तर स्थानीय कृषि ज्ञान पर आधारित है। महत्वपूर्ण निर्णयों में स्थानीय KVK या कृषि कार्यालय से पुष्टि करें।'
  }
};

const defaultCrops = ['Rice', 'Potato', 'Tomato', 'Mango', 'Wheat', 'Maize', 'Jute', 'Mustard'];
const defaultDistricts = ['Nadia', 'Bankura', 'Murshidabad', 'Malda', 'Purulia', 'Paschim Bardhaman', 'Hooghly', 'Kolkata'];

export default function KisanMitraPage() {
  const { language } = useLanguage();
  const text = copies[language] || copies.en;
  const [question, setQuestion] = useState('');
  const [crop, setCrop] = useState('Rice');
  const [district, setDistrict] = useState('Nadia');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const promptOptions = useMemo(() => [
    'What should I do if my rice field has yellowing leaves?',
    'How do I reduce fungal pressure in potato fields in rainy weather?',
    'What should I check before spraying in my district?',
    'How can I improve soil moisture in a dry spell?'
  ], []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!question.trim()) {
      setError(text.empty);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await askKisanMitra(question, crop, district, language);
      setResult(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to reach KisanMitra right now.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
      <div className="mb-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/80 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">FasalSathi</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{text.heading}</h1>
        <p className="mt-3 max-w-2xl text-sm text-emerald-50/80 sm:text-base">{text.intro}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                {text.crop}
                <select value={crop} onChange={(e) => setCrop(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white">
                  {defaultCrops.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-200">
                {text.district}
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white">
                  {defaultDistricts.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={6}
              placeholder={text.placeholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
            />

            <div className="flex flex-wrap gap-2">
              {promptOptions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setQuestion(prompt)}
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/20"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button disabled={loading} type="submit" className="rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? '…' : text.ask}
              </button>
              {error && <span className="text-sm text-red-300">{error}</span>}
            </div>
          </form>
        </section>

        <aside className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">{text.grounded}</h2>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">Safe</span>
          </div>
          <p className="text-sm text-slate-300">{text.offline}</p>
        </aside>
      </div>

      {result && (
        <section className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-5 shadow-lg">
          <h3 className="text-lg font-bold text-emerald-100">{text.answer}</h3>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-emerald-50">{result.answer}</p>
          <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-500/10 p-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-amber-200">{text.safety}</h4>
            <p className="mt-2 text-sm text-amber-100">{result.safetyNote}</p>
          </div>
        </section>
      )}
    </div>
  );
}
