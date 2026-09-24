import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketPrices from '../components/MarketPrices';
import { getDistricts, getMandiPrices } from '../api/cropApi';
import { useLanguage } from '../context/LanguageContext';

const copy = {
  en: {
    back: '← Home',
    eyebrow: 'Market prices',
    title: 'Live mandi prices',
    intro: 'Today’s rates in rupees per quintal. Confirm at the mandi before selling.',
    district: 'District',
    loadingDistricts: 'Loading districts…',
    districtFail: 'Districts could not be loaded. Please refresh and try again.',
    marketTitle: (name) => `Mandi prices in ${name}`,
    marketCopy: 'Prices are in ₹ per quintal. Confirm at the market before selling.',
    crop: 'Crop',
    chooseDistrict: 'Choose a district to view its prices.',
    priceNote: 'Prices vary by variety, grade, and arrival size. Confirm at the mandi before selling.',
  },
  bn: {
    back: '← হোম',
    eyebrow: 'বাজারদর',
    title: 'লাইভ মান্ডির দাম',
    intro: 'আজকের দর, টাকা প্রতি কুইন্টাল। বিক্রির আগে মান্ডিতে নিশ্চিত করুন।',
    district: 'জেলা',
    loadingDistricts: 'জেলা লোড হচ্ছে…',
    districtFail: 'জেলার তালিকা লোড করা যায়নি। আবার চেষ্টা করুন।',
    marketTitle: (name) => `${name}-এর বাজারদর`,
    marketCopy: 'দাম ₹ প্রতি কুইন্টাল। বিক্রির আগে বাজারে নিশ্চিত করুন।',
    crop: 'ফসল',
    chooseDistrict: 'দাম দেখতে একটি জেলা বেছে নিন।',
    priceNote: 'জাত, শ্রেণি ও আমদানি অনুযায়ী দাম বদলায়। বিক্রির আগে মান্ডিতে নিশ্চিত করুন।',
  },
  hi: {
    back: '← होम',
    eyebrow: 'बाज़ार भाव',
    title: 'लाइव मंडी भाव',
    intro: 'आज के भाव, रुपये प्रति क्विंटल। बेचने से पहले मंडी में पुष्टि करें।',
    district: 'जिला',
    loadingDistricts: 'जिले लोड हो रहे हैं…',
    districtFail: 'जिलों की सूची लोड नहीं हो सकी। फिर कोशिश करें।',
    marketTitle: (name) => `${name} में मंडी भाव`,
    marketCopy: 'कीमत ₹ प्रति क्विंटल है। बेचने से पहले मंडी में पुष्टि करें।',
    crop: 'फसल',
    chooseDistrict: 'भाव देखने के लिए जिला चुनें।',
    priceNote: 'किस्म, श्रेणी और आवक के अनुसार भाव बदलता है। बेचने से पहले मंडी में पुष्टि करें।',
  },
};

export default function MandiPricesPage() {
  const { language } = useLanguage();
  const text = copy[language] || copy.en;
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState('');
  const [crop, setCrop] = useState('Rice');
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoading(true);
    getDistricts()
      .then(({ data }) => {
        const list = data || [];
        setDistricts(list);
        let saved = '';
        try { saved = JSON.parse(localStorage.getItem('fasal-sathi-farmer-profile') || '{}').district || ''; } catch { /* default below */ }
        setDistrict(list.some((item) => item.name === saved) ? saved : (list[0]?.name || ''));
      })
      .catch(() => setNotice(text.districtFail))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!district) return;
    setLoading(true);
    getMandiPrices(crop, 'West Bengal', district)
      .then(({ data }) => {
        setMarket(data);
        setNotice('');
      })
      .catch(() => setMarket(null))
      .finally(() => setLoading(false));
  }, [crop, district, attempt]);

  return (
    <div className="mx-auto max-w-7xl bg-[#061C14] px-4 py-10 text-slate-100 sm:py-14">
      <Link to="/" className="inline-flex min-h-[44px] items-center text-sm font-bold text-[#10B981] hover:text-emerald-300">
        {text.back}
      </Link>
      <header className="mt-3 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F59E0B]">{text.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#F7FAF6] sm:text-4xl">{text.title}</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">{text.intro}</p>
      </header>

      <div className="mt-8 rounded-3xl border border-slate-700 bg-[#0F291E] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] sm:p-6">
        <label className="block max-w-md text-sm font-semibold text-slate-200">
          {text.district}
          <select
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className="mt-2 w-full rounded-xl border-2 border-slate-600 bg-slate-900 px-4 py-3 text-base font-medium text-slate-100 outline-none focus:border-[#10B981]"
          >
            <option value="">{loading ? text.loadingDistricts : text.chooseDistrict}</option>
            {districts.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
        {notice && <p role="status" className="mt-4 text-sm font-medium text-amber-200">{notice}</p>}
        <MarketPrices
          crop={crop}
          setCrop={setCrop}
          market={market}
          district={district}
          loading={loading}
          text={text}
          language={language}
          onRetry={() => setAttempt((a) => a + 1)}
        />
      </div>
    </div>
  );
}
