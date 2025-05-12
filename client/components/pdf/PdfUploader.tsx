'use client'
import { useState, ChangeEvent } from 'react'
import { useRouter }              from 'next/navigation'
import { useUploadPdf }           from '@/hooks/useUploadPdf'
import { Button }                 from '@/components/common/button'
import { Spinner }                from '@/components/common/spinner'

export function PdfUploader() {
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const { mutate, isPending, isError } = useUploadPdf({
    onSuccess: (filename) => {
      router.push(`/pdf/${encodeURIComponent(filename)}`)
    },
  })

  return (
    <div className="max-w-md mx-auto p-6">
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

      <Button
        disabled={!file || isPending}
        onClick={() => file && mutate(file)}
        className="mt-4 flex items-center justify-center"
      >
        {isPending ? <Spinner className="w-4 h-4" /> : 'Subir PDF'}
      </Button>

      {isError && <p className="text-red-600 mt-2">Error al subir. Intenta de nuevo.</p>}
    </div>
  )
}