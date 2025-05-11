import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // .env: VITE_API_URL=https://… 
});

export const presign = (filename: string, contentType: string) =>
  API.post('/presign', { filename, contentType });

export const ask = (documentId: string, question: string) =>
  API.post('/qa', { documentId, question });
