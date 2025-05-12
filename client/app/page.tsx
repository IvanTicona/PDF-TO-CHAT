'use client'

import Link from 'next/link'
import { usePdfs } from '@/hooks/usePdfs'
import { PdfUploader } from '@/components/pdf/PdfUploader'
import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: pdfs = [], isLoading } = usePdfs()
  const router = useRouter()

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <aside className="hidden md:flex md:flex-col md:w-64 border-r p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Tus PDFs</h2>
        {isLoading ? (
          <p>Cargando…</p>
        ) : (
          <ul className="space-y-2 overflow-auto">
            {pdfs.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/pdf/${encodeURIComponent(p.id)}`}
                  className="flex items-center px-3 py-2 rounded hover:bg-gray-100"
                >
                  <FileText className="mr-2 h-4 w-4 text-gray-600" />
                  <span className="truncate">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <div className="md:hidden bg-white px-4 py-2 shadow space-y-2">
        <h2 className="text-lg font-bold text-center">Tus PDFs</h2>
        <select
          className="w-full border border-gray-300 rounded-md p-2"
          defaultValue=""
          onChange={(e) => {
            const id = encodeURIComponent(e.target.value)
            router.push(`/pdf/${id}`)
          }}
        >
          <option value="" disabled>
            Selecciona un PDF…
          </option>
          {pdfs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <main className="flex-1 p-4 overflow-auto bg-gray-50">
        <div className="mx-auto w-full max-w-md md:max-w-3xl p-6 bg-white rounded-lg shadow">
          <PdfUploader />
        </div>
      </main>
    </div>
)
}
