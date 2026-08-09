import type { Metadata } from 'next'
import GalleryManager from '@/components/admin/GalleryManager'

export const metadata: Metadata = { title: 'Thư viện ảnh' }

export default function AdminGalleryPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="db-serif text-3xl text-[color:var(--db-ink)]">Thư viện ảnh</h1>
        <p className="mt-1 text-sm text-[color:var(--db-ink-soft)]">
          Tải lên, phân loại và đăng các tác phẩm hiển thị trên trang công khai.
        </p>
      </header>
      <GalleryManager />
    </div>
  )
}
