'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => (
    <div className={cn('flex flex-col w-full', className)}>
      {label && (
        <label htmlFor={props.id} className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder-gray-400',
          'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
        )}
        {...props}
      />
    </div>
  )
)
Input.displayName = 'Input'