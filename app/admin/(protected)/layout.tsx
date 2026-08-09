import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Admin | Do Beauty',
    template: '%s | Admin Do Beauty',
  },
}

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Double-check: must be logged in and must be the admin email
  const adminEmail = process.env.ADMIN_EMAIL ?? ''
  if (!session?.user || session.user.email !== adminEmail) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-blush">
      <Sidebar />
      <main className="flex-1 md:ml-64 px-4 md:px-10 pt-20 md:pt-10 pb-10 overflow-x-hidden">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#171614',
            color: '#FAF8F4',
            fontFamily: 'var(--font-manrope)',
            fontSize: '14px',
            borderRadius: '0',
          },
        }}
      />
    </div>
  )
}
