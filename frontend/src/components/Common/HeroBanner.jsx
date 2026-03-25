import React from 'react'
import { CheckCircle, Zap, Shield, Smartphone } from 'lucide-react'

const HeroBanner = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-12 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Logo Section */}
        <div className="mb-8 animate-slideInDown">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-3xl font-bold">TaskFlow</span>
          </div>
          <p className="text-blue-100 text-sm font-medium">Personal Task Management</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12">
          <div className="flex items-start gap-3 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <Zap className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Lightning Fast</h4>
              <p className="text-blue-100 text-sm">Organize your tasks in seconds</p>
            </div>
          </div>

          <div className="flex items-start gap-3 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Secure & Safe</h4>
              <p className="text-blue-100 text-sm">Your data is encrypted and protected</p>
            </div>
          </div>

          <div className="flex items-start gap-3 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
            <Smartphone className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Fully Responsive</h4>
              <p className="text-blue-100 text-sm">Works on all your devices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="relative z-10 pt-8 border-t border-white border-opacity-20">
        <p className="text-blue-100 text-sm font-medium">
          "Stay organized, boost productivity, achieve more with TaskFlow."
        </p>
        <p className="text-blue-200 text-xs mt-3">
          Join thousands of users managing their tasks efficiently.
        </p>
      </div>
    </div>
  )
}

export default HeroBanner
