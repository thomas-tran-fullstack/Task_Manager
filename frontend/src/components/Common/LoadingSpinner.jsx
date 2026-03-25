import React from 'react'

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const spinner = (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
      
      {/* 3D effect */}
      <style>{`
        @keyframes spin3d {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
          }
        }
      `}</style>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      {spinner}
    </div>
  )
}

export default LoadingSpinner
