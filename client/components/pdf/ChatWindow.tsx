'use client'
import { useState, FormEvent } from 'react'
import { useChat }             from '@/hooks/useChat'
import { Button }              from '@/components/common/button'
import { Spinner }             from '@/components/common/spinner'
import { Input } from '../common/input'

export function ChatWindow({ documentId }: { documentId: string }) {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<{ q: string; a: string }[]>([])
  const mutation = useChat()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    const q = question.trim()
    setQuestion('')
    const answer = await mutation.mutateAsync({ documentId, question: q })
    setHistory((h) => [...h, { q, a: answer }])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-4 p-4">
        {history.map((msg, i) => (
          <div key={i}>
            <p className="font-semibold">Tú: {msg.q}</p>
            <p className="whitespace-pre-wrap">Bot: {msg.a}</p>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="p-4 border-t flex">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta…"
          className="flex-1 mr-2"
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner className="w-4 h-4" /> : 'Enviar'}
        </Button>
      </form>
    </div>
  )
}