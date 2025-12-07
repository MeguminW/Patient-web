import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  variant?: 'icon' | 'wordmark' | 'combined'
  className?: string
}

export function Logo({ variant = 'combined', className }: LogoProps) {
  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Image
          src="/fountain-icon.png"
          alt="Fountain"
          width={80}
          height={80}
          priority
          unoptimized
          className="select-none"
        />
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center justify-center -my-2', className)}>
        <Image
          src="/fountain-logo.png"
          alt="Fountain"
          width={100}
          height={100}
          priority
          unoptimized
          className="select-none -my-3"
        />
      </div>
    )
  }

  // Combined: Icon + Wordmark
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Image
        src="/fountain-combined.png"
        alt="Fountain Health Technologies"
        width={280}
        height={84}
        priority
        unoptimized
        className="select-none"
      />
    </div>
  )
}
