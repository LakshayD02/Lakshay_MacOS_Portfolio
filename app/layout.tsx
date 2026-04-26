import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

const faviconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="black"/>
  <text x="50%" y="65%" text-anchor="middle" font-size="60" fill="white" font-family="Arial, sans-serif">
    L
  </text>
</svg>
`

export const metadata: Metadata = {
  title: 'Lakshay Dhoundiyal | MacOS Portfolio',
  description:
    'Explore the MacOS-inspired portfolio of Lakshay Dhoundiyal. Discover projects, skills, and creative work in an interactive desktop-style experience.',

  icons: {
    icon: `data:image/svg+xml,${encodeURIComponent(faviconSVG)}`,
  },

  openGraph: {
    title: 'Lakshay Dhoundiyal | MacOS Portfolio',
    description:
      'A MacOS-inspired portfolio showcasing projects and work of Lakshay Dhoundiyal.',
    url: '',
    siteName: 'Lakshay Portfolio',
    images: [
      {
        url: 'https://your-domain.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lakshay Dhoundiyal Portfolio',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Lakshay Dhoundiyal | MacOS Portfolio',
    description:
      'Explore projects and skills of Lakshay Dhoundiyal.',
    images: ['https://your-domain.com/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}