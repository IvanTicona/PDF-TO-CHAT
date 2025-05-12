// app/pdf/[id]/page.tsx
import { ChatWindow } from '@/components/pdf/ChatWindow'

export default async function PdfChatPage({
  params,      // params: { id: string }
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <main className="flex-1 p-4">
      <ChatWindow documentId={id} />
    </main>
  )
}
