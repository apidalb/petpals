import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'PetPALS - Platform Adopsi Hewan',
  description: 'Temukan sahabat berbulu impianmu dan berikan mereka rumah yang penuh kasih.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
