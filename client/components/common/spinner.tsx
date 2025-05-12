'use client'
import clsx from 'clsx'

export function Spinner({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      className={clsx(
        'animate-spin rounded-full border-2 border-t-transparent inline-block',
        className
      )}
      {...props}
    />
  )
}