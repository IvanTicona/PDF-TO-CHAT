// app/pdf/[id]/page.tsx
import { ChatWindow } from '@/components/pdf/ChatWindow'

export default async function PdfChatPage({
  params,      // params: { id: string }
}: {
  params: Promise<{ id: string }>
}) {
  const { id: rawId } = await params
  const id = decodeURIComponent(rawId)
  return (
    <main className="flex-1 p-4">
      <ChatWindow documentId={id} />
    </main>
  )
}
