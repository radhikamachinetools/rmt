'use client'
import { AlertTriangle, Trash2, X, UserX, CheckCircle, Info } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  confirmButtonClass?: string
  type?: 'delete' | 'terminate' | 'warning' | 'success' | 'info'
  icon?: React.ReactNode
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
  type = 'delete',
  icon
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    if (icon) return icon
    
    switch (type) {
      case 'delete':
        return <Trash2 className="h-5 w-5 text-red-600" />
      case 'terminate':
        return <UserX className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />
    }
  }

  const getIconBg = () => {
    switch (type) {
      case 'delete':
      case 'terminate':
        return 'bg-red-100'
      case 'warning':
        return 'bg-amber-100'
      case 'success':
        return 'bg-green-100'
      case 'info':
        return 'bg-blue-100'
      default:
        return 'bg-red-100'
    }
  }

  const getConfirmButtonClass = () => {
    if (confirmButtonClass !== 'bg-red-600 hover:bg-red-700') {
      return confirmButtonClass
    }
    
    switch (type) {
      case 'delete':
      case 'terminate':
        return 'bg-red-600 hover:bg-red-700'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700'
      case 'success':
        return 'bg-green-600 hover:bg-green-700'
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700'
      default:
        return 'bg-red-600 hover:bg-red-700'
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      style={{ zIndex: 99999 }}
      data-modal="confirmation"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-scale-in border border-gray-200"
        data-modal-content="confirmation"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${getIconBg()}`}>
            {getIcon()}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}