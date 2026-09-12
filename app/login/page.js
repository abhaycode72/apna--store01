'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, CheckCircle2, Eye, EyeOff, Phone, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../src/store/useAuthStore';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      if (isLogin) {
        // SUPABASE LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        // Success
        setIsSuccess(true);
        login({
          name: data.user.user_metadata?.name || email.split('@')[0],
          email: data.user.email,
          phone: data.user.user_metadata?.phone || '',
          id: data.user.id
        });

        // Check if ADMIN
        const isAdmin = data.user.email === 'admin@apnastore.com' || data.user.email === 'mayank@apnastore.com';
        
        setTimeout(() => {
          if (isAdmin) {
            localStorage.setItem('isAdmin', 'true');
            router.push('/admin');
          } else {
            router.push('/');
          }
        }, 1500);

      } else {
        // SUPABASE SIGN UP
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone
            }
          }
        });
        
        if (error) throw error;
        
        setIsSuccess(true);
        login({
          name: name || email.split('@')[0],
          email: email,
          phone: phone,
          id: data.user?.id
        });
        
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
      
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding / Illustration (Hidden on mobile) */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-purple-600 to-indigo-800 p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10">
            <h1 onClick={() => router.push('/')} className="text-4xl font-black tracking-tight cursor-pointer hover:text-purple-100 transition">
              apna store01
            </h1>
            <p className="mt-4 text-purple-200 font-medium text-lg leading-relaxed max-w-sm">
              Get groceries delivered to your door in 10 minutes. 
            </p>
          </div>

          <div className="relative z-10 bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-emerald-400 flex items-center justify-center text-emerald-900 font-bold text-xs">A</div>
                <div className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-orange-400 flex items-center justify-center text-orange-900 font-bold text-xs">B</div>
                <div className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-pink-400 flex items-center justify-center text-pink-900 font-bold text-xs">C</div>
              </div>
              <p className="text-sm font-semibold">Join 10k+ users</p>
            </div>
            <p className="text-sm text-purple-200">
              "Best grocery delivery app in town! Super fast and reliable."
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 flex flex-col justify-center relative">
          
          <button onClick={() => router.push('/')} className="md:hidden text-2xl font-black text-purple-700 mb-8 tracking-tight">
            apna store01
          </button>

          <div className="max-w-md w-full mx-auto">
            
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-gray-500 font-medium">
                {isLogin 
                  ? 'Enter your details to access your account.' 
                  : 'Get started with Apna Store today.'}
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-8 relative">
              <div 
                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${
                  isLogin ? 'left-1' : 'left-[calc(50%+3px)]'
                }`}
              />
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-bold rounded-lg relative z-10 transition-colors ${
                  isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-bold rounded-lg relative z-10 transition-colors ${
                  !isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Logged in successfully!' : 'Account created!'}
                </h3>
                <p className="text-gray-500 text-sm">Redirecting to homepage...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                    <AlertCircle size={18} />
                    {errorMsg}
                  </div>
                )}
                
                {/* Name Field (Only for Sign Up) */}
                <div className={`space-y-1.5 transition-all duration-300 ${isLogin ? 'hidden opacity-0' : 'block opacity-100'}`}>
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Phone Field (Only for Sign Up) */}
                <div className={`space-y-1.5 transition-all duration-300 ${isLogin ? 'hidden opacity-0' : 'block opacity-100'}`}>
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required={!isLogin}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700">Password</label>
                    {isLogin && (
                      <a href="#" className="text-sm font-bold text-purple-600 hover:text-purple-800 hover:underline transition">Forgot password?</a>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Only for Sign Up) */}
                <div className={`space-y-1.5 transition-all duration-300 ${isLogin ? 'hidden opacity-0' : 'block opacity-100'}`}>
                  <label className="text-sm font-bold text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••" 
                      required={!isLogin}
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:active:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-sm font-medium text-gray-500">
              By continuing, you agree to Apna Store's{' '}
              <a href="#" className="text-gray-900 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-gray-900 hover:underline">Privacy Policy</a>.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
