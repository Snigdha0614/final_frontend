import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  CreditCard,
  Building,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const WalletPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deposit modal
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('250.00');
  const [depositMethod, setDepositMethod] = useState('Mock Visa •••• 4242');
  const [depositing, setDepositing] = useState(false);

  // Withdraw modal
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('100.00');
  const [bankAccount, setBankAccount] = useState('Chase Bank •••• 8819');
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchWalletData = async () => {
    try {
      const [wData, txData] = await Promise.all([
        api.getWallet(),
        api.getTransactions()
      ]);
      setWallet(wData);
      setTransactions(txData || []);
    } catch (err) {
      addToast('Failed to load wallet: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setDepositing(true);
    try {
      await api.depositFunds({
        amount: parseFloat(depositAmount),
        paymentMethod: depositMethod,
      });
      addToast(`Deposited $${parseFloat(depositAmount).toFixed(2)} to wallet!`, 'success');
      setDepositModalOpen(false);
      fetchWalletData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDepositing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawing(true);
    try {
      await api.withdrawFunds({
        amount: parseFloat(withdrawAmount),
        bankAccount,
      });
      addToast(`Payout of $${parseFloat(withdrawAmount).toFixed(2)} initiated!`, 'success');
      setWithdrawModalOpen(false);
      fetchWalletData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading Wallet &amp; Ledger...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simulated Escrow &amp; Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Safe payments held in escrow protection during freelance contracts and hybrid trades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            Withdraw
          </button>

          <button
            onClick={() => setDepositModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Add Funds
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-8 text-white space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available Wallet Balance
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="text-4xl font-extrabold tracking-tight">
            ${wallet ? Number(wallet.balance).toFixed(2) : '0.00'}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Funds ready for immediate deployment on freelance contracts or withdrawal.
          </p>
        </div>

        {/* Escrow Balance */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950 p-8 text-white space-y-4 shadow-xl border border-emerald-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Active Escrow Protection
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="text-4xl font-extrabold tracking-tight text-emerald-400">
            ${wallet ? Number(wallet.escrowBalance).toFixed(2) : '0.00'}
          </div>

          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Secured funds held in trust until you approve final deliverables in your workspaces.
          </p>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History &amp; Ledger</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete chronological record of simulated deposits, withdrawals, and escrow transitions
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
            {transactions.length} Records
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                  <th className="pb-3">Type &amp; Description</th>
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => {
                  const isCredit =
                    tx.type === 'DEPOSIT' ||
                    tx.type === 'SERVICE_PAYMENT' ||
                    tx.type === 'REFUND';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white block">{tx.description}</span>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {tx.referenceId || '-'}
                      </td>

                      <td className="py-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}
                      </td>

                      <td className="py-3.5 text-right font-extrabold text-sm">
                        <span className={isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                          {isCredit ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        title="Add Simulated Funds"
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Select a payment method to simulate adding funds into your platform wallet.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Deposit Amount ($) *</label>
            <input
              type="number"
              required
              min="10"
              step="10"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-base font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Simulated Gateway</label>
            <select
              value={depositMethod}
              onChange={(e) => setDepositMethod(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="Mock Visa •••• 4242">Mock Visa •••• 4242 (Instant)</option>
              <option value="Mock PayPal Express">Mock PayPal Express</option>
              <option value="Simulated Wire Transfer">Simulated Wire Transfer</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setDepositModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={depositing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              {depositing ? 'Processing...' : 'Confirm Deposit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title="Withdraw Funds"
      >
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payout Amount ($) *</label>
            <input
              type="number"
              required
              min="10"
              step="10"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-base font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Account</label>
            <input
              type="text"
              required
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setWithdrawModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={withdrawing}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              {withdrawing ? 'Processing...' : 'Confirm Withdrawal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
