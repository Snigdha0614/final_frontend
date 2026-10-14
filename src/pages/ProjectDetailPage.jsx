import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  Calendar,
  DollarSign,
  Repeat,
  Users,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Send,
  Clock,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proposal modal
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('14');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [submittingProposal, setSubmittingProposal] = useState(false);

  const fetchProjectData = async () => {
    try {
      const data = await api.getProjectById(id);
      setProject(data);
      if (data.fixedBudget) setBidAmount(data.fixedBudget.toString());

      if (isAuthenticated) {
        try {
          const propData = await api.getProjectProposals(id);
          setProposals(propData || []);
        } catch {
          // May be unauthorized if non-owner
        }
      }
    } catch (err) {
      addToast('Failed to load project: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id, isAuthenticated]);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in to submit a proposal', 'info');
      navigate('/login');
      return;
    }

    setSubmittingProposal(true);
    try {
      await api.submitProposal(project.id, {
        coverLetter,
        bidAmount: bidAmount ? parseFloat(bidAmount) : undefined,
        deliveryDays: parseInt(deliveryDays, 10),
        offeredSkill,
      });

      addToast('Proposal submitted successfully! 🚀', 'success');
      setProposalModalOpen(false);
      setCoverLetter('');
      fetchProjectData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      const workspace = await api.acceptProposal(project.id, proposalId);
      addToast('Proposal accepted! Escrow held and Workspace created 🎉', 'success');
      navigate(`/workspace/${workspace.id}`);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await api.rejectProposal(project.id, proposalId);
      addToast('Proposal rejected', 'info');
      fetchProjectData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Project Not Found</h2>
        <Link to="/projects" className="text-blue-600 font-semibold text-sm">
          Return to Projects
        </Link>
      </div>
    );
  }

  const isClientOwner = isAuthenticated && user?.id === project.client?.id;
  const isSkillExchange = project.budgetType === 'SKILL_EXCHANGE';
  const skills = project.requiredSkills ? project.requiredSkills.split(',').map((s) => s.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-3 py-1 rounded-lg">
                {project.category}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                  project.status === 'OPEN'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {project.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {project.title}
            </h1>
          </div>

          {/* Project Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">Project Description &amp; Scope</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>

            {/* Required Skills */}
            {skills.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Required Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Proposals Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Submitted Proposals</h2>
                <p className="text-xs text-slate-500">
                  {isClientOwner
                    ? 'Review candidates and accept the best proposal to start work'
                    : 'Candidate proposals submitted for this project'}
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {proposals.length} Proposals
              </span>
            </div>

            {proposals.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No proposals submitted yet. Be the first to apply!
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {proposals.map((prop) => (
                  <div key={prop.id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.freelancer?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={prop.freelancer?.fullName}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <Link
                            to={`/freelancers/${prop.freelancer?.id}`}
                            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {prop.freelancer?.fullName}
                          </Link>
                          <p className="text-[11px] text-slate-400">{prop.freelancer?.title}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 block">
                          {prop.bidAmount ? `$${Number(prop.bidAmount).toFixed(2)}` : 'Trade Offer'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {prop.deliveryDays ? `${prop.deliveryDays} Days` : ''}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {prop.coverLetter}
                    </p>

                    {prop.offeredSkill && (
                      <div className="text-xs bg-purple-50 text-purple-800 p-2.5 rounded-lg border border-purple-100 flex items-center gap-1.5 font-medium">
                        <Repeat className="w-3.5 h-3.5" />
                        Offered Skill Swap: {prop.offeredSkill}
                      </div>
                    )}

                    {/* Client Owner Action buttons */}
                    {isClientOwner && project.status === 'OPEN' && (
                      <div className="flex items-center justify-end gap-2 pt-2">
                        {prop.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleRejectProposal(prop.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptProposal(prop.id)}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                            >
                              Accept &amp; Open Workspace
                            </button>
                          </>
                        ) : (
                          <span
                            className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${
                              prop.status === 'ACCEPTED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {prop.status}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Card */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isSkillExchange ? 'Budget Model' : 'Client Budget'}
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {isSkillExchange
                  ? 'Skill Barter'
                  : project.fixedBudget
                  ? `$${Number(project.fixedBudget).toFixed(2)}`
                  : project.budgetMin && project.budgetMax
                  ? `$${project.budgetMin} - $${project.budgetMax}`
                  : 'Negotiable'}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Target Deadline
                </span>
                <span className="font-bold text-slate-900">
                  {project.deadline || 'Flexible'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <Users className="w-4 h-4 text-slate-400" />
                  Total Proposals
                </span>
                <span className="font-bold text-slate-900">{project.proposalCount || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Escrow Guarantee
                </span>
                <span className="font-bold text-emerald-600">Simulated Safe</span>
              </div>
            </div>

            {/* Apply button */}
            {!isClientOwner && project.status === 'OPEN' && (
              <button
                onClick={() => setProposalModalOpen(true)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Proposal
              </button>
            )}

            {/* Client Info snippet */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src={project.client?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                alt={project.client?.fullName}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {project.client?.fullName}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  Client • {project.client?.location || 'Remote'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Proposal Modal */}
      <Modal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        title="Submit Project Proposal"
      >
        <form onSubmit={handleSubmitProposal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cover Letter / Technical Approach *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explain how you will deliver this project, relevant experience, and architecture..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Bid ($ USD)
              </label>
              <input
                type="number"
                min="5"
                placeholder="0.00"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Delivery (Days)
              </label>
              <input
                type="number"
                min="1"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {isSkillExchange && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Offered Skill in Trade *
              </label>
              <input
                type="text"
                required
                placeholder="What skill will you provide in trade?"
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setProposalModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingProposal}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              {submittingProposal ? 'Submitting...' : 'Send Proposal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
