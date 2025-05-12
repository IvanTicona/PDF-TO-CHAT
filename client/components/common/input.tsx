// components/common/input.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Texto de la etiqueta */
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={cn(
          'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400',
          'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
          className
        )}
        {...props}
      />
    </div>
  )
)

Input.displayName = 'Input'
