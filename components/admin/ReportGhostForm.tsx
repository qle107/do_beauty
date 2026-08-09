'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const ghostReportSchema = z.object({
  clientName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  ip: z.string().optional(),
})

type GhostReportInput = z.infer<typeof ghostReportSchema>

interface ReportGhostFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function ReportGhostForm({ onSuccess, onCancel }: ReportGhostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GhostReportInput>({ resolver: zodResolver(ghostReportSchema) })

  const onSubmit = async (data: GhostReportInput) => {
    try {
      const res = await fetch('/api/blocklist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Đã ghi nhận vắng mặt')
      onSuccess()
    } catch {
      toast.error('Không thể ghi nhận vắng mặt này')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Input label="Tên khách hàng" id="clientName" placeholder="Tên" error={errors.clientName?.message} {...register('clientName')} />

      <Input label="Số điện thoại" id="phone" placeholder="06 12 34 56 78" error={errors.phone?.message} {...register('phone')} />

      <Input label="Địa chỉ IP (tùy chọn)" id="ip" placeholder="Lấy từ email cảnh báo đặt lịch" error={errors.ip?.message} {...register('ip')} />

      <div className="flex gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Hủy</Button>
        <Button type="submit" isLoading={isSubmitting}>Ghi nhận vắng mặt</Button>
      </div>
    </form>
  )
}
