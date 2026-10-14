import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { FreelancerCard } from '../components/FreelancerCard';
import { ExchangeCard } from '../components/ExchangeCard';
import {
  Repeat,
  Shield,
  Zap,
  Star,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const HomePage = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [servicesRes, freelancersRes, exchangesRes] = await Promise.all([
          api.getServices(),
          api.getFreelancers(),
          api.getExchanges()
        ]);
        setFeaturedServices(Array.isArray(servicesRes) ? servicesRes.slice(0, 3) : []);
        setFreelancers(Array.isArray(freelancersRes) ? freelancersRes.slice(0, 3) : []);
        setExchanges(Array.isArray(exchangesRes) ? exchangesRes.slice(0, 2) : []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-lg shadow-slate-900/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>The Next Generation Freelance &amp; Skill Barter Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Trade Skills. Hire Talent. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
              Build Together.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            TalentTrade is the modern freelance ecosystem where you can hire with cash, exchange services 1-to-1 without spending a dollar, or combine both with partial payments.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/services"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Explore Services
            </Link>

            <Link
              to="/exchanges"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/15 transition-all flex items-center gap-2"
            >
              <Repeat className="w-4 h-4 text-purple-400" />
              Skill Exchange Hub
            </Link>

            <Link
              to="/projects"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold border border-slate-200/90 shadow-sm transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              Browse Projects
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8">
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Paid Freelancing</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Hire verified experts with safe simulated escrow balances.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">1:1 Skill Barter</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Exchange your developer skills for designer or SEO skills for $0.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hybrid Top-up</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Combine services with partial cash compensation to balance value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Layers className="w-4 h-4" />
              Popular Freelance Services
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Get High-Impact Work Done
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 group"
          >
            Browse all services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Skill Exchange Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                <Repeat className="w-3.5 h-3.5" />
                <span>Zero Cash Required</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Skill Exchange: Don’t spend cash. Trade what you’re good at.
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Need a designer for your startup MVP? Propose a trade with your backend engineering. Recipient can accept, decline, or counteroffer with modified terms. Both parties get dedicated workspace collaboration with milestone sign-off.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/exchanges"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  View Active Trades
                </Link>
                <Link
                  to="/freelancers"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-all border border-white/10"
                >
                  Find Trade Partners
                </Link>
              </div>
            </div>

            {/* Live Exchange cards preview */}
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                Recently Proposed Exchanges
              </span>
              {exchanges.map((ex) => (
                <div key={ex.id} className="text-slate-900">
                  <ExchangeCard exchange={ex} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Verified Freelancers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Users className="w-4 h-4" />
              Top Rated Talent
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Collaborate with Vetted Specialists
            </h2>
          </div>
          <Link
            to="/freelancers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 group"
          >
            Discover all freelancers
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((f) => (
            <FreelancerCard key={f.id} freelancer={f} />
          ))}
        </div>
      </section>
    </div>
  );
};
