import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import CropStorage from '../components/CropStorage';
import { getCurrentUser, getDiagnosisHistory, login, register } from '../api/cropApi';

const STORAGE_KEY = 'fasal-sathi-farmer-profile';
const emptyProfile = { name: '', village: '', district: '', phone: '', language: 'English' };

export default function ProfilePage() {
  const { language, setLanguage } = useLanguage();
  const copy = { en: { eyebrow: 'Your farm details', title: 'Farmer Profile', intro: 'Save your details on this device so your farm tools can feel personal. No account or internet connection is required.', name: 'Farmer name', village: 'Village / town', district: 'District', phone: 'Phone number', language: 'Preferred language', save: 'Save profile', edit: 'Edit profile', cancel: 'Cancel', saved: 'Profile saved on this device.' }, bn: { eyebrow: 'আপনার খামারের তথ্য', title: 'কৃষক প্রোফাইল', intro: 'এই ডিভাইসে আপনার তথ্য রাখুন, যাতে খামারের সরঞ্জাম আপনার জন্য সহজ হয়। কোনো অ্যাকাউন্ট বা ইন্টারনেট দরকার নেই।', name: 'কৃষকের নাম', village: 'গ্রাম / শহর', district: 'জেলা', phone: 'ফোন নম্বর', language: 'পছন্দের ভাষা', save: 'প্রোফাইল সংরক্ষণ', edit: 'প্রোফাইল সম্পাদনা', cancel: 'বাতিল', saved: 'এই ডিভাইসে প্রোফাইল সংরক্ষিত হয়েছে।' }, hi: { eyebrow: 'आपके खेत की जानकारी', title: 'किसान प्रोफ़ाइल', intro: 'अपनी जानकारी इस डिवाइस पर रखें, ताकि खेत के औज़ार आपके लिए आसान रहें। किसी खाते या इंटरनेट की ज़रूरत नहीं है।', name: 'किसान का नाम', village: 'गाँव / शहर', district: 'जिला', phone: 'फ़ोन नंबर', language: 'पसंदीदा भाषा', save: 'प्रोफ़ाइल सहेजें', edit: 'प्रोफ़ाइल संपादित करें', cancel: 'रद्द करें', saved: 'प्रोफ़ाइल इस डिवाइस पर सहेजी गई।' } }[language] || { en: { eyebrow: 'Your farm details', title: 'Farmer Profile', intro: '', name: 'Farmer name', village: 'Village / town', district: 'District', phone: 'Phone number', language: 'Preferred language', save: 'Save profile', edit: 'Edit profile', cancel: 'Cancel', saved: 'Profile saved.' } };
  const [profile, setProfile] = useState(() => {
    try { return { ...emptyProfile, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; } catch { return emptyProfile; }
  });
  const [editing, setEditing] = useState(() => {
    try { return !JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').name; } catch { return true; }
  });
  const [saved, setSaved] = useState(false);
  const [savedProfile, setSavedProfile] = useState(profile);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', role: 'FARMER' });
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('fasal-sathi-session-token');
    if (!token) {
      return;
    }
    getCurrentUser()
      .then(({ data }) => {
        setCurrentUser(data);
        localStorage.setItem('fasal-sathi-session-token', data.sessionToken || token);
      })
      .catch(() => {
        localStorage.removeItem('fasal-sathi-session-token');
        setCurrentUser(null);
      });
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    getDiagnosisHistory()
      .then(({ data }) => setDiagnosisHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistoryError(language === 'bn' ? 'রোগ নির্ণয়ের ইতিহাস লোড করা যায়নি।' : language === 'hi' ? 'निदान इतिहास लोड नहीं हो सका।' : 'Diagnosis history could not be loaded.'));
  }, [language, currentUser]);

  const update = (field, value) => setProfile((current) => ({ ...current, [field]: value }));
  const save = (event) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSavedProfile(profile);
    setEditing(false);
    if (profile.language === 'বাংলা') setLanguage('bn');
    else if (profile.language === 'हिन्दी') setLanguage('hi');
    else setLanguage('en');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    if (!authForm.username.trim() || !authForm.password.trim()) {
      setAuthError('Please enter both username and password.');
      return;
    }
    try {
      const request = authMode === 'register'
        ? register(authForm.username.trim(), authForm.password.trim(), authForm.role)
        : login(authForm.username.trim(), authForm.password.trim());
      const { data } = await request;
      if (data.sessionToken) {
        localStorage.setItem('fasal-sathi-session-token', data.sessionToken);
      }
      setCurrentUser(data);

      // Auto-populate profile name if blank
      setProfile((current) => {
        const next = { ...current, name: current.name || data.username };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      setAuthForm({ username: '', password: '', role: 'FARMER' });
    } catch (error) {
      const message = error?.response?.data?.message || 'Authentication failed. If you do not have an account, click Register above first.';
      setAuthError(message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fasal-sathi-session-token');
    setCurrentUser(null);
    setAuthError('');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {!currentUser ? (
        <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-lime-400">Account</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Farmer access</h2>
          <p className="mt-1 text-xs text-slate-300">
            Sign in or create an account to save your diagnosis history and farm records to your cloud profile.
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`rounded-lg px-4 py-2 text-sm font-bold ${authMode === 'login' ? 'bg-lime-300 text-emerald-950' : 'bg-slate-800 text-slate-200'}`}>Login</button>
            <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`rounded-lg px-4 py-2 text-sm font-bold ${authMode === 'register' ? 'bg-lime-300 text-emerald-950' : 'bg-slate-800 text-slate-200'}`}>Register</button>
          </div>
          <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-slate-200">
              Username
              <input value={authForm.username} onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" placeholder="e.g. farmer_raju" />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Password
              <input type="password" value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" placeholder="••••••••" />
            </label>
            {authMode === 'register' && (
              <label className="block text-sm font-semibold text-slate-200">
                Role
                <select value={authForm.role} onChange={(event) => setAuthForm((current) => ({ ...current, role: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100">
                  <option value="FARMER">FARMER</option>
                  <option value="EXPERT">EXPERT</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
            )}
            {authError && <p className="rounded-lg border border-red-700 bg-red-950/60 p-3 text-sm text-red-200">{authError}</p>}
            <button type="submit" className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">
              {authMode === 'register' ? 'Create new farmer account' : 'Log in to account'}
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-900/60 bg-emerald-950/40 p-5 text-slate-100 shadow-lg">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Signed in</p>
            <h2 className="mt-1 text-xl font-bold">{currentUser.username}</h2>
            <p className="text-sm text-slate-300">Role: {currentUser.role}</p>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-slate-800">Logout</button>
        </div>
      )}

      <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/40 p-6 shadow-lg sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">{copy.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{copy.intro}</p>

        <form onSubmit={save} className="mt-8 grid gap-5 sm:grid-cols-2">
          <ProfileInput id="farmer-name" label={copy.name} value={profile.name} placeholder={copy.name} disabled={!editing} onChange={(value) => update('name', value)} />
          <ProfileInput id="farmer-village" label={copy.village} value={profile.village} placeholder={copy.village} disabled={!editing} onChange={(value) => update('village', value)} />
          <ProfileInput id="farmer-district" label={copy.district} value={profile.district} placeholder={copy.district} disabled={!editing} onChange={(value) => update('district', value)} />
          <ProfileInput id="farmer-phone" label={copy.phone} type="tel" value={profile.phone} placeholder={copy.phone} disabled={!editing} onChange={(value) => update('phone', value)} />
          <label htmlFor="farmer-language" className="block text-sm font-semibold text-slate-200 sm:col-span-2">{copy.language}
            <select id="farmer-language" value={profile.language} disabled={!editing} onChange={(event) => update('language', event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-70">
              <option>English</option><option>বাংলা</option><option>हिन्दी</option>
            </select>
          </label>
          {editing ? <div className="flex gap-3 sm:col-span-2"><button type="submit" className="flex-1 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">{copy.save}</button><button type="button" onClick={() => { setProfile(savedProfile); setEditing(false); }} className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">{copy.cancel}</button></div> : <button type="button" onClick={() => setEditing(true)} className="rounded-lg border border-emerald-600 px-5 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-950 sm:col-span-2">{copy.edit}</button>}
        </form>
        {saved && <p className="mt-4 rounded-lg border border-emerald-700 bg-emerald-950/70 p-3 text-sm text-emerald-200" role="status">{copy.saved}</p>}
      </div>
      <div className="mt-6">
        <CropStorage />
      </div>
      <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-md sm:p-8" aria-labelledby="diagnosis-history-title">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">{language === 'bn' ? 'সংরক্ষিত ফলাফল' : language === 'hi' ? 'सहेजे गए परिणाम' : 'Saved results'}</p>
        <h2 id="diagnosis-history-title" className="mt-2 text-2xl font-bold text-slate-100">{language === 'bn' ? 'রোগ নির্ণয়ের ইতিহাস' : language === 'hi' ? 'निदान इतिहास' : 'Diagnosis history'}</h2>
        <p className="mt-2 text-sm text-slate-400">{language === 'bn' ? 'সর্বশেষ ১০০টি রোগ নির্ণয়ের রেকর্ড এই ডিভাইসের স্থানীয় ডেটাবেসে রাখা হয়।' : language === 'hi' ? 'निदान के अंतिम १०० रिकॉर्ड इस डिवाइस के स्थानीय डेटाबेस में रखे जाते हैं।' : 'The latest 100 diagnosis records are stored in the local database for this application.'}</p>
        {!currentUser && <p className="mt-4 rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400">Sign in to view diagnosis history for this account.</p>}
        {currentUser && historyError && <p className="mt-4 rounded-lg bg-red-950/60 p-3 text-sm text-red-200">{historyError}</p>}
        {currentUser && !historyError && diagnosisHistory.length === 0 && <p className="mt-4 rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400">{language === 'bn' ? 'এখনও কোনো রোগ নির্ণয়ের রেকর্ড নেই।' : language === 'hi' ? 'अभी कोई निदान रिकॉर्ड नहीं है।' : 'No diagnosis records yet.'}</p>}
        {currentUser && <div className="mt-4 space-y-3">{diagnosisHistory.map((item) => <div key={item.id} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4"><div className="flex flex-col justify-between gap-2 sm:flex-row"><p className="font-bold text-slate-100">{item.topDisease || 'Unknown'}</p><p className="text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</p></div>{currentUser.role === 'ADMIN' && item.farmerUsername && <p className="mt-1 text-sm font-semibold text-emerald-300">Farmer: {item.farmerUsername}</p>}<p className="mt-1 text-sm text-slate-300">{item.cropType || 'Crop'}{item.cropStage ? ` · ${item.cropStage}` : ''}{item.district ? ` · ${item.district}` : ''}</p><p className="mt-1 text-xs text-slate-400">{item.diagnosisType}{item.isEscalated ? ' · Expert review recommended' : ''}</p></div>)}</div>}
      </section>
    </div>
  );
}

function ProfileInput({ id, label, value, onChange, type = 'text', placeholder, disabled }) {
  return <label htmlFor={id} className="block text-sm font-semibold text-slate-200">{label}<input id={id} type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-70" /></label>;
}
