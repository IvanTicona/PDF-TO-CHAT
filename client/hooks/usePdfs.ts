import { useQuery } from '@tanstack/react-query'
import { api }      from '@/lib/api'
import { Pdf } from '@/types/pdf'

export function usePdfs() {
  return useQuery<Pdf[]>({
    queryKey: ['pdfs'],
    queryFn: async () => {
      const { data } = await api.get<{ pdfs: Pdf[] }>('/pdf-list')
      return data.pdfs
    },
  })
}