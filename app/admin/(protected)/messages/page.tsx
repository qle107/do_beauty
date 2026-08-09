'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import ComposeEmailForm from '@/components/admin/ComposeEmailForm'

type ContactStatus = 'unread' | 'read' | 'replied'
interface ContactReply { body: string; sentAt: string }
interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactStatus
  replies: ContactReply[]
  createdAt: string
}

type Filter = 'all' | 'unread' | 'replied'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading]   = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter]     = useState<Filter>('all')
  const [replyBody, setReplyBody] = useState('')
  const [sending, setSending]   = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const res  = await fetch('/api/contact')
      if (!res.ok) throw new Error()
      const data = await res.json() as ContactMessage[]
      setMessages(data)
    } catch {
      toast.error('Không tải được tin nhắn')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount; this data-loading effect sets state after the fetch resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])

  const selected = messages.find((m) => m.id === selectedId) ?? null

  const open = async (msg: ContactMessage) => {
    setSelectedId(msg.id)
    setReplyBody('')
    if (msg.status === 'unread') {
      // Marks read server-side; reflect locally.
      await fetch(`/api/contact/${msg.id}`)
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: 'read' } : m))
    }
  }

  const sendReply = async () => {
    if (!selected) return
    const body = replyBody.trim()
    if (!body) { toast.error('Hãy viết câu trả lời'); return }
    setSending(true)
    try {
      const res = await fetch(`/api/contact/${selected.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      if (!res.ok) throw new Error()
      toast.success('Đã gửi trả lời')
      setReplyBody('')
      const sentAt = new Date().toISOString()
      setMessages((prev) => prev.map((m) => m.id === selected.id
        ? { ...m, status: 'replied', replies: [...m.replies, { body, sentAt }] } : m))
    } catch {
      toast.error('Gửi thất bại')
    } finally {
      setSending(false)
    }
  }

  const remove = async (msg: ContactMessage) => {
    if (!confirm(`Xóa tin nhắn của ${msg.name}?`)) return
    try {
      const res = await fetch(`/api/contact/${msg.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Đã xóa tin nhắn')
      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
      if (selectedId === msg.id) setSelectedId(null)
    } catch {
      toast.error('Không xóa được')
    }
  }

  const filtered = messages.filter((m) =>
    filter === 'all' ? true : filter === 'unread' ? m.status === 'unread' : m.status === 'replied')
  const unreadCount = messages.filter((m) => m.status === 'unread').length
  const contactEmails = Array.from(new Set(messages.map((m) => m.email)))

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-8">
        <div>
          <h1 className="font-serif text-4xl font-light text-dark">Tin nhắn</h1>
          <p className="font-sans text-sm text-dark/40 mt-1">
            Các form liên hệ nhận được · trả lời trực tiếp từ trang này.
          </p>
        </div>
        <button
          onClick={() => setComposeOpen(true)}
          className="shrink-0 bg-dark text-cream text-sm px-6 py-3 font-sans tracking-wider hover:bg-coral-dark transition-colors"
        >
          + Tin nhắn mới
        </button>
      </div>

      <Modal open={composeOpen} onOpenChange={setComposeOpen} title="Tin nhắn mới" description="Gửi email từ dobeauty94@gmail.com">
        <ComposeEmailForm
          contactEmails={contactEmails}
          onSuccess={() => setComposeOpen(false)}
          onCancel={() => setComposeOpen(false)}
        />
      </Modal>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {([['all', 'Tất cả'], ['unread', `Chưa đọc${unreadCount ? ` (${unreadCount})` : ''}`], ['replied', 'Đã trả lời']] as [Filter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-sans tracking-wider px-4 py-2 border transition-colors ${
              filter === key ? 'bg-dark text-cream border-dark' : 'border-dark/20 text-charcoal-500 hover:border-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-6">
        {/* List */}
        <div className="bg-cream border border-dark/10">
          {loading ? (
            <div className="p-6 flex flex-col gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-dark/5 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-sm font-sans text-dark/30 italic text-center">Không có tin nhắn.</p>
          ) : (
            <ul className="divide-y divide-dark/5 max-h-[70vh] overflow-y-auto">
              {filtered.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => void open(m)}
                    className={`w-full text-left p-4 hover:bg-blush/50 transition-colors ${selectedId === m.id ? 'bg-blush/60' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {m.status === 'unread' && <span className="w-2 h-2 rounded-full bg-coral shrink-0" aria-label="Chưa đọc" />}
                      <span className={`font-sans text-sm truncate ${m.status === 'unread' ? 'text-dark font-medium' : 'text-charcoal-500'}`}>{m.name}</span>
                      {m.status === 'replied' && <span className="ml-auto text-[10px] uppercase tracking-wider text-green-700 shrink-0">Đã trả lời</span>}
                    </div>
                    <p className="font-sans text-sm text-charcoal-500 truncate mt-1">{m.subject}</p>
                    <p className="font-sans text-xs text-dark/30 mt-1">{formatDate(m.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="bg-cream border border-dark/10 p-6 min-h-[400px]">
          {!selected ? (
            <p className="text-sm font-sans text-dark/30 italic h-full flex items-center justify-center">
              Chọn một tin nhắn để đọc và trả lời.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-light text-dark">{selected.subject}</h2>
                  <p className="font-sans text-sm text-charcoal-500 mt-1">
                    {selected.name} ·{' '}
                    <a href={`mailto:${selected.email}`} className="text-coral hover:underline">{selected.email}</a>
                  </p>
                  <p className="font-sans text-xs text-dark/30 mt-1">{formatDate(selected.createdAt)}</p>
                </div>
                <button
                  onClick={() => void remove(selected)}
                  className="shrink-0 text-xs font-sans text-dark/40 border border-dark/15 px-3 py-2 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  Xóa
                </button>
              </div>

              <div className="bg-cream border border-dark/10 p-4">
                <p className="font-sans text-sm text-dark/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {selected.replies.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40">Câu trả lời của bạn</h3>
                  {selected.replies.map((r, i) => (
                    <div key={i} className="border-l-2 border-coral/40 pl-4">
                      <p className="font-sans text-sm text-charcoal-500 whitespace-pre-wrap">{r.body}</p>
                      <p className="font-sans text-xs text-dark/30 mt-1">{formatDate(r.sentAt)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-dark/10 pt-5">
                <label className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40">Trả lời</label>
                <textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  placeholder={`Chào ${selected.name},`}
                  className="w-full border border-dark/15 bg-white p-3 font-sans text-sm text-dark focus:border-dark focus:outline-none resize-y"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => void sendReply()}
                    disabled={sending}
                    className="bg-dark text-cream text-sm px-6 py-3 font-sans tracking-wider hover:bg-coral-dark transition-colors disabled:opacity-50"
                  >
                    {sending ? 'Đang gửi…' : 'Gửi trả lời'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
