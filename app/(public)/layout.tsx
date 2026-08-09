import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SkipToContent from '@/components/layout/SkipToContent'
import CustomCursor from '@/components/layout/CustomCursor'
import StickyBooking from '@/components/layout/StickyBooking'
import { Toaster } from 'react-hot-toast'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <StickyBooking />
      <CustomCursor />
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
          success: { iconTheme: { primary: '#C8A66A', secondary: '#171614' } },
        }}
      />
    </>
  )
}
