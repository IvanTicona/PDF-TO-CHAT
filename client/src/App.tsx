import React, { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import PdfViewer from './components/PdfViewer';
import Chat from './components/Chat';

export default function App() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [docId, setDocId] = useState('');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 max-w-3xl mx-auto space-y-6">
        <FileUploader onUpload={(url,id)=>{ setPdfUrl(url); setDocId(id); }} />
        {pdfUrl && <PdfViewer url={pdfUrl} />}
        {docId && <Chat documentId={docId} />}
      </main>
    </div>
  );
}
