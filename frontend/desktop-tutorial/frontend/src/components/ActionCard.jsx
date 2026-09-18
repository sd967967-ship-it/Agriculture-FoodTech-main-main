import React from 'react';

export default function ActionCard({ stepNumber, title, icon, actions, items }) {
  const resolvedActions = actions ?? items ?? [];

  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(13,26,22,0.96),rgba(10,19,16,0.96))] p-5 shadow-[0_10px_20px_rgba(6,15,12,0.3)]">
      <div className="mb-4 flex items-start">
        <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-900/80 font-bold text-emerald-100">
          {stepNumber}
        </div>
        <h3 className="flex items-center gap-2 pt-1 text-lg font-semibold text-slate-100">
          <span>{icon}</span>
          <span>{title}</span>
        </h3>
      </div>
      <ul className="space-y-2 pl-11">
        {resolvedActions.map((action, index) => (
          <li key={index} className="relative text-sm leading-6 text-slate-300 before:absolute before:-left-4 before:text-emerald-300 before:content-['•']">
            {action}
          </li>
        ))}
      </ul>
    </div>
  );
}
