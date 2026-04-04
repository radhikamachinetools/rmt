'use client'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface LoadingButtonProps {
  loading?: boolean
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingButton({
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = ''
}: LoadingButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-brand-green hover:bg-brand-green-dark text-white'
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      default:
        return 'bg-brand-green hover:bg-brand-green-dark text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-sm'
      case 'lg':
        return 'px-6 py-3 text-base'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  const isDisabled = loading || disabled

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 transform
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-[0.98] active:scale-[0.96]'
        }
        ${className}
      `}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}