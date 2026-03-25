import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import HeroBanner from '@/components/Common/HeroBanner'
import { Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react'
import { authService } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

const AuthPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showMessage } = useToast()
  
  const [activeTab, setActiveTab] = useState('login') // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Verify that email and password are filled
      if (!loginData.email || !loginData.password) {
        showMessage('Vui lòng nhập email và mật khẩu', 'error')
        return
      }

      const response = await authService.login(loginData.email, loginData.password)
      
      if (response.success) {
        login(response.user, response.token)
        showMessage('Đăng nhập thành công', 'success')
        navigate('/tasks')
      } else {
        showMessage(response.message || 'Đăng nhập thất bại', 'error')
      }
    } catch (error) {
      const errorMessage = error.message || 'Lỗi đăng nhập'
      showMessage(errorMessage, 'error')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true)
    try {
      const response = await authService.googleLogin(credentialResponse.credential)
      
      if (response.success) {
        login(response.user, response.token)
        showMessage('Đăng nhập bằng Google thành công', 'success')
        navigate('/tasks')
      } else {
        showMessage(response.message || 'Google login failed', 'error')
      }
    } catch (error) {
      showMessage(error.message || 'Google login error', 'error')
      console.error('Google login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    showMessage('Google login failed', 'error')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Validate inputs
      if (!registerData.name || !registerData.email || !registerData.password) {
        showMessage('Vui lòng điền đầy đủ thông tin', 'error')
        return
      }

      if (registerData.password !== registerData.confirmPassword) {
        showMessage('Mật khẩu xác nhận không khớp', 'error')
        return
      }

      if (registerData.password.length < 6) {
        showMessage('Mật khẩu phải ít nhất 6 ký tự', 'error')
        return
      }

      // Call register API
      const response = await authService.register(registerData.email, registerData.password, registerData.name)
      
      if (response.success) {
        showMessage('Đăng ký thành công, vui lòng đăng nhập', 'success')
        setActiveTab('login')
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' })
      } else {
        showMessage(response.message || 'Đăng ký thất bại', 'error')
      }
    } catch (error) {
      const errorMessage = error.message || 'Lỗi đăng ký'
      showMessage(errorMessage, 'error')
      console.error('Register error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slideInUp">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b-2 border-gray-100">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'register'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                Đăng nhập
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">hoặc</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleError}
                />
              </div>

              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
              >
                Quên mật khẩu?
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người dùng
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                Đăng ký
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">hoặc</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleError}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
