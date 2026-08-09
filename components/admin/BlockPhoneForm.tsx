'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const blockPhoneSchema = z.object({
  clientName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(1, 'Cần nhập số điện thoại'),
  reason: z.string().optional(),
})

type BlockPhoneInput = z.infer<typeof blockPhoneSchema>

interface BlockPhoneFormProps {
  onSuccess: () => void
  onCancel: () => void
}

// Immediately blocks a phone number (admin action) via POST /api/blocklist.
// Unlike ReportGhostForm (which logs a no-show and only auto-blocks at the
// threshold), this blocks straight away.
export default function BlockPhoneForm({ onSuccess, onCancel }: BlockPhoneFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlockPhoneInput>({ resolver: zodResolver(blockPhoneSchema) })

  const onSubmit = async (data: BlockPhoneInput) => {
    try {
      const res = await fetch('/api/blocklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Đã chặn số')
      onSuccess()
    } catch {
      toast.error('Không thể chặn số này')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Input label="Tên khách hàng" id="clientName" placeholder="Tên" error={errors.clientName?.message} {...register('clientName')} />

      <Input label="Số điện thoại" id="phone" placeholder="06 12 34 56 78" error={errors.phone?.message} {...register('phone')} />

      <Input label="Lý do (không bắt buộc)" id="reason" placeholder="Ví dụ: hành vi thô lỗ" error={errors.reason?.message} {...register('reason')} />

      <div className="flex gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Hủy</Button>
        <Button type="submit" isLoading={isSubmitting}>Chặn số</Button>
      </div>
    </form>
  )
}
