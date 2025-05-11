// src/components/FileUploader.tsx
import React from 'react';
import { presign } from '../services/api';

interface Props { onUpload: (url: string, id: string) => void; }
export default function FileUploader({ onUpload }: Props) {
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1) Consigue presigned URL para subir
    const { data } = await presign(file.name, file.type);

    // 2) Sube el PDF con PUT a la URL firmada
    await fetch(data.url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    // 3) Construye la URL pública SIN querystring
    const bucket = import.meta.env.VITE_BUCKET_NAME;
    const region = import.meta.env.VITE_REGION;
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(file.name)}`;

    // 4) Notifica al padre con la URL pública
    onUpload(publicUrl, file.name);
  };

  return (
    <input
      type="file"
      accept="application/pdf"
      onChange={handle}
      className="block w-full text-sm 
                 file:py-2 file:px-4 
                 file:bg-blue-50 file:text-blue-700 
                 hover:file:bg-blue-100"
    />
  );
}
