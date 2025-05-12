'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChatWindow }           from '@/components/pdf/ChatWindow'
import { ArrowLeft }            from 'lucide-react'

export default function PdfChatPage() {
  const { id: rawId } = useParams() || { id: '' }
  const id = typeof rawId === 'string' ? decodeURIComponent(rawId) : ''

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between bg-white px-4 py-3 shadow-md">
        <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Cargar otro PDF</span>
        </Link>
        <h1 className="font-semibold text-amber-50 rounded-lg truncate bg-red-500 p-2">Chat - {id}</h1>
      </header>

      <main className="flex-1 overflow-auto bg-gray-50 p-4">
        <div className="mx-auto w-full max-w-3xl">
          <ChatWindow documentId={id} />
        </div>
      </main>
    </div>
  )
}
