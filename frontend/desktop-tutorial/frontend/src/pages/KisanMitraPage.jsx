import React, { useEffect, useMemo, useRef, useState } from 'react';
import { askKisanMitra } from '../api/cropApi';
import { useLanguage } from '../context/LanguageContext';

const copies = {
  en: {
    heading: 'KisanMitra',
    intro: 'Ask about crop care, disease symptoms, weather, mandi prices, field planning, or local follow-up steps.',
    placeholder: 'Ask a question about your crop, district, weather, soil, or disease...',
    ask: 'Ask',
    sending: 'Sending…',
    crop: 'Crop',
    district: 'District',
    answer: 'Answer',
    safety: 'Safety note',
    empty: 'Type a farming question to get a grounded answer.',
    grounded: 'Grounded local guidance',
    offline: 'This answer is based on local agronomy knowledge and should be confirmed with a local KVK or agriculture office for critical decisions.',
    you: 'You',
    mitra: 'KisanMitra',
    clear: 'Clear chat',
    retry: 'Retry',
    networkFail: 'No internet connection. Check your network and retry — your message is kept above.',
    apiFail: 'KisanMitra could not answer right now. Retry, or ask your local KVK for urgent decisions.',
    emptyResp: 'KisanMitra returned an empty answer. Please retry with a shorter question.',
    history: 'Conversation',
    withDiagnosis: 'Including your recent diagnosis as context.',
    sendLabel: 'Send message',
  },
  bn: {
    heading: 'কিষানমিত্র',
    intro: 'ফসলের সার্বিক পরিচর্যা, রোগের লক্ষণ, আবহাওয়া, বাজার দর বা মাঠ পরিকল্পনা সম্পর্কে জিজ্ঞাসা করুন।',
    placeholder: 'ফসল, জেলা, আবহাওয়া, মাটি বা রোগ সম্পর্কে প্রশ্ন করুন...',
    ask: 'জিজ্ঞাসা করুন',
    sending: 'পাঠানো হচ্ছে…',
    crop: 'ফসল',
    district: 'জেলা',
    answer: 'উত্তর',
    safety: 'নিরাপত্তা নোট',
    empty: 'একটি কৃষি প্রশ্ন লিখুন।',
    grounded: 'স্থানীয় ভিত্তিক নির্দেশনা',
    offline: 'এই উত্তর স্থানীয় কৃষি জ্ঞানভিত্তিক। গুরুত্বপূর্ণ সিদ্ধান্তে স্থানীয় KVK বা কৃষি দপ্তরের সঙ্গে যাচাই করুন।',
    you: 'আপনি',
    mitra: 'কিষানমিত্র',
    clear: 'চ্যাট মুছুন',
    retry: 'আবার চেষ্টা',
    networkFail: 'ইন্টারনেট নেই। নেটওয়ার্ক দেখে আবার চেষ্টা করুন — আপনার বার্তা উপরে আছে।',
    apiFail: 'এখন উত্তর দেওয়া যাচ্ছে না। আবার চেষ্টা করুন বা জরুরি সিদ্ধান্তে স্থানীয় KVK-কে জিজ্ঞাসা করুন।',
    emptyResp: 'খালি উত্তর এসেছে। ছোট প্রশ্ন করে আবার চেষ্টা করুন।',
    history: 'কথোপকথন',
    withDiagnosis: 'আপনার সাম্প্রতিক রোগ নির্ণয় প্রসঙ্গ হিসেবে যোগ করা হয়েছে।',
    sendLabel: 'বার্তা পাঠান',
  },
  hi: {
    heading: 'किसानमित्र',
    intro: 'फसल देखभाल, रोग लक्षण, मौसम, मंडी भाव, खेत योजना या स्थानीय सहायता के बारे में पूछें।',
    placeholder: 'अपनी फसल, जिला, मौसम, मिट्टी या रोग के बारे में प्रश्न पूछें...',
    ask: 'पूछें',
    sending: 'भेजा जा रहा है…',
    crop: 'फसल',
    district: 'जिला',
    answer: 'उत्तर',
    safety: 'सुरक्षा नोट',
    empty: 'कृषि प्रश्न लिखें।',
    grounded: 'स्थानिक आधारिक मार्गदर्शन',
    offline: 'यह उत्तर स्थानीय कृषि ज्ञान पर आधारित है। महत्वपूर्ण निर्णयों में स्थानीय KVK या कृषि कार्यालय से पुष्टि करें।',
    you: 'आप',
    mitra: 'किसानमित्र',
    clear: 'चैट साफ़ करें',
    retry: 'पुनः प्रयास',
    networkFail: 'इंटरनेट नहीं है। नेटवर्क जाँचकर पुनः प्रयास करें — आपका संदेश ऊपर सुरक्षित है।',
    apiFail: 'अभी उत्तर नहीं मिल सका। पुनः प्रयास करें या ज़रूरी निर्णय हेतु स्थानीय KVK से पूछें।',
    emptyResp: 'खाली उत्तर मिला। छोटा प्रश्न लिखकर पुनः प्रयास करें।',
    history: 'बातचीत',
    withDiagnosis: 'आपकी हाल की फसल जाँच प्रसंग के रूप में जोड़ी गई है।',
    sendLabel: 'संदेश भेजें',
  },
};

const CHAT_KEY = 'fasal-mitra-chat';
const DIAG_KEY = 'fasal-last-diagnosis';
const MAX_STORED = 30;

const defaultCrops = ['Rice', 'Potato', 'Tomato', 'Mango', 'Wheat', 'Maize', 'Jute', 'Mustard'];
const defaultDistricts = ['Nadia', 'Bankura', 'Murshidabad', 'Malda', 'Purulia', 'Paschim Bardhaman', 'Hooghly', 'Kolkata'];

function loadStored() {
  try {
    const list = JSON.parse(sessionStorage.getItem(CHAT_KEY) || '[]');
    return Array.isArray(list) ? list.slice(-MAX_STORED) : [];
  } catch {
    return [];
  }
}

function readDiagnosisContext() {
  try {
    return sessionStorage.getItem(DIAG_KEY) || '';
  } catch {
    return '';
  }
}

export default function KisanMitraPage() {
  const { language } = useLanguage();
  const text = copies[language] || copies.en;
  const [crop, setCrop] = useState('Rice');
  const [district, setDistrict] = useState('Nadia');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(loadStored);
  const [loading, setLoading] = useState(false);
  const [diagContext, setDiagContext] = useState('');
  const bottomRef = useRef(null);
  const requestRef = useRef(0);

  const promptOptions = useMemo(() => [
    'What should I do if my rice field has yellowing leaves?',
    'How do I reduce fungal pressure in potato fields in rainy weather?',
    'What should I check before spraying in my district?',
    'How can I improve soil moisture in a dry spell?'
  ], []);

  useEffect(() => {
    setDiagContext(readDiagnosisContext());
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
    } catch { /* storage full or private mode — chat still works in memory */ }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading]);

  const sendQuestion = async (rawQuestion, retryOfId = null) => {
    const question = (rawQuestion || '').trim();
    if (!question || loading) return;
    const myRequest = ++requestRef.current;
    setLoading(true);
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: question, ts: Date.now() };
    setMessages((prev) => (retryOfId ? prev.filter((m) => m.id !== retryOfId) : prev).concat(userMsg));
    try {
      const withContext = diagContext ? `${question}\n\n[My recent crop diagnosis: ${diagContext}]` : question;
      const response = await askKisanMitra(withContext, crop, district, language);
      if (requestRef.current !== myRequest) return; // a newer send superseded this one
      const data = response?.data || {};
      if (!data.answer || !String(data.answer).trim()) {
        throw Object.assign(new Error('empty'), { code: 'EMPTY' });
      }
      setMessages((prev) => prev.concat({
        id: `a-${Date.now()}`,
        role: 'ai',
        text: String(data.answer),
        safety: data.safetyNote || '',
        source: data.source || '',
        grounded: data.grounded !== false,
        ts: Date.now(),
      }));
    } catch (err) {
      if (requestRef.current !== myRequest) return;
      const isNetwork = !err?.response;
      const code = err?.code === 'EMPTY' ? 'EMPTY' : null;
      setMessages((prev) => prev.concat({
        id: `e-${Date.now()}`,
        role: 'error',
        text: code === 'EMPTY' ? text.emptyResp : (isNetwork ? text.networkFail : (err?.response?.data?.message || text.apiFail)),
        retryQuestion: question,
        ts: Date.now(),
      }));
    } finally {
      if (requestRef.current === myRequest) setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim() || loading) return;
    const q = draft;
    setDraft('');
    sendQuestion(q);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const clearChat = () => {
    requestRef.current += 1; // invalidate any in-flight response
    setLoading(false);
    setMessages([]);
    try { sessionStorage.removeItem(CHAT_KEY); } catch { /* ignore */ }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
      <div className="mb-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/80 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">FasalSathi</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{text.heading}</h1>
        <p className="mt-3 max-w-2xl text-sm text-emerald-50/80 sm:text-base">{text.intro}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-200">
            {text.crop}
            <select value={crop} onChange={(e) => setCrop(e.target.value)} className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white">
              {defaultCrops.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-200">
            {text.district}
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white">
              {defaultDistricts.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        {diagContext && <p className="mt-3 text-xs text-emerald-200/80">✓ {text.withDiagnosis}</p>}
      </div>

      <section aria-label={text.history} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-lg sm:p-5">
        {messages.length === 0 ? (
          <div className="py-6 text-center">
            <div className="text-4xl" aria-hidden="true">🤖</div>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300">{text.empty}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {promptOptions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion(prompt)}
                  className="min-h-[44px] rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={clearChat}
                className="min-h-[44px] rounded-lg border border-slate-600 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                {text.clear}
              </button>
            </div>
            <ul className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
              {messages.map((msg) => (
                <li key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl p-4 sm:max-w-[78%] ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : msg.role === 'error'
                        ? 'border border-red-500/40 bg-red-950/50 text-red-100'
                        : 'border border-emerald-500/25 bg-emerald-950/50 text-emerald-50'
                  }`}>
                    <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                      {msg.role === 'user' ? text.you : msg.role === 'error' ? '⚠️' : `🤖 ${text.mitra}`}
                      {msg.role === 'ai' && msg.source ? ` · ${msg.source}` : ''}
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-[15px] leading-7">{msg.text}</p>
                    {msg.role === 'ai' && msg.safety && (
                      <p className="mt-3 rounded-lg border border-amber-400/25 bg-amber-500/10 p-3 text-[13px] leading-6 text-amber-100">
                        <strong>{text.safety}: </strong>{msg.safety}
                      </p>
                    )}
                    {msg.role === 'error' && msg.retryQuestion && (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => sendQuestion(msg.retryQuestion, msg.id)}
                        className="mt-3 min-h-[44px] rounded-lg bg-red-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-red-300 disabled:opacity-50"
                      >
                        ↻ {text.retry}
                      </button>
                    )}
                  </div>
                </li>
              ))}
              {loading && (
                <li className="flex justify-start" aria-label={text.sending}>
                  <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-950/50 p-4">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-300" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-300 [animation-delay:150ms]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-300 [animation-delay:300ms]" />
                    <span className="ml-1 text-sm text-emerald-200">{text.sending}</span>
                  </div>
                </li>
              )}
              <li ref={bottomRef} aria-hidden="true" />
            </ul>
          </>
        )}

        <form className="mt-4 flex items-end gap-2" onSubmit={handleSubmit}>
          <label htmlFor="mitra-input" className="sr-only">{text.placeholder}</label>
          <textarea
            id="mitra-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={text.placeholder}
            disabled={loading}
            className="max-h-32 min-h-[52px] w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-[15px] text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !draft.trim()}
            aria-label={text.sendLabel}
            className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-xl bg-emerald-500 text-xl font-bold text-white shadow-md hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '…' : '➤'}
          </button>
        </form>
        <p className="mt-2 text-xs leading-5 text-slate-400">{text.offline}</p>
      </section>
    </div>
  );
}
