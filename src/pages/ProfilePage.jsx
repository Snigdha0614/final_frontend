import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  User,
  Plus,
  Trash2,
  Award,
  Briefcase,
  ExternalLink,
  Repeat,
  CheckCircle2,
  Save,
  MapPin,
  DollarSign
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [location, setLocation] = useState('');
  const [availableForTrade, setAvailableForTrade] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Skill modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  // Certification modal
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('2024');
  const [certUrl, setCertUrl] = useState('');

  // Portfolio modal
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [portTitle, setPortTitle] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portProjectUrl, setPortProjectUrl] = useState('');
  const [portImageUrl, setPortImageUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setTitle(user.title || '');
      setBio(user.bio || '');
      setHourlyRate(user.hourlyRate ? user.hourlyRate.toString() : '');
      setLocation(user.location || '');
      setAvailableForTrade(user.availableForTrade ?? true);
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateProfile({
        fullName,
        title,
        bio,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        location,
        availableForTrade,
        avatarUrl,
      });
      await refreshUser();
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await api.addSkill({ name: skillName, level: skillLevel });
      await refreshUser();
      setSkillModalOpen(false);
      setSkillName('');
      addToast('Skill added!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.deleteSkill(id);
      await refreshUser();
      addToast('Skill deleted', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      await api.addCertification({
        title: certTitle,
        issuer: certIssuer,
        issueYear: certYear,
        credentialUrl: certUrl,
      });
      await refreshUser();
      setCertModalOpen(false);
      setCertTitle('');
      setCertIssuer('');
      addToast('Certification added!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteCert = async (id) => {
    try {
      await api.deleteCertification(id);
      await refreshUser();
      addToast('Certification removed', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    try {
      await api.addPortfolioItem({
        title: portTitle,
        description: portDesc,
        projectUrl: portProjectUrl,
        imageUrl: portImageUrl,
      });
      await refreshUser();
      setPortfolioModalOpen(false);
      setPortTitle('');
      setPortDesc('');
      addToast('Portfolio item added!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeletePortfolio = async (id) => {
    try {
      await api.deletePortfolioItem(id);
      await refreshUser();
      addToast('Portfolio item removed', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Please sign in to view your profile settings.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile &amp; Credentials Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal brand, verified skills, certifications, and project portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Edit Info Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">Personal Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full-Stack Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate ($/hr)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  placeholder="e.g. 95.00"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Skill Barter Availability Toggle */}
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-900 block flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-purple-600" />
                  Skill Barter Availability
                </span>
                <span className="text-[11px] text-purple-700">
                  Allow other professionals to propose 1-to-1 zero-cash skill trades
                </span>
              </div>
              <input
                type="checkbox"
                checked={availableForTrade}
                onChange={(e) => setAvailableForTrade(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio &amp; Background</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Portfolio Management */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Portfolio Items</h3>
                <p className="text-xs text-slate-500">Showcase past client work and live links</p>
              </div>
              <button
                onClick={() => setPortfolioModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            {user.portfolioItems && user.portfolioItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.portfolioItems.map((item) => (
                  <div key={item.id} className="border border-slate-200 rounded-xl p-4 space-y-2 relative group">
                    <button
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Visit Link <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No portfolio items added yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Skills & Certifications */}
        <div className="space-y-8">
          {/* Skills Management */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Skills</h3>
              <button
                onClick={() => setSkillModalOpen(true)}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Add skill"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {user.skills && user.skills.length > 0 ? (
              <div className="space-y-2">
                {user.skills.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{s.name}</span>
                      <span className="text-[10px] text-slate-400 block">{s.level}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills added yet.</p>
            )}
          </div>

          {/* Certifications Management */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-500" /> Certifications
              </h3>
              <button
                onClick={() => setCertModalOpen(true)}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Add certification"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {user.certifications && user.certifications.length > 0 ? (
              <div className="space-y-2">
                {user.certifications.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5 relative group"
                  >
                    <button
                      onClick={() => handleDeleteCert(c.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <h5 className="font-bold text-slate-800 pr-5">{c.title}</h5>
                    <p className="text-[10px] text-slate-400">
                      {c.issuer} • {c.issueYear}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No certifications added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title="Add Skill"
      >
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Skill Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. React, Spring Boot, Figma, Python"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Proficiency Level</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSkillModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              Add Skill
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Certification Modal */}
      <Modal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title="Add Certification"
      >
        <form onSubmit={handleAddCert} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Certified Solutions Architect"
              value={certTitle}
              onChange={(e) => setCertTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issuer *</label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon Web Services"
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
              <input
                type="text"
                value={certYear}
                onChange={(e) => setCertYear(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Verification URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={certUrl}
              onChange={(e) => setCertUrl(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCertModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              Save Certification
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Portfolio Modal */}
      <Modal
        isOpen={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        title="Add Portfolio Project"
      >
        <form onSubmit={handleAddPortfolio} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Real-Time Analytics Dashboard"
              value={portTitle}
              onChange={(e) => setPortTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Tech stack, challenges solved, outcomes..."
              value={portDesc}
              onChange={(e) => setPortDesc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Live URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={portProjectUrl}
              onChange={(e) => setPortProjectUrl(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={portImageUrl}
              onChange={(e) => setPortImageUrl(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPortfolioModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              Save Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
