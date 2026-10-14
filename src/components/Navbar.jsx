import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { api } from '../services/api';
import {
  Briefcase,
  Layers,
  Repeat,
  Users,
  Wallet,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [walletBalance, setWalletBalance] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      api.getWallet()
        .then((w) => setWalletBalance(w?.balance || 0))
        .catch(() => {});
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
      isActive
        ? 'text-emerald-600 bg-emerald-50/80 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                Talent<span className="text-emerald-600">Trade</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Platform
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
              Freelance &amp; Skill Exchange
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/services" className={navClass}>
            <Layers className="w-4 h-4 text-emerald-600" />
            Services
          </NavLink>
          <NavLink to="/projects" className={navClass}>
            <Briefcase className="w-4 h-4 text-blue-600" />
            Projects
          </NavLink>
          <NavLink to="/exchanges" className={navClass}>
            <Repeat className="w-4 h-4 text-purple-600" />
            Skill Exchange
            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 font-bold rounded-full">
              Barter
            </span>
          </NavLink>
          <NavLink to="/freelancers" className={navClass}>
            <Users className="w-4 h-4 text-amber-600" />
            Talent
          </NavLink>
        </nav>

        {/* Right Action Icons / Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* Wallet Pill */}
              <Link
                to="/wallet"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 transition-colors border border-slate-200/70"
                title="Simulated Wallet"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>${walletBalance !== null ? Number(walletBalance).toFixed(2) : '...'}</span>
              </Link>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Post Project / Offer Service quick actions */}
              <Link
                to={user?.role === 'ROLE_CLIENT' ? '/projects/create' : '/services/create'}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:shadow"
              >
                <PlusCircle className="w-4 h-4" />
                {user?.role === 'ROLE_CLIENT' ? 'Post Project' : 'Offer Service'}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        {user.role.replace('ROLE_', '')}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard &amp; Workspaces
                    </Link>

                    <Link
                      to="/wallet"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <Wallet className="w-4 h-4" />
                      Simulated Wallet
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <User className="w-4 h-4" />
                      My Profile &amp; Skills
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Control Center
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <NavLink
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={navClass}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            Services
          </NavLink>
          <NavLink
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className={navClass}
          >
            <Briefcase className="w-4 h-4 text-blue-600" />
            Projects
          </NavLink>
          <NavLink
            to="/exchanges"
            onClick={() => setMobileMenuOpen(false)}
            className={navClass}
          >
            <Repeat className="w-4 h-4 text-purple-600" />
            Skill Exchange
          </NavLink>
          <NavLink
            to="/freelancers"
            onClick={() => setMobileMenuOpen(false)}
            className={navClass}
          >
            <Users className="w-4 h-4 text-amber-600" />
            Talent
          </NavLink>
        </div>
      )}
    </header>
  );
};
