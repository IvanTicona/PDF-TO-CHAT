import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface Props { url: string; }

export default function PdfViewer({ url }: Props) {
  return (
    <Worker workerUrl="/pdf.worker.min.mjs">
      <div className="border rounded-lg h-[600px]">
        <Viewer fileUrl={url} />
      </div>
    </Worker>
  );
}
