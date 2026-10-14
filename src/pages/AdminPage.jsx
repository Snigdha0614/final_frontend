import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  ShieldCheck,
  Users,
  Layers,
  Briefcase,
  Repeat,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink
} from 'lucide-react';

export const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, services, disputes
  const [loading, setLoading] = useState(true);

  // Dispute resolution modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('RESOLVED_REFUND_CLIENT');
  const [adminNotes, setAdminNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsData, usersData, servicesData, disputesData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminServices(),
        api.getAllDisputes()
      ]);
      setStats(statsData);
      setUsers(usersData || []);
      setServices(servicesData || []);
      setDisputes(disputesData || []);
    } catch (err) {
      addToast('Failed to load admin metrics: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const handleToggleUser = async (userId) => {
    try {
      const updated = await api.toggleUserStatus(userId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      addToast(`User ${updated.enabled ? 'activated' : 'deactivated'}`, 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleService = async (serviceId) => {
    try {
      const updated = await api.toggleServiceStatus(serviceId);
      setServices((prev) => prev.map((s) => (s.id === serviceId ? updated : s)));
      addToast(`Service ${updated.active ? 'published' : 'hidden'}`, 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    setResolving(true);
    try {
      await api.resolveDispute(selectedDispute.id, {
        status: resolutionStatus,
        adminNotes,
      });
      addToast('Dispute resolved and financial settlement executed!', 'success');
      setResolveModalOpen(false);
      fetchAdminData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setResolving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-xs text-slate-500">
          Please log in as an administrator (e.g. use the Quick Demo Switcher 'Admin' button at the top).
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading Admin Metrics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
            <ShieldCheck className="w-4 h-4" /> Platform Control Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
        </div>

        <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1.5 rounded-xl border border-purple-200">
          Admin: {user.email}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Services</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalServices || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Projects</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalProjects || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Exchanges</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalExchanges || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Workspaces</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalWorkspaces || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Open Disputes</span>
          <div className="text-2xl font-extrabold text-rose-600">{stats?.openDisputes || 0}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Users Directory ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'services'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Service Listings ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'disputes'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Disputes Tribunal ({disputes.length})
        </button>
      </div>

      {/* TAB 1: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.fullName}</span>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      <span className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded font-mono">
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-500">{u.location || 'Remote'}</td>

                    <td className="py-4 px-4 font-bold text-slate-800">
                      ★ {Number(u.ratingAvg || 5).toFixed(1)} ({u.reviewCount || 0})
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          u.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          u.enabled
                            ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                            : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'
                        }`}
                      >
                        {u.enabled ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Services Management */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3.5 px-6">Service Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Seller</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">
                      {srv.title}
                    </td>

                    <td className="py-4 px-4 text-slate-600">{srv.category}</td>

                    <td className="py-4 px-4 font-medium text-slate-800">
                      {srv.seller?.fullName}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900">
                      ${Number(srv.price).toFixed(2)}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          srv.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {srv.active ? 'Visible' : 'Hidden'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleService(srv.id)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        {srv.active ? 'Hide' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Disputes Tribunal */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          {disputes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 text-xs">
              No disputes filed on the platform. All contracts in good standing!
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((disp) => (
                <div
                  key={disp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          Dispute #{disp.id}: {disp.reason}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            disp.status === 'OPEN'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {disp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Initiated by <strong>{disp.initiator?.fullName}</strong> against{' '}
                        <strong>{disp.respondent?.fullName}</strong> in Workspace #{disp.workspace?.id}
                      </p>
                    </div>

                    <Link
                      to={`/workspace/${disp.workspace?.id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                    >
                      Inspect Workspace <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                    {disp.description}
                  </p>

                  {disp.adminResolutionNotes && (
                    <div className="p-3 bg-purple-50 text-purple-900 rounded-xl text-xs border border-purple-100">
                      <strong>Admin Resolution: </strong> {disp.adminResolutionNotes}
                    </div>
                  )}

                  {disp.status === 'OPEN' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedDispute(disp);
                          setResolveModalOpen(true);
                        }}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition-all"
                      >
                        Resolve Dispute &amp; Settle Escrow
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resolve Dispute Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Admin Dispute Tribunal Resolution"
      >
        <form onSubmit={handleResolveDispute} className="space-y-4">
          <p className="text-xs text-slate-600">
            Select the binding verdict for Dispute #{selectedDispute?.id}. Escrow balances will be executed automatically.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Verdict *</label>
            <select
              value={resolutionStatus}
              onChange={(e) => setResolutionStatus(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="RESOLVED_REFUND_CLIENT">
                Refund Client (Escrow Returned to Client Wallet)
              </option>
              <option value="RESOLVED_PAY_FREELANCER">
                Pay Freelancer (Escrow Released to Freelancer Wallet)
              </option>
              <option value="DISMISSED">Dismiss Dispute (Resume Workspace)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Rationale &amp; Audit Notes *
            </label>
            <textarea
              required
              rows={4}
              placeholder="State the findings based on messages, milestones, and deliverable review..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resolving}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              {resolving ? 'Executing...' : 'Execute Resolution'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
