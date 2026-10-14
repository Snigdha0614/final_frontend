import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RatingStars } from '../components/RatingStars';
import { ServiceCard } from '../components/ServiceCard';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  Repeat,
  CheckCircle2,
  Award,
  Briefcase,
  ExternalLink,
  Layers,
  ArrowLeft,
  DollarSign
} from 'lucide-react';

export const FreelancerProfilePage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [freelancer, setFreelancer] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Trade modal
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [cashCompensation, setCashCompensation] = useState('0');
  const [payer, setPayer] = useState('NONE');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [flData, srvData, revData] = await Promise.all([
          api.getFreelancerById(id),
          api.getServices({ sellerId: id }),
          api.getReviewsForUser(id)
        ]);
        setFreelancer(flData);
        setServices(srvData || []);
        setReviews(revData || []);
        setRequestedSkill(flData?.title || 'Specialist Work');
      } catch (err) {
        addToast('Failed to load profile: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  const handleSendTrade = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in to propose a skill trade', 'info');
      return;
    }

    try {
      const hasCash = parseFloat(cashCompensation) > 0;
      await api.createExchange({
        receiverId: freelancer.id,
        exchangeType: hasCash ? 'HYBRID_WITH_PAYMENT' : 'FREE_SKILL_EXCHANGE',
        offeredSkillTitle: offeredSkill,
        offeredSkillDescription: 'Trade proposed to ' + freelancer.fullName,
        requestedSkillTitle: requestedSkill,
        cashCompensation: hasCash ? parseFloat(cashCompensation) : 0,
        compensationPayer: hasCash ? payer : 'NONE',
        termsNote: notes,
      });

      addToast('Trade proposal successfully sent! 🤝', 'success');
      setTradeModalOpen(false);
      setOfferedSkill('');
      setNotes('');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading profile...
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Freelancer Not Found</h2>
        <Link to="/freelancers" className="text-emerald-600 font-semibold text-sm">
          Return to Talent
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        to="/freelancers"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Freelancers
      </Link>

      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="relative shrink-0">
              <img
                src={freelancer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={freelancer.fullName}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
              />
              {freelancer.availableForTrade && (
                <span
                  className="absolute -bottom-1.5 -right-1.5 bg-purple-600 text-white p-1.5 rounded-xl shadow"
                  title="Available for Skill Barter"
                >
                  <Repeat className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{freelancer.fullName}</h1>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {freelancer.availableForTrade && (
                  <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Repeat className="w-3 h-3" /> Skill Barter Active
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-700">{freelancer.title}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                {freelancer.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {freelancer.location}
                  </span>
                )}
                <span>•</span>
                <RatingStars rating={freelancer.ratingAvg || 5.0} count={freelancer.reviewCount || 0} size="sm" />
                <span>•</span>
                <span className="font-extrabold text-slate-900">
                  ${freelancer.hourlyRate ? `${Number(freelancer.hourlyRate).toFixed(2)}/hr` : 'Negotiable'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {freelancer.availableForTrade && (
              <button
                onClick={() => setTradeModalOpen(true)}
                className="flex-1 md:flex-initial px-5 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold border border-purple-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Repeat className="w-4 h-4" />
                Propose Skill Trade
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('services-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 md:flex-initial px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" />
              Hire Specialist
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Bio, Portfolio, Services */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">About</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {freelancer.bio || 'Independent specialist available for projects, ongoing contracts, and skill exchanges.'}
            </p>
          </div>

          {/* Portfolio Items */}
          {freelancer.portfolioItems && freelancer.portfolioItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Portfolio Showcase
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freelancer.portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                  >
                    {item.imageUrl && (
                      <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      {item.projectUrl && (
                        <a
                          href={item.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 pt-1"
                        >
                          View Project Live <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Listed */}
          <div id="services-section" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Services Offered ({services.length})
            </h2>

            {services.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                No active standalone services currently listed by this freelancer.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((srv) => (
                  <ServiceCard key={srv.id} service={srv} />
                ))}
              </div>
            )}
          </div>

          {/* Client Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">
              Verified Client Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews recorded yet.</p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.reviewer?.fullName}</span>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Skills & Certifications */}
        <div className="space-y-8">
          {/* Skills Tag Cloud */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Skills &amp; Expertise</h3>
            {freelancer.skills && freelancer.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-100 flex items-center gap-1.5"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-100/60 px-1.5 py-0.2 rounded font-normal">
                      {skill.level}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No skills added yet.</p>
            )}
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Certifications &amp; Credentials
            </h3>
            {freelancer.certifications && freelancer.certifications.length > 0 ? (
              <div className="space-y-3">
                {freelancer.certifications.map((cert) => (
                  <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <h4 className="font-bold text-slate-900">{cert.title}</h4>
                    <p className="text-slate-500 mt-0.5">
                      {cert.issuer} • {cert.issueYear}
                    </p>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-semibold inline-flex items-center gap-1 mt-1 hover:underline"
                      >
                        Verify Credential <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No certifications listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Trade Proposal Modal */}
      <Modal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        title={`Propose Skill Barter to ${freelancer.fullName}`}
      >
        <form onSubmit={handleSendTrade} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Skill or Deliverable YOU Will Provide *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. React & Spring Boot Development, SEO Strategy"
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deliverable Requested from {freelancer.fullName} *
            </label>
            <input
              type="text"
              required
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 space-y-2">
            <span className="text-[11px] font-bold text-purple-900 block">
              Hybrid Cash Top-Up (Optional)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                step="5"
                placeholder="Amount ($)"
                value={cashCompensation}
                onChange={(e) => setCashCompensation(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white"
              />
              <select
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white"
              >
                <option value="NONE">No Cash ($0)</option>
                <option value="INITIATOR">I will pay top-up</option>
                <option value="RECEIVER">They should pay top-up</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notes &amp; Timeline
            </label>
            <textarea
              rows={3}
              placeholder="Describe scope, milestones, and deliverables for both sides..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setTradeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
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
