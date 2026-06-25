import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { CursorGlow } from '@/components/ui/CursorGlow'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://shreedeviservices.in'),
  title: 'Shree Devi Services | Electrician & Plumbing Services in Udupi',
  description:
    'Professional electricians, plumbers and home maintenance services in Udupi and Shankarpura. Fast, reliable and affordable home services.',
  keywords: [
    'electrician in udupi',
    'plumber in udupi',
    'electrician shankarpura',
    'home maintenance udupi',
    'electrical services udupi',
    'plumbing services udupi',
    'water tank cleaning udupi',
  ],
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'JPpL90B8pxFtliFNY23hpIoFZkdXJS2jxT5-yPhPevU',
  },
  openGraph: {
    title: 'Shree Devi Services',
    description:
      'Professional electricians and plumbers in Udupi and Shankarpura.',
    url: 'https://shreedeviservices.in',
    siteName: 'Shree Devi Services',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shree Devi Services',
    description:
      'Professional electricians and plumbers in Udupi and Shankarpura.',
  },
}

// ── Local Business JSON-LD Structured Data ────────────────────────────────────
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['Electrician', 'Plumber', 'HomeAndConstructionBusiness'],
  name: 'Shree Devi Services',
  url: 'https://shreedeviservices.in',
  telephone: '+918431759374',
  email: 'srideviservice.1122@gmail.com',
  image: 'https://shreedeviservices.in/icon.svg',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shankarpura',
    addressLocality: 'Udupi',
    addressRegion: 'Karnataka',
    postalCode: '574115',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '13.3409',
    longitude: '74.7421',
  },
  areaServed: [
    'Shankarpura', 'Udupi', 'Manipal', 'Brahmavara', 'Kaup',
    'Uchila', 'Padubidri', 'Malpe', 'Karkala',
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+918431759374',
    contactType: 'customer service',
    availableLanguage: ['English', 'Kannada', 'Hindi'],
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <CursorGlow />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
