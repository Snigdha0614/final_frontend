import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Repeat, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Code, Palette } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      addToast('Welcome back to TalentTrade!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Repeat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to TalentTrade
          </h2>
          <p className="text-xs text-slate-500">
            Access your workspaces, manage services, and barter skills.
          </p>
        </div>

        {/* 1-Click Demo Buttons */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Quick Fill Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@talenttrade.com', 'password123')}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('sarah.client@talenttrade.com', 'password123')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" /> Client (Sarah)
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('alex.dev@talenttrade.com', 'password123')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" /> Dev (Alex)
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('elena.design@talenttrade.com', 'password123')}
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold border border-pink-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5" /> Designer (Elena)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
};
