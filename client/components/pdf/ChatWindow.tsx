'use client'

import { useState, FormEvent } from 'react'
import axios from 'axios'
import { useChat }             from '@/hooks/useChat'
import { Input }               from '@/components/common/input'
import { Button }              from '@/components/common/button'
import { Spinner }             from '@/components/common/spinner'
import { Bot, User }           from 'lucide-react'

export function ChatWindow({ documentId }: { documentId: string }) {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<{ q: string; a: string }[]>([])
  const [processing, setProcessing] = useState(false)
  const mutation = useChat()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = question.trim()
    if (!q) return
    setQuestion('')
    setProcessing(false)

    let answer: string | undefined
    const maxRetries = 10
    let attempt = 0

    while (attempt < maxRetries) {
      attempt++
      try {
        answer = await mutation.mutateAsync({ documentId, question: q })
        break
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setProcessing(true)
          await new Promise((r) => setTimeout(r, 3000))
          continue
        }
        throw err
      }
    }

    setProcessing(false)
    if (answer) {
      setHistory((h) => [...h, { q, a: answer }])
    } else {
      console.error('No se pudo procesar el PDF a tiempo.')
    }
  }

  return (
    <div className="relative flex flex-col h-full">
      {processing && (
        <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
          <Spinner className="w-8 h-8 text-green-500" />
          <span className="ml-2 text-green-600 font-medium">
            Procesando PDF…
          </span>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {history.map((msg, i) => (
          <div key={i}>
            <div className="flex justify-end mb-2">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[100%]">
                  {msg.q}
                </div>
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex justify-start mb-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-gray-600" />
                <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-[70%] whitespace-pre-wrap">
                  {msg.a}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="p-4 border-t flex gap-2 w-full">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta…"
          className="flex-[4]"
        />
        <Button type="submit" disabled={mutation.isPending} className="flex-[1]">
          {mutation.isPending ? <Spinner className="w-4 h-4" /> : 'Enviar'}
        </Button>
      </form>
    </div>
  )
}
