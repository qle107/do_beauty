import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const errorId = id ? `${id}-error` : undefined
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs tracking-[0.2em] uppercase text-charcoal-500 font-sans"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full border-b border-dark/30 bg-transparent px-0 py-2.5 text-sm font-sans text-dark placeholder:text-dark/30 focus:border-coral focus:outline-none transition-colors',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-xs text-red-500 font-sans">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const errorId = id ? `${id}-error` : undefined
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs tracking-[0.2em] uppercase text-charcoal-500 font-sans"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full border-b border-dark/30 bg-transparent px-0 py-2.5 text-sm font-sans text-dark placeholder:text-dark/30 focus:border-coral focus:outline-none transition-colors resize-none',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          rows={4}
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-xs text-red-500 font-sans">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Input
