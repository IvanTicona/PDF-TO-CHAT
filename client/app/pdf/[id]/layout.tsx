import { Sidebar } from '../../../components/layout/Sidebar';

export default async function PdfLayout({
  children,
  params,           // params: { id: string }
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id: rawId } = await params
  const id = decodeURIComponent(rawId)
  return (
    <div className="flex h-screen">
      <Sidebar selectedId={id} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
