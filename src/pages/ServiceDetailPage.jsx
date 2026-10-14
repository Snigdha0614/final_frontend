import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RatingStars } from '../components/RatingStars';
import { Modal } from '../components/Modal';
import {
  Clock,
  RefreshCw,
  ShieldCheck,
  Repeat,
  CheckCircle2,
  DollarSign,
  ArrowLeft,
  Send,
  Star,
  UserCheck
} from 'lucide-react';

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [ordering, setOrdering] = useState(false);

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Skill Exchange Form
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [cashCompensation, setCashCompensation] = useState('');
  const [payer, setPayer] = useState('NONE');
  const [exchangeTerms, setExchangeTerms] = useState('');

  const fetchServiceData = async () => {
    try {
      const data = await api.getServiceById(id);
      setService(data);
      setRequestedSkill(data.title);
      const revData = await api.getReviewsForService(id);
      setReviews(revData || []);
    } catch (err) {
      addToast('Failed to load service details: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  const handleConfirmOrder = async () => {
    if (!isAuthenticated) {
      addToast('Please log in to hire this service', 'info');
      navigate('/login');
      return;
    }

    setOrdering(true);
    try {
      const workspace = await api.orderServiceDirect(service.id);
      addToast('Order placed successfully! Escrow funds held.', 'success');
      setOrderModalOpen(false);
      navigate(`/workspace/${workspace.id}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setOrdering(false);
    }
  };

  const handleSendExchangeProposal = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in to propose a skill exchange', 'info');
      navigate('/login');
      return;
    }

    try {
      const hasCash = Number(cashCompensation) > 0;
      await api.createExchange({
        receiverId: service.seller.id,
        exchangeType: hasCash ? 'HYBRID_WITH_PAYMENT' : 'FREE_SKILL_EXCHANGE',
        offeredSkillTitle: offeredSkill,
        offeredSkillDescription: 'Proposed in exchange for ' + service.title,
        requestedSkillTitle: requestedSkill || service.title,
        cashCompensation: hasCash ? cashCompensation : 0,
        compensationPayer: hasCash ? payer : 'NONE',
        termsNote: exchangeTerms,
      });

      addToast('Skill Exchange proposal sent to ' + service.seller.fullName + '! 🤝', 'success');
      setExchangeModalOpen(false);
      setOfferedSkill('');
      setCashCompensation('');
      setExchangeTerms('');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in to leave a review', 'info');
      return;
    }
    if (!newComment.trim()) {
      addToast('Please write a comment', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.createReview({
        revieweeId: service.seller.id,
        serviceId: service.id,
        rating: newRating,
        comment: newComment,
      });
      addToast('Review submitted successfully!', 'success');
      setNewComment('');
      fetchServiceData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading service details...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Service Not Found</h2>
        <Link to="/services" className="text-emerald-600 font-semibold text-sm">
          Return to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link
        to="/services"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Left Column: Overview, Details, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100">
                {service.category}
              </span>
              <RatingStars rating={service.ratingAvg} count={service.reviewCount} size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {service.title}
            </h1>
          </div>

          {/* Service Image Banner */}
          <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200">
            <img
              src={service.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Service Description */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">About This Service</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>

            {service.tags && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Keywords &amp; Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">About the Specialist</h2>

            <div className="flex items-start gap-4">
              <img
                src={service.seller?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={service.seller?.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/freelancers/${service.seller?.id}`}
                    className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                  >
                    {service.seller?.fullName}
                  </Link>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs text-slate-600 font-medium">{service.seller?.title}</p>
                <p className="text-xs text-slate-400">{service.seller?.location || 'Remote'}</p>
              </div>
            </div>

            {service.seller?.bio && (
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {service.seller?.bio}
              </p>
            )}

            <div className="pt-2">
              <Link
                to={`/freelancers/${service.seller?.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                View full profile, certifications &amp; portfolio →
              </Link>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Customer Reviews</h2>
                <p className="text-xs text-slate-500">Feedback from verified completed contracts</p>
              </div>
              <RatingStars rating={service.ratingAvg} count={service.reviewCount} size="md" />
            </div>

            {/* Leave a review form */}
            {isAuthenticated && user?.id !== service.seller?.id && (
              <form onSubmit={handleSubmitReview} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Leave a Rating &amp; Review</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Your Rating:</span>
                  <RatingStars rating={newRating} interactive onRatingChange={setNewRating} size="md" />
                </div>
                <textarea
                  rows={2}
                  placeholder="Share details about your experience working with this specialist..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews recorded yet for this service.</p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.reviewer?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={rev.reviewer?.fullName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900">{rev.reviewer?.fullName}</span>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Checkout & Action Card */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fixed Package</span>
              <span className="text-3xl font-extrabold text-slate-900">
                ${Number(service.price).toFixed(2)}
              </span>
            </div>

            {/* Deliverables summary */}
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Estimated Delivery
                </span>
                <span className="font-bold text-slate-900">{service.deliveryDays} Days</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  Included Revisions
                </span>
                <span className="font-bold text-slate-900">{service.revisionsAllowed} Revisions</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Escrow Protection
                </span>
                <span className="font-bold text-emerald-600">Simulated Safe</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Hire Service (${Number(service.price).toFixed(2)})
              </button>

              <button
                onClick={() => setExchangeModalOpen(true)}
                className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold border border-purple-200 transition-colors flex items-center justify-center gap-2"
              >
                <Repeat className="w-4 h-4" />
                Propose Skill Barter ($0 Cash)
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              When you hire, funds move to Escrow. Freelancer is paid only when you approve final deliverables.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Order Confirmation Modal */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title="Confirm Service Order"
      >
        <div className="space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-900">{service.title}</h4>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Agreed Package Price:</span>
              <span className="font-bold text-slate-900">${Number(service.price).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Delivery Timeframe:</span>
              <span className="font-bold text-slate-900">{service.deliveryDays} Days</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2">
            <p>
              Your simulated wallet balance will be debited <strong>${Number(service.price).toFixed(2)}</strong> and placed into <strong>Escrow Protection</strong>.
            </p>
            <p>
              A collaborative workspace will be generated immediately with a Kanban task board, real-time chat, and deliverable review portal.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={ordering}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {ordering ? 'Placing Order...' : 'Confirm & Open Workspace'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Skill Exchange Proposal Modal */}
      <Modal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        title="Propose Skill Exchange"
      >
        <form onSubmit={handleSendExchangeProposal} className="space-y-4">
          <p className="text-xs text-slate-600">
            Offer a skill or service from your skillset in exchange for <strong>{service.seller?.fullName}'s</strong> {service.title}.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              What skill or deliverable will YOU provide? *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Modern React Frontend Implementation, Figma Design System, or Technical SEO Audit"
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              What do you want in return?
            </label>
            <input
              type="text"
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            />
          </div>

          {/* Optional cash compensation for hybrid barter */}
          <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5" /> Hybrid Cash Top-up (Optional)
              </span>
              <span className="text-[10px] text-purple-600">Balance value discrepancy</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  placeholder="0.00"
                  value={cashCompensation}
                  onChange={(e) => setCashCompensation(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Who pays cash?</label>
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white"
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
              Terms &amp; Notes
            </label>
            <textarea
              rows={3}
              placeholder="Describe scope, milestones, and deliverables for both sides..."
              value={exchangeTerms}
              onChange={(e) => setExchangeTerms(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setExchangeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Send Exchange Proposal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
