import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { api }                                                   from '@/lib/api'

export function useUploadPdf(
  options?: UseMutationOptions<string, unknown, File>
) {
  const qc = useQueryClient()

  return useMutation<string, unknown, File>({
    mutationFn: async (file) => {
      const { data } = await api.post<{ url: string }>('/presign', {
        filename: file.name,
        contentType: file.type,
      })
      await fetch(data.url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      return file.name
    },
    onSuccess(filename, ...rest) {
      qc.invalidateQueries({ queryKey: ['pdfs'] })
      options?.onSuccess?.(filename, ...rest)
    },
    onError(error, ...rest) {
      options?.onError?.(error, ...rest)
    },
    ...options,
  })
}