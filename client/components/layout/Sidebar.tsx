'use client'
import Link from 'next/link'
import { usePdfs } from '@/hooks/usePdfs'
import { Spinner } from '@/components/common/spinner'
import { FileText } from 'lucide-react'

export function Sidebar({ selectedId }: { selectedId?: string }) {
  const { data: pdfs = [], isLoading } = usePdfs()

  return (
    <aside className="w-64 bg-gray-50 border-r p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Tus PDFs</h2>

      {isLoading ? (
        <Spinner className="mx-auto" />
      ) : (
        <ul className="flex-1 overflow-auto space-y-2">
          {pdfs.map((pdf) => (
            <li key={pdf.id}>
              <Link
                href={`/pdf/${encodeURIComponent(pdf.id)}`}
                className={
                  `flex items-center px-3 py-2 rounded ${
                    encodeURIComponent(pdf.id) === selectedId ? 'bg-blue-600 font-medium text-amber-50' : 'hover:bg-gray-100'
                  }`
                }
              >
              <FileText className={`mr-2 h-4 w-4 ${encodeURIComponent(pdf.id) === selectedId? 'text-white': 'text-gray-600'}`} />
              <span className="truncate">{pdf.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}