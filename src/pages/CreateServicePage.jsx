import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, PlusCircle, Sparkles, Layers } from 'lucide-react';

export const CreateServicePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('150.00');
  const [deliveryDays, setDeliveryDays] = useState('7');
  const [revisionsAllowed, setRevisionsAllowed] = useState('3');
  const [tags, setTags] = useState('React, Tailwind, Node.js');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600');
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
      addToast('Please sign in to publish a service', 'info');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.createService({
        title,
        category,
        description,
        price: parseFloat(price),
        deliveryDays: parseInt(deliveryDays, 10),
        revisionsAllowed: parseInt(revisionsAllowed, 10),
        tags,
        imageUrl,
      });

      addToast('Service listed successfully!', 'success');
      navigate(`/services/${created.id}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        to="/services"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Freelance Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Package and monetize your expertise for clients worldwide or open it up for skill barters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Service Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. I will design a modern SaaS Dashboard UI in Figma with auto-layout"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Price ($ USD) *
            </label>
            <input
              type="number"
              required
              min="5"
              step="5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Estimated Delivery (Days) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Revisions Included *
            </label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={revisionsAllowed}
              onChange={(e) => setRevisionsAllowed(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Cover Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g. React, Tailwind, Spring Boot, MySQL"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Full Description &amp; Scope of Deliverables *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Describe exactly what client gets, milestones, technical prerequisites, and outcomes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/services"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : 'Publish Service'}
          </button>
        </div>
      </form>
    </div>
  );
};
