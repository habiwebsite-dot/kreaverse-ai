import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Kreaverse AI',
  description: 'AI Generator Platform - Audio, Image, Video, Mastering',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
