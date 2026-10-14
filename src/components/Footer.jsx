import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Shield, Heart, CheckCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Repeat className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Talent<span className="text-emerald-400">Trade</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier hybrid freelance &amp; skill barter platform. Hire world-class talent with cash, trade services 1-to-1, or combine both with partial escrow payment.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Simulated Escrow Protection Active</span>
            </div>
          </div>

          {/* Discovery Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Browse Freelance Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-emerald-400 transition-colors">
                  Client Projects &amp; Bids
                </Link>
              </li>
              <li>
                <Link to="/exchanges" className="hover:text-emerald-400 transition-colors">
                  Skill Exchange Engine
                </Link>
              </li>
              <li>
                <Link to="/freelancers" className="hover:text-emerald-400 transition-colors">
                  Verified Freelancers
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Core Ecosystem</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/wallet" className="hover:text-emerald-400 transition-colors">
                  Simulated Escrow Wallet
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Workspace Task Boards
                </Link>
              </li>
              <li>
                <Link to="/exchanges" className="hover:text-emerald-400 transition-colors">
                  Free Skill Barter System
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors">
                  Admin Platform Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Production Architecture note */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Architecture</h4>
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Single Main URL Routing</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Frontend running on React + Vite (<code className="text-emerald-300">5173</code>) with backend proxy to Spring Boot &amp; MySQL.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-700/40">
                Java 26 • Spring Boot 3.3.5 • Hibernate • MySQL 8.0 • JWT
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TalentTrade Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for modern freelancers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
