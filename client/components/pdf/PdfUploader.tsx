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

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={onFileChange}
      />

      <label
        htmlFor="file-upload"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
      >
        {file ? (
          <span className="truncate max-w-xs text-gray-800">{file.name}</span>
        ) : (
          <span className="text-gray-600">Seleccionar PDF</span>
        )}
      </label>

      <Button
        disabled={!file || isPending}
        onClick={() => file && mutate(file)}
        className="inline-flex items-center space-x-2"
      >
        {isPending ? <Spinner className="w-4 h-4" /> : <span>Subir PDF</span>}
      </Button>

      {isError && (
        <p className="text-red-600 mt-2">Error al subir. Intenta de nuevo.</p>
      )}
    </div>
  )
}
