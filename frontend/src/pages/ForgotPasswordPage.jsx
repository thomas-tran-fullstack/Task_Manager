import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, Loader } from 'lucide-react'
import { authService } from '@/services/authService'
import { useToast } from '@/hooks/useToast'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const { showMessage } = useToast()
  
  const [step, setStep] = useState(1) // 1: Request, 2: Verify OTP, 3: Reset
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Bước 1: Yêu cầu OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!email) {
        showMessage('Vui lòng nhập email', 'error')
        return
      }

      const response = await authService.forgotPassword(email)
      
      if (response.success) {
        showMessage('OTP đã được gửi đến email của bạn', 'success')
        setStep(2)
      } else {
        showMessage(response.message || 'Lỗi khi gửi OTP', 'error')
      }
    } catch (error) {
      showMessage(error.message || 'Lỗi gửi OTP', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Bước 2: Xác nhận OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!otp) {
        showMessage('Vui lòng nhập mã OTP', 'error')
        return
      }

      const response = await authService.verifyOTP(email, otp, 'password_reset')
      
      if (response.success) {
        showMessage('Xác nhận OTP thành công', 'success')
        setStep(3)
      } else {
        showMessage(response.message || 'Mã OTP không hợp lệ', 'error')
      }
    } catch (error) {
      showMessage(error.message || 'Lỗi xác thực OTP', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Bước 3: Reset mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!newPassword || !confirmPassword) {
        showMessage('Vui lòng nhập mật khẩu', 'error')
        return
      }

      if (newPassword !== confirmPassword) {
        showMessage('Mật khẩu xác nhận không khớp', 'error')
        return
      }

      if (newPassword.length < 6) {
        showMessage('Mật khẩu phải ít nhất 6 ký tự', 'error')
        return
      }

      const response = await authService.resetPassword(email, otp, newPassword)
      
      if (response.success) {
        showMessage('Reset mật khẩu thành công! Đang chuyển hướng...', 'success')
        setTimeout(() => navigate('/auth'), 2000)
      } else {
        showMessage(response.message || 'Lỗi reset mật khẩu', 'error')
      }
    } catch (error) {
      showMessage(error.message || 'Lỗi reset mật khẩu', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center animate-slideInDown">
          <button
            onClick={() => navigate('/auth')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu</h1>
          <p className="text-gray-600">Reset mật khẩu của bạn</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slideInUp">
          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            <div className={`flex-1 h-1 mx-1 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-1 mx-1 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-1 mx-1 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>

          {/* Step 1: Request OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email của bạn
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                Gửi mã OTP
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5 animate-fadeIn">
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm">Mã OTP đã được gửi đến</p>
                <p className="text-gray-900 font-semibold">{email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã xác nhận
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-center text-2xl letter-spacing tracking-widest font-mono"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                Xác nhận
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
              >
                Quay lại
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                Reset mật khẩu
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
