import { useCallback, useEffect, useRef, useState } from 'react';
import { transcribeAudio } from '../api/cropApi';

const LANG_LOCALE = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN' };

function pickVoice(voices, language) {
  const locale = LANG_LOCALE[language] || 'en-IN';
  const short = (language || 'en').toLowerCase();
  return (
    voices.find((v) => v.lang && v.lang.toLowerCase() === locale.toLowerCase())
    || voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(short))
    || voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'))
    || null
  );
}

function splitSpeakable(text) {
  return String(text || '')
    .split(/(?<=[।.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function voiceSupport() {
  const recognition = typeof window !== 'undefined'
    && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const synthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const recorder = typeof window !== 'undefined' && 'MediaRecorder' in window;
  return { stt: !!recognition, tts: !!synthesis, offlineStt: recorder };
}

/**
 * useVoice — one small interface over two adapters:
 *  - Web Speech API (online, free): live mic dictation + local voices.
 *  - MediaRecorder + /speech/transcribe (offline-capable server STT).
 * Callers learn 6 members; mic permission, chunking, and voice
 * matching stay inside. Pass { transcribe } to swap the STT adapter
 * in tests.
 */
export default function useVoice(language, deps = {}) {
  const transcribe = deps.transcribe || transcribeAudio;
  const support = voiceSupport();
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const recognizerRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const utterRef = useRef([]);

  const stopListening = useCallback(() => {
    try { recognizerRef.current?.abort(); } catch { /* already stopped */ }
    recognizerRef.current = null;
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try { recorderRef.current.stop(); } catch { /* ignore */ }
    }
    setListening(false);
  }, []);

  useEffect(() => () => {
    stopListening();
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
  }, [stopListening]);

  const startListening = useCallback((onResult, onError) => {
    const locale = LANG_LOCALE[language] || 'en-IN';
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Recognition) {
      stopListening();
      const recognition = new Recognition();
      recognition.lang = locale;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognizerRef.current = recognition;
      setListening(true);
      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map((result) => result[0]?.transcript || '')
          .join(' ')
          .trim();
        stopListening();
        if (text) onResult(text);
      };
      recognition.onerror = (event) => {
        stopListening();
        if (onError) onError(event?.error || 'recognition-error');
      };
      recognition.onend = () => setListening(false);
      try {
        recognition.start();
      } catch {
        setListening(false);
        if (onError) onError('recognition-start-failed');
      }
      return;
    }
    // Offline-capable fallback: record audio, send to server STT.
    if (!('MediaRecorder' in window)) {
      if (onError) onError('voice-unsupported');
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setListening(false);
        try {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const response = await transcribe(blob, language);
          const text = String(response?.data?.transcript || response?.data?.text || '').trim();
          if (text) onResult(text);
          else if (onError) onError('empty-transcript');
        } catch {
          if (onError) onError('transcribe-failed');
        }
      };
      recorder.start();
      setRecording(true);
      setListening(true);
    }).catch(() => {
      if (onError) onError('mic-denied');
    });
  }, [language, stopListening, transcribe]);

  const cancelSpeak = useCallback(() => {
    utterRef.current = [];
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
    setSpeaking(false);
  }, []);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return false;
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const parts = splitSpeakable(text);
    if (parts.length === 0) return false;
    const voices = synthesis.getVoices ? synthesis.getVoices() : [];
    const voice = pickVoice(voices, language);
    const queue = parts.map((part) => {
      const utterance = new SpeechSynthesisUtterance(part);
      utterance.lang = LANG_LOCALE[language] || 'en-IN';
      utterance.rate = 0.95;
      if (voice) utterance.voice = voice;
      return utterance;
    });
    utterRef.current = queue;
    setSpeaking(true);
    queue.forEach((utterance, index) => {
      utterance.onend = () => {
        if (index === queue.length - 1) setSpeaking(false);
      };
      utterance.onerror = () => {
        if (index === queue.length - 1) setSpeaking(false);
      };
      synthesis.speak(utterance);
    });
    return true;
  }, [language]);

  return {
    sttSupported: support.stt || support.offlineStt,
    ttsSupported: support.tts,
    listening,
    recording,
    speaking,
    autoRead,
    setAutoRead,
    startListening,
    stopListening,
    speak,
    cancelSpeak,
  };
}
