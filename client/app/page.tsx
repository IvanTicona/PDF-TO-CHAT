'use client'
import Link from 'next/link'
import { usePdfs } from '@/hooks/usePdfs'
import { PdfUploader } from '@/components/pdf/PdfUploader'

export default function HomePage() {
  const { data: pdfs = [], isLoading } = usePdfs()

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Tus PDFs</h2>
        {isLoading ? (
          <p>Cargando…</p>
        ) : (
          <ul className="space-y-2">
            {pdfs.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/pdf/${encodeURIComponent(p.id)}`}
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <PdfUploader />
      </main>
    </div>
  )
}