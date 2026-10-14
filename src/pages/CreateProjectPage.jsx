import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, PlusCircle, Briefcase, Repeat, DollarSign } from 'lucide-react';

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [budgetType, setBudgetType] = useState('FIXED_PRICE');
  const [fixedBudget, setFixedBudget] = useState('1500.00');
  const [budgetMin, setBudgetMin] = useState('1000');
  const [budgetMax, setBudgetMax] = useState('2500');
  const [deadline, setDeadline] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('React, Spring Boot, MySQL');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Web Development',
    'UI/UX Design',
    'Mobile Apps',
    'AI & Machine Learning',
    'Content & Copywriting',
    'Video & Animation',
    'DevOps & Cloud',
    'Consulting & Strategy'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in to post a project', 'info');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        category,
        description,
        budgetType,
        requiredSkills,
        deadline: deadline || undefined,
        fixedBudget: budgetType === 'FIXED_PRICE' ? parseFloat(fixedBudget) : undefined,
        budgetMin: budgetType === 'HOURLY' ? parseFloat(budgetMin) : undefined,
        budgetMax: budgetType === 'HOURLY' ? parseFloat(budgetMax) : undefined,
      };

      const project = await api.createProject(payload);
      addToast('Project posted successfully!', 'success');
      navigate(`/projects/${project.id}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Post a New Project
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Describe your project goals, required skills, and choose between cash payment or skill barter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Project Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Build an AI-Powered Customer Analytics Dashboard with Spring Boot & React"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Compensation Model *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setBudgetType('FIXED_PRICE')}
              className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex flex-col justify-between ${
                budgetType === 'FIXED_PRICE'
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-600 mb-1" />
              <span>Fixed Price ($)</span>
              <span className="text-[10px] text-slate-400 font-normal">Agreed milestone sum</span>
            </button>

            <button
              type="button"
              onClick={() => setBudgetType('HOURLY')}
              className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex flex-col justify-between ${
                budgetType === 'HOURLY'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-600 mb-1" />
              <span>Hourly Rate</span>
              <span className="text-[10px] text-slate-400 font-normal">Pay per logged hour</span>
            </button>

            <button
              type="button"
              onClick={() => setBudgetType('SKILL_EXCHANGE')}
              className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex flex-col justify-between ${
                budgetType === 'SKILL_EXCHANGE'
                  ? 'border-purple-500 bg-purple-50/50 text-purple-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Repeat className="w-4 h-4 text-purple-600 mb-1" />
              <span>Skill Barter</span>
              <span className="text-[10px] text-slate-400 font-normal">Trade service for service</span>
            </button>
          </div>
        </div>

        {/* Dynamic Budget fields based on type */}
        {budgetType === 'FIXED_PRICE' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Fixed Budget Amount ($ USD) *
            </label>
            <input
              type="number"
              required
              min="10"
              step="10"
              value={fixedBudget}
              onChange={(e) => setFixedBudget(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        )}

        {budgetType === 'HOURLY' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Min Hourly Rate ($/hr)
              </label>
              <input
                type="number"
                min="10"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Max Hourly Rate ($/hr)
              </label>
              <input
                type="number"
                min="10"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        )}

        {budgetType === 'SKILL_EXCHANGE' && (
          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed">
            <strong>Skill Barter Active: </strong> Freelancers applying to this project will propose reciprocal services or deliverables in trade for your project deliverables.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Spring Boot, MySQL, REST API"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Detailed Project Scope &amp; Specifications *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Outline all project requirements, deliverables, milestones, and preferred tech stack..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/projects"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Project'}
          </button>
        </div>
      </form>
    </div>
  );
};
