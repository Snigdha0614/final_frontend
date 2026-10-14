import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  LayoutDashboard,
  Wallet,
  Repeat,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlusCircle
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [wallet, setWallet] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [wData, wsData, exData] = await Promise.all([
          api.getWallet(),
          api.getUserWorkspaces(),
          api.getMyExchanges()
        ]);
        setWallet(wData);
        setWorkspaces(wsData || []);
        setExchanges(exData || []);
      } catch (err) {
        addToast('Failed to load dashboard: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading Dashboard...
      </div>
    );
  }

  const activeWorkspaces = workspaces.filter((w) => w.status !== 'COMPLETED' && w.status !== 'CANCELLED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            Welcome back, {user?.fullName}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Workspace &amp; Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/wallet"
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Manage Wallet
          </Link>

          <Link
            to={user?.role === 'ROLE_CLIENT' ? '/projects/create' : '/services/create'}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            {user?.role === 'ROLE_CLIENT' ? 'Post Project' : 'List Service'}
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Wallet Balance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ${wallet ? Number(wallet.balance).toFixed(2) : '0.00'}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant simulated funds</p>
        </div>

        {/* Escrow Balance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Escrow Protection
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ${wallet ? Number(wallet.escrowBalance).toFixed(2) : '0.00'}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Locked in ongoing contracts</p>
        </div>

        {/* Active Workspaces */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Workspaces
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {activeWorkspaces.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Live milestones &amp; chats</p>
        </div>

        {/* Skill Exchanges */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Skill Exchanges
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {exchanges.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Barters &amp; hybrid trades</p>
        </div>
      </div>

      {/* Active Workspaces List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Active Project Workspaces</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Collaborate on tasks, chat with partners, and inspect deliverable submissions
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
            {workspaces.length} Total
          </span>
        </div>

        {workspaces.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No workspaces yet. Order a service, accept a project proposal, or start a skill exchange!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/80 transition-all space-y-4 bg-slate-50/50 dark:bg-slate-950/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                      {ws.workspaceType?.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                      {ws.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ws.status === 'COMPLETED'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                    }`}
                  >
                    {ws.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ws.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${ws.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {ws.escrowAmount > 0 ? `$${Number(ws.escrowAmount).toFixed(2)} in Escrow` : 'Barter Agreement'}
                  </span>

                  <Link
                    to={`/workspace/${ws.id}`}
                    className="px-3.5 py-1.5 bg-slate-900 dark:bg-white hover:bg-emerald-600 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    Enter Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Exchanges Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Skill Barter Inquiries</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proposals, negotiations, and active trade agreements
            </p>
          </div>
          <Link
            to="/exchanges"
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            Explore Exchange Hub →
          </Link>
        </div>

        {exchanges.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No skill exchange inquiries yet. Propose a skill barter from any freelancer's profile!
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {exchanges.map((ex) => (
              <div key={ex.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {ex.offeredSkillTitle} ⇄ {ex.requestedSkillTitle}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                      {ex.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    With {ex.initiator?.id === user?.id ? ex.receiver?.fullName : ex.initiator?.fullName}
                  </p>
                </div>

                <Link
                  to={`/exchanges/${ex.id}`}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
                >
                  View Trade Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
