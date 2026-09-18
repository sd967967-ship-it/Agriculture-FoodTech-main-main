import React, { useState } from 'react';

export default function CandidateList({ candidates, language = 'en' }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!candidates || candidates.length === 0) return null;
  const topPickLabel = { en: 'Top Pick', bn: 'প্রধান সম্ভাবনা', hi: 'मुख्य संभावना' }[language] || 'Top Pick';

  return (
    <div className="space-y-3">
      {candidates.slice(0, 3).map((candidate, index) => {
        const isExpanded = expandedIndex === index;
        
        return (
          <div 
            key={index}
            className={`cursor-pointer overflow-hidden rounded-lg border transition-all ${
              candidate.isTopPick 
                ? 'border-emerald-500/40 bg-emerald-950/30 shadow-md ring-1 ring-emerald-500/40' 
                : 'border-slate-700 bg-slate-900/60 hover:border-emerald-500/30'
            }`}
            onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
          >
            <div className={`flex items-center justify-between p-4 ${candidate.isTopPick ? 'bg-emerald-950/30' : 'bg-slate-900/60'}`}>
              <div className="mr-4 flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <h4 className="font-medium text-slate-100">{candidate.diseaseName}</h4>
                  {candidate.isTopPick && <span title={topPickLabel}>⭐</span>}
                </div>
              </div>
              
              <div className="ml-3 text-slate-400">
                <svg 
                  className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {isExpanded && candidate.explanation && (
              <div className="border-t border-slate-700 bg-slate-950/60 p-4 pt-0 text-sm text-slate-300">
                <p className="mt-3">{candidate.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
