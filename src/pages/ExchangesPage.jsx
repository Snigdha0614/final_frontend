import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ExchangeCard } from '../components/ExchangeCard';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Repeat,
  PlusCircle,
  Search,
  Filter,
  Sparkles,
  DollarSign,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export const ExchangesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [exchanges, setExchanges] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, MY, PURE, HYBRID
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New Exchange Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [offeredSkillTitle, setOfferedSkillTitle] = useState('');
  const [offeredSkillDescription, setOfferedSkillDescription] = useState('');
  const [requestedSkillTitle, setRequestedSkillTitle] = useState('');
  const [requestedSkillDescription, setRequestedSkillDescription] = useState('');
  const [cashCompensation, setCashCompensation] = useState('0');
  const [compensationPayer, setCompensationPayer] = useState('NONE');
  const [termsNote, setTermsNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchExchanges = async () => {
    setLoading(true);
    try {
      let data = [];
      if (activeTab === 'MY' && isAuthenticated) {
        data = await api.getMyExchanges();
      } else {
        const typeFilter =
          activeTab === 'PURE'
            ? 'FREE_SKILL_EXCHANGE'
            : activeTab === 'HYBRID'
            ? 'HYBRID_WITH_PAYMENT'
            : undefined;

        data = await api.getExchanges({
          type: typeFilter,
          search: searchTerm || undefined,
        });
      }
      setExchanges(data || []);
    } catch (err) {
      addToast('Failed to load exchanges: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, [activeTab]);

  useEffect(() => {
    api.getFreelancers().then((list) => {
      setFreelancers(list || []);
      if (list && list.length > 0) {
        setReceiverId(list[0].id.toString());
      }
    }).catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExchanges();
  };

  const handleCreateExchange = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in to propose a skill exchange', 'info');
      return;
    }

    setSubmitting(true);
    try {
      const hasCash = parseFloat(cashCompensation) > 0;
      await api.createExchange({
        receiverId: parseInt(receiverId, 10),
        exchangeType: hasCash ? 'HYBRID_WITH_PAYMENT' : 'FREE_SKILL_EXCHANGE',
        offeredSkillTitle,
        offeredSkillDescription,
        requestedSkillTitle,
        requestedSkillDescription,
        cashCompensation: hasCash ? parseFloat(cashCompensation) : 0,
        compensationPayer: hasCash ? compensationPayer : 'NONE',
        termsNote,
      });

      addToast('Skill exchange proposal successfully sent! 🤝', 'success');
      setModalOpen(false);
      // Reset form
      setOfferedSkillTitle('');
      setOfferedSkillDescription('');
      setRequestedSkillTitle('');
      setRequestedSkillDescription('');
      setCashCompensation('0');
      setTermsNote('');
      fetchExchanges();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
            <Repeat className="w-4 h-4" />
            Trade Skills • Save Cash
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Skill Exchange Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Barter services 1-to-1, negotiate counteroffers, or bridge value differences with partial cash top-ups.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 hover:shadow-purple-600/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Propose Skill Exchange
        </button>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Exchanges
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('MY')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'MY'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                My Exchanges
              </button>
            )}
            <button
              onClick={() => setActiveTab('PURE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'PURE'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Pure Barter (1:1 $0)
            </button>
            <button
              onClick={() => setActiveTab('HYBRID')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'HYBRID'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Hybrid (+ Cash)
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-72">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Exchanges Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-60 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : exchanges.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Repeat className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Skill Exchanges Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Propose a new trade to any specialist and barter your abilities!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exchanges.map((exchange) => (
            <ExchangeCard key={exchange.id} exchange={exchange} />
          ))}
        </div>
      )}

      {/* Propose Exchange Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Propose a Skill Exchange"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateExchange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Specialist to Trade With *
            </label>
            <select
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              {freelancers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.fullName} — {f.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Skill YOU Will Provide *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Full-Stack API in Spring Boot"
                value={offeredSkillTitle}
                onChange={(e) => setOfferedSkillTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Skill You Want in Return *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Figma Design System & Prototype"
                value={requestedSkillTitle}
                onChange={(e) => setRequestedSkillTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 space-y-3">
            <span className="text-xs font-bold text-purple-900 block">
              Hybrid Cash Top-Up (Optional)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={cashCompensation}
                  onChange={(e) => setCashCompensation(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Who pays top-up?</label>
                <select
                  value={compensationPayer}
                  onChange={(e) => setCompensationPayer(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white text-slate-900"
                >
                  <option value="NONE">No Cash ($0 Barter)</option>
                  <option value="INITIATOR">I will pay top-up cash</option>
                  <option value="RECEIVER">They should pay top-up cash</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Agreement Terms &amp; Scope
            </label>
            <textarea
              rows={3}
              placeholder="Outline expectations, deliverables, and estimated hours..."
              value={termsNote}
              onChange={(e) => setTermsNote(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? 'Sending Proposal...' : 'Send Trade Proposal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
