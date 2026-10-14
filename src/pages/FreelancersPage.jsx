import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FreelancerCard } from '../components/FreelancerCard';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Users, Search, Repeat, Filter, Sparkles } from 'lucide-react';

export const FreelancersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [freelancers, setFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Quick barter modal
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [targetFreelancer, setTargetFreelancer] = useState(null);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [cashCompensation, setCashCompensation] = useState('0');
  const [payer, setPayer] = useState('NONE');
  const [notes, setNotes] = useState('');

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const data = await api.getFreelancers(searchTerm);
      setFreelancers(data || []);
    } catch (err) {
      addToast('Failed to load freelancers: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  const handleOpenTrade = (fl) => {
    setTargetFreelancer(fl);
    setRequestedSkill(fl.title || 'Specialized Services');
    setTradeModalOpen(true);
  };

  const handleSubmitTrade = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please sign in to propose a skill exchange', 'info');
      return;
    }

    try {
      const hasCash = parseFloat(cashCompensation) > 0;
      await api.createExchange({
        receiverId: targetFreelancer.id,
        exchangeType: hasCash ? 'HYBRID_WITH_PAYMENT' : 'FREE_SKILL_EXCHANGE',
        offeredSkillTitle: offeredSkill,
        offeredSkillDescription: 'Proposed trade with ' + targetFreelancer.fullName,
        requestedSkillTitle: requestedSkill,
        cashCompensation: hasCash ? parseFloat(cashCompensation) : 0,
        compensationPayer: hasCash ? payer : 'NONE',
        termsNote: notes,
      });

      addToast('Trade proposal sent to ' + targetFreelancer.fullName + '! 🤝', 'success');
      setTradeModalOpen(false);
      setOfferedSkill('');
      setNotes('');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Discover Top Freelancers &amp; Talent
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hire elite independent specialists or connect for zero-dollar skill exchanges.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search freelancers by name, expertise, or technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Freelancers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : freelancers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Freelancers Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms to discover more talent.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((fl) => (
            <FreelancerCard
              key={fl.id}
              freelancer={fl}
              onProposeTrade={handleOpenTrade}
            />
          ))}
        </div>
      )}

      {/* Quick Trade Proposal Modal */}
      <Modal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        title={targetFreelancer ? `Propose Skill Trade with ${targetFreelancer.fullName}` : 'Propose Skill Trade'}
      >
        <form onSubmit={handleSubmitTrade} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Skill YOU Will Provide in Return *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Full-Stack API Integration or UI Redesign"
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Skill You Are Requesting From Them *
            </label>
            <input
              type="text"
              required
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-xl border border-purple-100 dark:border-purple-800/60 space-y-3">
            <span className="text-xs font-bold text-purple-900 dark:text-purple-300 block">
              Hybrid Cash Top-Up (Optional)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={cashCompensation}
                  onChange={(e) => setCashCompensation(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Who pays cash?</label>
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="NONE">No Cash ($0 Barter)</option>
                  <option value="INITIATOR">I will pay top-up cash</option>
                  <option value="RECEIVER">They should pay top-up cash</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Exchange Terms &amp; Scope Note
            </label>
            <textarea
              rows={3}
              placeholder="Outline deliverables, timelines, and milestones..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setTradeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Send Trade Proposal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
