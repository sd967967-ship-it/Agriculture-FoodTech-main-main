import React from 'react';

export default function WeatherCard({ weatherContext, cropStageRelevance, districtContext, temperature, humidity, language = 'en' }) {
  if (!weatherContext && !cropStageRelevance && !districtContext) return null;
  const labels = {
    en: { title: 'Contextual Insights & Disease Risk', weather: 'Weather', stage: 'Crop Stage', district: 'Soil & District', riskTitle: 'Fungal & Pest Risk Assessment' },
    bn: { title: 'প্রাসঙ্গিক তথ্য ও রোগ ঝুঁকি', weather: 'আবহাওয়া', stage: 'ফসলের পর্যায়', district: 'মাটি ও জেলা', riskTitle: 'ছত্রাক ও পোকার ঝুঁকির মূল্যায়ন' },
    hi: { title: 'संदर्भ जानकारी और रोग जोखिम', weather: 'मौसम', stage: 'फसल का चरण', district: 'मिट्टी और जिला', riskTitle: 'कवक और कीट जोखिम मूल्यांकन' },
  }[language] || { title: 'Contextual Insights & Disease Risk', weather: 'Weather', stage: 'Crop Stage', district: 'Soil & District', riskTitle: 'Fungal & Pest Risk Assessment' };

  // Calculate disease risk indicators based on temperature and humidity
  const tempNum = Number(temperature) || 26;
  const humNum = Number(humidity) || 75;

  const lateBlightRisk = humNum >= 80 && tempNum >= 15 && tempNum <= 24 ? 'HIGH' : humNum >= 70 ? 'MEDIUM' : 'LOW';
  const powderyMildewRisk = humNum >= 60 && tempNum >= 22 && tempNum <= 30 ? 'HIGH' : 'LOW';
  const rustRisk = humNum >= 75 && tempNum >= 18 && tempNum <= 28 ? 'HIGH' : 'MEDIUM';

  const riskBadgeClass = (risk) => {
    if (risk === 'HIGH') return 'bg-red-500/20 text-red-300 border-red-500/40';
    if (risk === 'MEDIUM') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="rounded-[1.4rem] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(11,23,20,0.95),rgba(9,17,14,0.96))] p-5 shadow-[0_20px_40px_rgba(9,17,14,0.35)]">
      <h3 className="mb-4 border-b border-emerald-500/20 pb-2 text-lg font-semibold text-slate-100">{labels.title}</h3>
      <div className="space-y-4">
        {weatherContext && (
          <div className="flex gap-3">
            <span className="flex-shrink-0 text-xl">🌦️</span>
            <div>
              <h4 className="text-sm font-medium text-emerald-200">{labels.weather}</h4>
              <p className="text-sm text-slate-300">{weatherContext}</p>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-slate-900/90 p-3 border border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">{labels.riskTitle}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-2.5 py-1 rounded-full font-medium border ${riskBadgeClass(lateBlightRisk)}`}>
              Blight Risk: {lateBlightRisk}
            </span>
            <span className={`px-2.5 py-1 rounded-full font-medium border ${riskBadgeClass(powderyMildewRisk)}`}>
              Mildew Risk: {powderyMildewRisk}
            </span>
            <span className={`px-2.5 py-1 rounded-full font-medium border ${riskBadgeClass(rustRisk)}`}>
              Rust Risk: {rustRisk}
            </span>
          </div>
        </div>
        
        {weatherContext && (cropStageRelevance || districtContext) && (
          <div className="h-px w-full bg-slate-700/80"></div>
        )}

        {cropStageRelevance && (
          <div className="flex gap-3">
            <span className="flex-shrink-0 text-xl">🌱</span>
            <div>
              <h4 className="text-sm font-medium text-emerald-200">{labels.stage}</h4>
              <p className="text-sm text-slate-300">{cropStageRelevance}</p>
            </div>
          </div>
        )}
        
        {cropStageRelevance && districtContext && (
          <div className="h-px w-full bg-slate-700/80"></div>
        )}

        {districtContext && (
          <div className="flex gap-3">
            <span className="flex-shrink-0 text-xl">🗺️</span>
            <div>
              <h4 className="text-sm font-medium text-emerald-200">{labels.district}</h4>
              <p className="text-sm text-slate-300">{districtContext}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

