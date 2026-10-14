import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, DollarSign, Calendar, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export const ExchangeCard = ({ exchange }) => {
  const isHybrid = exchange.exchangeType === 'HYBRID_WITH_PAYMENT';
  const hasCash = exchange.cashCompensation && Number(exchange.cashCompensation) > 0;

  const statusColors = {
    PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
    COUNTERED: 'bg-blue-50 text-blue-800 border-blue-200',
    ACCEPTED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    IN_PROGRESS: 'bg-purple-50 text-purple-800 border-purple-200',
    COMPLETED: 'bg-slate-100 text-slate-800 border-slate-300',
    REJECTED: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
                isHybrid ? 'bg-amber-100 text-amber-900 border border-amber-200/60' : 'bg-purple-100 text-purple-900 border border-purple-200/60'
              }`}
            >
              <Repeat className="w-3.5 h-3.5 text-purple-700" />
              {isHybrid ? 'Hybrid + Cash Top-up' : '1:1 Pure Skill Barter'}
            </span>

            {hasCash && (
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-200/60 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-700" />
                +${Number(exchange.cashCompensation).toFixed(2)} Top-up
              </span>
            )}
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              statusColors[exchange.status] || 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {exchange.status}
          </span>
        </div>

        {/* 2-Way Exchange Visual Display */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Side A: Offered */}
            <div className="md:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                Offered by {exchange.initiator?.fullName}
              </span>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {exchange.offeredSkillTitle}
              </p>
            </div>

            {/* Middle Switch Icon */}
            <div className="flex justify-center md:col-span-1">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:rotate-180 transition-transform duration-500">
                <Repeat className="w-4 h-4" />
              </div>
            </div>

            {/* Side B: Requested */}
            <div className="md:col-span-2 text-left md:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                Requested from {exchange.receiver?.fullName}
              </span>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {exchange.requestedSkillTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Terms note */}
        {exchange.termsNote && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            <strong className="text-slate-800">Proposal terms: </strong>
            {exchange.termsNote}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>Deadline: {exchange.deadline || 'Flexible timeline'}</span>
        </div>

        <Link
          to={`/exchanges/${exchange.id}`}
          className="px-4 py-2 bg-slate-900 hover:bg-purple-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          View Exchange
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
