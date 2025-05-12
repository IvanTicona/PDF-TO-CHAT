'use client'
import Link from 'next/link'
import { usePdfs } from '@/hooks/usePdfs'
import { Spinner } from '@/components/common/spinner'

export function Sidebar({ selectedId }: { selectedId?: string }) {
  const { data: pdfs = [], isLoading } = usePdfs()

  return (
    <aside className="w-64 bg-gray-50 border-r p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Tus PDFs</h2>

      {isLoading ? (
        <Spinner className="mx-auto" />
      ) : (
        <ul className="flex-1 overflow-auto space-y-2">
          {pdfs.map((pdf) => (
            <li key={pdf.id}>
              <Link
                href={`/pdf/${encodeURIComponent(pdf.id)}`}
                className={
                  `block px-2 py-1 rounded ${
                    pdf.id === selectedId ? 'bg-blue-100 font-medium' : 'hover:bg-gray-100'
                  }`
                }
              >
                {pdf.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}