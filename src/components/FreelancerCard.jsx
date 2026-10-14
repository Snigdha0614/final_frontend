import React from 'react';
import { Link } from 'react-router-dom';
import { RatingStars } from './RatingStars';
import { Repeat, MapPin, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export const FreelancerCard = ({ freelancer, onProposeTrade }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={freelancer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={freelancer.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-emerald-500/30 transition-all"
            />
            {freelancer.availableForTrade && (
              <span
                className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1 rounded-full shadow-sm"
                title="Available for Skill Barter ($0 Cash)"
              >
                <Repeat className="w-3 h-3" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link to={`/freelancers/${freelancer.id}`}>
                <h3 className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors truncate">
                  {freelancer.fullName}
                </h3>
              </Link>
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>

            <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
              {freelancer.title || 'Independent Specialist'}
            </p>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              {freelancer.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {freelancer.location}
                </span>
              )}
              {freelancer.location && <span>•</span>}
              <RatingStars rating={freelancer.ratingAvg || 5.0} count={freelancer.reviewCount || 0} size="sm" />
            </div>
          </div>
        </div>

        {/* Bio */}
        {freelancer.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {freelancer.bio}
          </p>
        )}

        {/* Skills */}
        {freelancer.skills && freelancer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {freelancer.skills.slice(0, 4).map((skill) => (
              <span
                key={skill.id}
                className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl border border-emerald-100/80"
              >
                {skill.name}
              </span>
            ))}
            {freelancer.skills.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium self-center">
                +{freelancer.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer & Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Rate</span>
          <span className="text-sm font-extrabold text-slate-900">
            {freelancer.hourlyRate ? `$${Number(freelancer.hourlyRate).toFixed(2)}/hr` : 'Negotiable'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {freelancer.availableForTrade && onProposeTrade && (
            <button
              onClick={() => onProposeTrade(freelancer)}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold border border-purple-200 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Repeat className="w-3.5 h-3.5" />
              Barter
            </button>
          )}

          <Link
            to={`/freelancers/${freelancer.id}`}
            className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
