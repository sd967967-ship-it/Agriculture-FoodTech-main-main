import React from 'react';

export default function LoadingSpinner({ message = "Analyzing..." }) {
  return (
    <div className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-[1.25rem] border border-emerald-500/20 bg-slate-900/80 p-8">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-emerald-500/20" />
        <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
      </div>
      <p className="mt-4 animate-pulse text-sm font-semibold text-emerald-200">{message}</p>
    </div>
  );
}
