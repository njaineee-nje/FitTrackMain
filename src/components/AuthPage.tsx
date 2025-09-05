import React, { useState } from 'react';
import { Activity, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    onLogin();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Hero Image Section */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=1200)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Every mile<br />
            matters
          </h1>
          <p className="text-xl opacity-90 max-w-md">
            Join millions of athletes tracking their progress and reaching their goals on FitTrack.
          </p>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">FitTrack</span>
          </div>

          {/* Navigation Header */}
          <div className="hidden lg:flex items-center justify-between mb-8 text-sm">
            <div className="flex space-x-6">
              <span className="text-gray-600 hover:text-orange-600 cursor-pointer">Activities</span>
              <span className="text-gray-600 hover:text-orange-600 cursor-pointer">Features</span>
              <span className="text-gray-600 hover:text-orange-600 cursor-pointer">Maps</span>
              <span className="text-gray-600 hover:text-orange-600 cursor-pointer">Challenges</span>
            </div>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

          {/* Auth Form */}
          <div className="bg-gray-900 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-2 text-center">
              {isLogin ? 'Welcome Back' : 'Sign Up for Free'}
            </h2>
            <p className="text-gray-300 text-center mb-6 text-sm">
              {isLogin 
                ? 'Continue your fitness journey' 
                : 'Track your progress and reach goals. Join 100 million active people on FitTrack.'
              }
            </p>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isLogin ? 'Log In' : 'Sign Up'} With Google</span>
              </button>
              
              <button className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>{isLogin ? 'Log In' : 'Sign Up'} With Apple</span>
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            {!isLogin && (
              <p className="text-xs text-gray-400 text-center mt-4">
                By continuing, you are agreeing to our{' '}
                <a href="#" className="text-orange-400 hover:text-orange-300">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>.
              </p>
            )}

            <p className="text-center mt-6 text-sm">
              <span className="text-gray-400">
                {isLogin ? "Don't have an account?" : 'Already a Member?'}
              </span>{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <span className="hover:text-orange-600 cursor-pointer">Activities</span>
              <span className="hover:text-orange-600 cursor-pointer">Features</span>
              <span className="hover:text-orange-600 cursor-pointer">Maps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}