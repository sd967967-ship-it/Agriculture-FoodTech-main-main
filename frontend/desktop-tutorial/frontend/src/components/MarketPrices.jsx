import { useMemo, useState } from 'react';
import { EmptyState, ErrorState } from './ui';

const copy = {
  en: {
    search: 'Search mandi or variety', searchPh: 'e.g. Burdwan, Local grade', latest: 'Latest price', perQuintal: 'per quintal',
    updated: 'Updated', sourceLive: 'Official live data', sourceEstimate: 'Market estimate', range: 'Day range',
    up: 'up', down: 'down', noChange: 'No change', vsPrev: 'vs previous listing', singleListing: 'Single listing for this mandi',
    empty: 'No prices found', emptyCopy: 'Try a different crop, mandi search, or district.', clearSearch: 'Clear search',
    loadFail: 'Prices could not be loaded', loadFailCopy: 'Check your internet and try again. Your other tools keep working offline.',
  },
  bn: {
    search: 'মান্ডি বা জাত খুঁজুন', searchPh: 'যেমন বর্ধমান', latest: 'সর্বশেষ দাম', perQuintal: 'প্রতি কুইন্টাল',
    updated: 'হালনাগাদ', sourceLive: 'সরকারি লাইভ তথ্য', sourceEstimate: 'বাজার অনুমান', range: 'দিনের সীমা',
    up: 'বেড়েছে', down: 'কমেছে', noChange: 'অপরিবর্তিত', vsPrev: 'আগের তালিকার তুলনায়', singleListing: 'এই মান্ডির একটিমাত্র তালিকা',
    empty: 'কোনো দাম পাওয়া যায়নি', emptyCopy: 'অন্য ফসল, মান্ডি বা জেলা বেছে দেখুন।', clearSearch: 'খোঁজ মুছুন',
    loadFail: 'দাম লোড করা যায়নি', loadFailCopy: 'ইন্টারনেট দেখে আবার চেষ্টা করুন।',
  },
  hi: {
    search: 'मंडी या किस्म खोजें', searchPh: 'जैसे बर्दवान', latest: 'ताज़ा भाव', perQuintal: 'प्रति क्विंटल',
    updated: 'अपडेट', sourceLive: 'सरकारी लाइव डेटा', sourceEstimate: 'बाज़ार अनुमान', range: 'दिन का दायरा',
    up: 'बढ़ा', down: 'घटा', noChange: 'कोई बदलाव नहीं', vsPrev: 'पिछली सूची से', singleListing: 'इस मंडी की एक सूची',
    empty: 'कोई भाव नहीं मिला', emptyCopy: 'दूसरी फसल, मंडी या जिला चुनें।', clearSearch: 'खोज साफ़ करें',
    loadFail: 'भाव लोड नहीं हो सके', loadFailCopy: 'इंटरनेट जाँचकर पुनः प्रयास करें।',
  },
};

const money = (v) => `₹${Math.round(Number(v) || 0).toLocaleString('en-IN')}`;

/** Group records by market; compute change only from dated entries of the same mandi. */
function changeFor(records, market) {
  const same = records
    .filter((r) => r.market === market && r.date && r.date !== 'N/A (representative)')
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (same.length < 2) return null;
  const latest = Number(same[0].modalPrice) || 0;
  const prev = Number(same[1].modalPrice) || 0;
  if (!latest || !prev) return null;
  const diff = latest - prev;
  const pct = prev ? (diff / prev) * 100 : 0;
  return { diff, pct };
}

function ChangeBadge({ change, t }) {
  if (!change || change.diff === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
        <span aria-hidden="true">—</span> {t.noChange}
      </span>
    );
  }
  const up = change.diff > 0;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${up ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
      <span aria-hidden="true">{up ? '↑' : '↓'}</span>
      {money(Math.abs(change.diff))} ({up ? '+' : ''}{change.pct.toFixed(1)}%) {up ? t.up : t.down}
    </span>
  );
}

function RangeBar({ min, modal, max, t }) {
  const lo = Number(min) || 0;
  const hi = Number(max) || 0;
  const mid = Number(modal) || 0;
  const pct = hi > lo ? Math.min(100, Math.max(0, ((mid - lo) / (hi - lo)) * 100)) : 50;
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>{money(lo)}</span>
        <span className="text-slate-500">{t.range}</span>
        <span>{money(hi)}</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-slate-200" role="img" aria-label={`${t.range}: ${money(lo)} to ${money(hi)}, price ${money(mid)}`}>
        <div className="h-2 w-2.5 rounded-full bg-slate-900" style={{ marginLeft: `calc(${pct}% - 5px)` }} />
      </div>
    </div>
  );
}

/**
 * Farmer-readable mandi prices. Real API data only: no invented changes,
 * neutral light cards, text+icon movement indicators, search + retry.
 */
export default function MarketPrices({ crop, setCrop, market, district, loading, text, language, onRetry }) {
  const t = copy[language] || copy.en;
  const [query, setQuery] = useState('');
  const records = useMemo(() => (Array.isArray(market?.records) ? market.records : []), [market]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => `${r.market || ''} ${r.variety || ''} ${r.district || ''}`.toLowerCase().includes(q));
  }, [records, query]);

  if (!district) return <div className="py-10 text-center text-sm text-slate-500">{text.chooseDistrict}</div>;

  const source = String(market?.source || '');
  const isLive = /official/i.test(source);
  const latest = records[0] || null;

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-slate-900">{text.marketTitle(district)}</h3>
          <p className="mt-1 text-sm text-slate-600">{text.marketCopy}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="text-sm font-semibold text-slate-700">
            {text.crop}
            <select
              value={crop}
              onChange={(event) => setCrop(event.target.value)}
              className="ml-0 mt-1 block min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-emerald-600 sm:ml-3 sm:inline-block"
            >
              {['Rice', 'Potato', 'Jute', 'Mustard', 'Tea', 'Tomato', 'Brinjal', 'Chilli', 'Mango', 'Wheat', 'Maize'].map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            {t.search}
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPh}
              aria-label={t.search}
              className="mt-1 block min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-600 sm:w-52"
            />
          </label>
        </div>
      </div>

      {!market && !loading ? (
        <div className="mt-6">
          <ErrorState title={t.loadFail} copy={t.loadFailCopy} onRetry={onRetry} />
        </div>
      ) : (
        <>
          {latest && (
            <section aria-label={t.latest} className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.latest} · {crop}</p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                    {money(latest.modalPrice)}
                    <span className="ml-2 align-middle text-base font-bold text-slate-500">{t.perQuintal}</span>
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {latest.market}{latest.variety ? ` · ${latest.variety}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t.updated}: {latest.date || '—'}{latest.lastUpdated ? ` · ${latest.lastUpdated}` : ''}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${isLive ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'}`}>
                  <span aria-hidden="true">{isLive ? '●' : '○'}</span>
                  {isLive ? t.sourceLive : t.sourceEstimate}
                </span>
              </div>
            </section>
          )}

          <div className="mt-5">
            {filtered.length === 0 ? (
              <EmptyState
                icon="💰"
                title={t.empty}
                copy={t.emptyCopy}
                action={query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100"
                  >
                    {t.clearSearch}
                  </button>
                ) : undefined}
              />
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {filtered.map((record, index) => {
                  const change = changeFor(records, record.market);
                  return (
                    <li key={`${record.market}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-bold text-slate-900">{record.market}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {record.variety || ''}{record.date ? ` · ${record.date}` : ''}
                          </p>
                        </div>
                        <ChangeBadge change={change} t={t} />
                      </div>
                      <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                        {money(record.modalPrice)}
                        <span className="ml-1.5 align-middle text-xs font-bold text-slate-500">{t.perQuintal}</span>
                      </p>
                      <div className="mt-3">
                        <RangeBar min={record.minPrice} modal={record.modalPrice} max={record.maxPrice} t={t} />
                      </div>
                      <p className="mt-3 text-xs text-slate-500" title={t.vsPrev}>
                        {change ? t.vsPrev : t.singleListing}
                        {record.lastUpdated ? ` · ${t.updated} ${record.lastUpdated}` : ''}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-500">{text.priceNote}</p>
        </>
      )}
    </div>
  );
}
