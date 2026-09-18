import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FileUpload({ onFileSelect, preview, onClear }) {
  const { language } = useLanguage();
  const copy = {
    en: {
      preview: 'Crop preview',
      upload: 'Take a photo or upload',
      hint: 'Use one clear leaf in natural light. JPG or PNG works best.',
      label: 'Upload crop leaf image',
      remove: 'Remove image',
      replace: 'Choose a different image',
      qualityGood: '✓ Image quality verified (Good clarity)',
      qualityWarn: '⚠️ Low resolution or lighting - ensure leaf is close & bright',
    },
    bn: {
      preview: 'ফসলের ছবি',
      upload: 'ছবি তুলুন বা আপলোড করুন',
      hint: 'প্রাকৃতিক আলোতে একটি পরিষ্কার পাতার ছবি তুলুন। JPG বা PNG ব্যবহার করুন।',
      label: 'ফসলের পাতার ছবি আপলোড করুন',
      remove: 'ছবি মুছে ফেলুন',
      replace: 'অন্য ছবি বেছে নিন',
      qualityGood: '✓ ছবির মান ভালো (স্পষ্ট আলো)',
      qualityWarn: '⚠️ আলো বা স্পষ্টতা কম - পাতাটি কাছে ও আলোতে রাখুন',
    },
    hi: {
      preview: 'फसल की तस्वीर',
      upload: 'फोटो लें या अपलोड करें',
      hint: 'प्राकृतिक रोशनी में एक साफ़ पत्ते की तस्वीर लें। JPG या PNG इस्तेमाल करें।',
      label: 'फसल के पत्ते की तस्वीर अपलोड करें',
      remove: 'तस्वीर हटाएँ',
      replace: 'दूसरी तस्वीर चुनें',
      qualityGood: '✓ तस्वीर की गुणवत्ता सही है',
      qualityWarn: '⚠️ रोशनी या स्पष्टता कम है - पत्ते को पास और साफ़ रखें',
    },
  }[language] || {};

  const [isDragging, setIsDragging] = useState(false);
  const [qualityStatus, setQualityStatus] = useState(null); // 'good' | 'warn'
  const fileInputRef = useRef(null);

  const assessQuality = (file) => {
    if (!file) return;
    if (file.size < 5000) {
      setQualityStatus('warn');
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.width >= 400 && img.height >= 400) {
        setQualityStatus('good');
      } else {
        setQualityStatus('warn');
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => setQualityStatus('warn');
    img.src = URL.createObjectURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      assessQuality(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      assessQuality(file);
      onFileSelect(file);
    }
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInputRef.current.value = '';
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        ref={fileInputRef}
        onChange={handleChange}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-[1.25rem] border-2 border-emerald-500/60 bg-slate-900 shadow-[0_12px_24px_rgba(31,93,59,0.12)]">
          <img src={preview} alt={copy.preview} className="max-h-96 w-full object-cover" />
          
          {qualityStatus && (
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              qualityStatus === 'good' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
            }`}>
              {qualityStatus === 'good' ? copy.qualityGood : copy.qualityWarn}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              fileInputRef.current.value = '';
              setQualityStatus(null);
              onClear();
            }}
            className="absolute right-2 top-2 rounded-full bg-red-500/90 p-2 text-white shadow-md transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label={copy.remove}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button type="button" onClick={handleClick} className="absolute bottom-2 left-2 rounded-lg bg-emerald-700/90 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-800 backdrop-blur-md">
            {copy.replace}
          </button>
        </div>
      ) : (
        <div
          className={`flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-[1.4rem] border-2 border-dashed p-8 text-center transition-all ${
            isDragging ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_10px_20px_rgba(31,93,59,0.08)]' : 'border-slate-700 bg-slate-900/80 hover:border-emerald-400 hover:bg-slate-800'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={copy.label}
        >
          <div className="mb-4 rounded-full bg-emerald-500/10 p-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="mb-1 text-lg font-semibold text-slate-100">{copy.upload}</p>
          <p className="max-w-md text-sm leading-6 text-slate-300">{copy.hint}</p>
        </div>
      )}
    </div>
  );
}

