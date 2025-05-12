import { Sidebar } from '@/components/layout/Sidebar'

export default async function PdfLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id: rawId } = await params
  const id = decodeURIComponent(rawId)

  return (
    <div className="flex h-screen">
      <aside className="hidden md:block w-64 border-r bg-white">
        <Sidebar selectedId={id} />
      </aside>

      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
