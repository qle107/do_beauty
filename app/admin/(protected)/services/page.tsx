'use client'

import { useEffect, useState, useCallback } from 'react'
import Modal from '@/components/ui/Modal'
import ServiceForm from '@/components/admin/ServiceForm'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Service } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  FORFAIT:   'Gói spa',
  MAINS:     'Tay & Manucure',
  PIEDS:     'Làm đẹp chân',
  CAPSULE:   'Đắp & nối móng',
  NAIL_ART:  'Nail art & hoàn thiện',
  CILS:      'Mi & ánh mắt',
  VISAGE:    'Chăm sóc da mặt',
  CORPS:     'Massage & cơ thể',
  EPILATION: 'Tẩy lông',
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | undefined>(undefined)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/services?admin=true')
      const data = res.ok ? await res.json() as unknown : []
      setServices(Array.isArray(data) ? data as Service[] : [])
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    await load()
  }, [load])

  // Fetch on mount; this data-loading effect sets state after the fetch resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])

  const openCreate = () => { setEditingService(undefined); setModalOpen(true) }
  const openEdit = (s: Service) => { setEditingService(s); setModalOpen(true) }
  const handleSuccess = () => { setModalOpen(false); void refresh() }

  const toggleActive = async (service: Service) => {
    try {
      await fetch(`/api/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive }),
      })
      void refresh()
      toast.success(service.isActive ? 'Đã ẩn dịch vụ' : 'Đã bật dịch vụ')
    } catch { toast.error('Không thể cập nhật') }
  }

  const deleteService = async (id: string) => {
    if (!confirm('Xóa dịch vụ này? Hành động này không thể hoàn tác.')) return
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' })
      void refresh()
      toast.success('Đã xóa dịch vụ')
    } catch { toast.error('Không thể xóa') }
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="font-serif text-4xl font-light text-dark">Dịch vụ</h1>
          <p className="font-sans text-sm text-dark/40 mt-1">Quản lý menu dịch vụ của bạn.</p>
        </div>
        <button onClick={openCreate} className="bg-dark text-cream text-sm px-6 py-3 font-sans tracking-wider hover:bg-coral-dark transition-colors">
          + Thêm dịch vụ
        </button>
      </div>

      <div className="bg-cream border border-dark/10">
        {loading ? (
          <div className="p-8 flex flex-col gap-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-dark/5 animate-pulse" />)}
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-sans text-dark/30 italic mb-4">Chưa có dịch vụ nào.</p>
            <button onClick={openCreate} className="text-sm font-sans text-coral underline">Tạo dịch vụ đầu tiên</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm font-sans">
            <thead>
              <tr className="border-b border-dark/10">
                {['Tên', 'Danh mục', 'Thời lượng', 'Giá', 'Đang hoạt động', 'Thao tác'].map(h => (
                  <th key={h} className="text-left py-3 px-6 text-xs tracking-[0.2em] uppercase text-dark/30 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {services.map(service => (
                <tr key={service.id} className="hover:bg-blush/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-medium text-dark">{service.name}</p>
                    <p className="text-dark/40 text-xs mt-0.5 max-w-xs truncate">{service.description}</p>
                  </td>
                  <td className="py-4 px-6 text-charcoal-500">{CATEGORY_LABELS[service.category] ?? service.category}</td>
                  <td className="py-4 px-6 text-charcoal-500">{service.duration} phút</td>
                  <td className="py-4 px-6 font-serif text-coral">{formatCurrency(service.price)}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => void toggleActive(service)}
                      className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${service.isActive ? 'bg-coral' : 'bg-dark/20'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${service.isActive ? 'translate-x-5' : ''}`} />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(service)} className="text-xs text-charcoal-500 hover:text-dark border border-dark/20 hover:border-dark px-3 py-1.5 transition-colors">Sửa</button>
                      <button onClick={() => void deleteService(service.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen}
        title={editingService ? 'Sửa dịch vụ' : 'Dịch vụ mới'}
        description={editingService ? 'Cập nhật thông tin dịch vụ này.' : 'Điền chi tiết để thêm dịch vụ.'}>
        <ServiceForm service={editingService} onSuccess={handleSuccess} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
