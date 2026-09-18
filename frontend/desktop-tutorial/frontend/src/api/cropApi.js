import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
});

function sessionHeaders() {
  const token = localStorage.getItem('fasal-sathi-session-token');
  return token ? { 'X-Session-Token': token } : {};
}

async function prepareDiagnosisImage(image) {
  if (!image || image.size <= 2 * 1024 * 1024) return image;

  const bitmap = await createImageBitmap(image);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(160, Math.round(bitmap.width * scale));
  canvas.height = Math.max(160, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.84));
  return blob ? new File([blob], 'diagnosis.jpg', { type: 'image/jpeg' }) : image;
}

export async function diagnose(image, metadata = {}) {
  const preparedImage = await prepareDiagnosisImage(image);
  const formData = new FormData();
  formData.append('image', preparedImage);

  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, String(value));
    }
  });

  return api.post('/diagnose', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...sessionHeaders(),
    },
  });
}

export function transcribeAudio(audioBlob, language = 'en') {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice.wav');
  formData.append('language', language);

  return api.post('/speech/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getDistricts() {
  return api.get('/districts');
}

export function getCrops() {
  return api.get('/crops');
}

export function getTranslations() {
  return api.get('/translations');
}

export function getWeather(latitude, longitude) {
  return api.get('/weather', { params: { lat: latitude, lon: longitude } });
}

export function getKvkInfo(district, latitude, longitude) {
  return api.get('/kvk', { params: { district, lat: latitude, lon: longitude } });
}

export function getMandiPrices(crop, state, district) {
  return api.get('/mandi-prices', { params: { crop, state, district } });
}

export function healthCheck() {
  return api.get('/health');
}

export function getDiagnosisHistory() {
  return api.get('/diagnosis-history', { headers: sessionHeaders() });
}

export function login(username, password) {
  return api.post('/auth/login', { username, password });
}

export function register(username, password, role = 'FARMER') {
  return api.post('/auth/register', { username, password, role });
}

export function getCurrentUser() {
  return api.get('/auth/me', { headers: sessionHeaders() });
}

export function getFarms(farmerUsername) {
  return api.get('/farms', { params: farmerUsername ? { farmerUsername } : {}, headers: sessionHeaders() });
}

export function createPestObservation(observation) {
  return api.post('/pest-observations', observation, { headers: sessionHeaders() });
}

export function getPestObservations(farmId) {
  return api.get('/pest-observations', { params: farmId ? { farmId } : {}, headers: sessionHeaders() });
}

export function getFollowUps(params = {}) {
  return api.get('/follow-ups', { params, headers: sessionHeaders() });
}

export function createFollowUp(task) {
  return api.post('/follow-ups', task, { headers: sessionHeaders() });
}

export function completeFollowUp(id) {
  return api.post(`/follow-ups/${id}/complete`, {}, { headers: sessionHeaders() });
}

export function getHotspots(params = {}) {
  return api.get('/hotspots', { params });
}

export function getAdminDashboard() {
  return api.get('/admin/dashboard', { headers: sessionHeaders() });
}

export function submitDiagnosisFeedback(feedback) {
  return api.post('/diagnosis-feedback', feedback, { headers: sessionHeaders() });
}

export function createReferral(referral) {
  return api.post('/referrals', referral, { headers: sessionHeaders() });
}

export default api;

