import { useMutation } from '@tanstack/react-query'
import { api }         from '@/lib/api'

export function useChat() {
  return useMutation<string, unknown, { documentId: string; question: string }>({
    mutationFn: async ({ documentId, question }) => {
      const { data } = await api.post<{ answer: string }>('/qa', { documentId, question })
      return data.answer
    },
  })
}