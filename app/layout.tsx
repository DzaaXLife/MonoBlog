import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MONO — A Minimalist Blog',
    template: '%s — MONO'
  },
  description: 'A clean, monochromatic space for writing and ideas.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'MONO',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
