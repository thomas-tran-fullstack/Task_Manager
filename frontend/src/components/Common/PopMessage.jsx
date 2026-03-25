import React from 'react'
import { useToast } from '@/hooks/useToast'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

const PopMessage = () => {
  const { toasts, removeToast } = useToast()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'info':
        return <Info className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'info':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${getColors(toast.type)}
            rounded-lg p-4 shadow-lg
            flex items-center gap-3
            animate-slideInDown pointer-events-auto
            transition-all duration-300
          `}
        >
          {getIcon(toast.type)}
          <span className="flex-1 font-medium text-sm">
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            className="hover:opacity-80 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default PopMessage
