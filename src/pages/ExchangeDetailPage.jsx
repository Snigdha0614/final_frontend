import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  Repeat,
  DollarSign,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ExchangeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [exchange, setExchange] = useState(null);
  const [counterOffers, setCounterOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Counteroffer modal
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [counterOfferedSkill, setCounterOfferedSkill] = useState('');
  const [counterRequestedSkill, setCounterRequestedSkill] = useState('');
  const [counterCashCompensation, setCounterCashCompensation] = useState('0');
  const [counterCompensationPayer, setCounterCompensationPayer] = useState('NONE');
  const [counterNote, setCounterNote] = useState('');
  const [submittingCounter, setSubmittingCounter] = useState(false);

  const fetchExchangeData = async () => {
    try {
      const data = await api.getExchangeById(id);
      setExchange(data);
      setCounterOfferedSkill(data.requestedSkillTitle || '');
      setCounterRequestedSkill(data.offeredSkillTitle || '');

      const counters = await api.getCounterOffers(id);
      setCounterOffers(counters || []);
    } catch (err) {
      addToast('Failed to load exchange: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeData();
  }, [id]);

  const handleAccept = async () => {
    try {
      const workspace = await api.acceptExchange(exchange.id);
      addToast('Skill exchange accepted! Workspace initialized 🎉', 'success');
      navigate(`/workspace/${workspace.id}`);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleReject = async () => {
    try {
      await api.rejectExchange(exchange.id);
      addToast('Skill exchange declined', 'info');
      fetchExchangeData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleComplete = async () => {
    try {
      await api.completeExchange(exchange.id);
      addToast('Skill exchange marked as completed! Escrow settled.', 'success');
      fetchExchangeData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSendCounterOffer = async (e) => {
    e.preventDefault();
    setSubmittingCounter(true);
    try {
      await api.submitCounterOffer(exchange.id, {
        counterOfferedSkill,
        counterRequestedSkill,
        counterCashCompensation: parseFloat(counterCashCompensation) || 0,
        counterCompensationPayer,
        note: counterNote,
      });

      addToast('Counteroffer submitted to partner!', 'success');
      setCounterModalOpen(false);
      fetchExchangeData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingCounter(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading exchange details...
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Exchange Not Found</h2>
        <Link to="/exchanges" className="text-purple-600 font-semibold text-sm">
          Return to Exchanges
        </Link>
      </div>
    );
  }

  const isPartyA = user?.id === exchange.initiator?.id;
  const isPartyB = user?.id === exchange.receiver?.id;
  const isParticipant = isPartyA || isPartyB;
  const isHybrid = exchange.exchangeType === 'HYBRID_WITH_PAYMENT';
  const hasCash = exchange.cashCompensation && Number(exchange.cashCompensation) > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        to="/exchanges"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exchanges
      </Link>

      {/* Main Exchange Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${
                isHybrid ? 'bg-amber-100 text-amber-900' : 'bg-purple-100 text-purple-900'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              {isHybrid ? 'Hybrid Skill Exchange + Cash' : '1:1 Pure Skill Barter'}
            </span>

            {hasCash && (
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                ${Number(exchange.cashCompensation).toFixed(2)} Top-Up ({exchange.compensationPayer} pays)
              </span>
            )}
          </div>

          <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
            Status: {exchange.status}
          </span>
        </div>

        {/* 2-Way Interactive Barter Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative">
          {/* Party A */}
          <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={exchange.initiator?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={exchange.initiator?.fullName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-200"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                  Initiator
                </span>
                <Link
                  to={`/freelancers/${exchange.initiator?.id}`}
                  className="text-base font-bold text-slate-900 hover:text-purple-600"
                >
                  {exchange.initiator?.fullName}
                </Link>
                <p className="text-xs text-slate-500">{exchange.initiator?.title}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-100">
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-1">
                Offered Deliverable
              </span>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {exchange.offeredSkillTitle}
              </p>
              {exchange.offeredSkillDescription && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {exchange.offeredSkillDescription}
                </p>
              )}
            </div>
          </div>

          {/* Party B */}
          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={exchange.receiver?.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
                alt={exchange.receiver?.fullName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-200"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Receiver
                </span>
                <Link
                  to={`/freelancers/${exchange.receiver?.id}`}
                  className="text-base font-bold text-slate-900 hover:text-emerald-600"
                >
                  {exchange.receiver?.fullName}
                </Link>
                <p className="text-xs text-slate-500">{exchange.receiver?.title}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Requested Deliverable
              </span>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {exchange.requestedSkillTitle}
              </p>
              {exchange.requestedSkillDescription && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {exchange.requestedSkillDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Terms note */}
        {exchange.termsNote && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1 text-xs">
            <span className="font-bold text-slate-700">Agreed Terms &amp; Scope:</span>
            <p className="text-slate-600 leading-relaxed">{exchange.termsNote}</p>
          </div>
        )}

        {/* Action Controls for Participants */}
        {isParticipant && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Target: {exchange.deadline || 'Flexible'}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* If workspace exists, show direct button */}
              {exchange.workspaceId && (
                <Link
                  to={`/workspace/${exchange.workspaceId}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  Open Workspace <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* If pending or countered, receiver/partner can accept, counter, or decline */}
              {(exchange.status === 'PENDING' || exchange.status === 'COUNTERED') && (
                <>
                  <button
                    onClick={() => setCounterModalOpen(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Submit Counteroffer
                  </button>

                  <button
                    onClick={handleReject}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 transition-colors"
                  >
                    Decline
                  </button>

                  <button
                    onClick={handleAccept}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Accept Trade Agreement
                  </button>
                </>
              )}

              {exchange.status === 'ACCEPTED' && !exchange.workspaceId && (
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Negotiation & Counteroffers Trace */}
      {counterOffers.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            Counteroffer Negotiation History ({counterOffers.length})
          </h3>

          <div className="space-y-3 divide-y divide-slate-100">
            {counterOffers.map((c) => (
              <div key={c.id} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Proposer: {c.proposer?.fullName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-slate-600">
                  Counter Terms: <strong>{c.counterOfferedSkill}</strong> in exchange for <strong>{c.counterRequestedSkill}</strong>
                  {c.counterCashCompensation > 0 && ` (+ $${c.counterCashCompensation} top-up)`}
                </p>
                {c.note && <p className="text-slate-500 italic">"{c.note}"</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Counteroffer Modal */}
      <Modal
        isOpen={counterModalOpen}
        onClose={() => setCounterModalOpen(false)}
        title="Submit Counteroffer"
      >
        <form onSubmit={handleSendCounterOffer} className="space-y-4">
          <p className="text-xs text-slate-600">
            Suggest adjusted deliverables or different cash compensation to find mutual alignment.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Counter Offered Deliverable *
            </label>
            <input
              type="text"
              required
              value={counterOfferedSkill}
              onChange={(e) => setCounterOfferedSkill(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Counter Requested Deliverable *
            </label>
            <input
              type="text"
              required
              value={counterRequestedSkill}
              onChange={(e) => setCounterRequestedSkill(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Top-Up Amount ($)</label>
              <input
                type="number"
                min="0"
                value={counterCashCompensation}
                onChange={(e) => setCounterCashCompensation(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Payer</label>
              <select
                value={counterCompensationPayer}
                onChange={(e) => setCounterCompensationPayer(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white"
              >
                <option value="NONE">No Cash ($0)</option>
                <option value="INITIATOR">Initiator pays</option>
                <option value="RECEIVER">Receiver pays</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Counteroffer Note
            </label>
            <textarea
              rows={3}
              placeholder="Explain rationale for revised terms..."
              value={counterNote}
              onChange={(e) => setCounterNote(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCounterModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingCounter}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {submittingCounter ? 'Submitting...' : 'Send Counteroffer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
