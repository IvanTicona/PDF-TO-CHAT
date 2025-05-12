import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'PDF-Chat',
  description: 'Chat sobre PDFs usando IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}