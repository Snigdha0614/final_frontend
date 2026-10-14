import React from 'react';
import { Link } from 'react-router-dom';
import { RatingStars } from './RatingStars';
import { Clock, RefreshCw, Zap, Bookmark, CheckCircle, ArrowUpRight } from 'lucide-react';

export const ServiceCard = ({ service, onWishlistToggle, isSaved }) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full">
      {/* Service Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={service.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-xs font-semibold flex items-center gap-1">
            View service details <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-sm border border-slate-100">
          {service.category}
        </span>

        {/* Wishlist toggle */}
        {onWishlistToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onWishlistToggle(service.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500 shadow-sm'
            }`}
            title="Save to wishlist"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller details */}
          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={service.seller?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={service.seller?.fullName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {service.seller?.fullName}
                </span>
                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
              </div>
              <span className="text-[11px] text-slate-400 block truncate">
                {service.seller?.title || 'Verified Specialist'}
              </span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/services/${service.id}`}>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
              {service.title}
            </h3>
          </Link>

          {/* Deliverables snippet */}
          <div className="flex items-center gap-3 mt-3 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {service.deliveryDays}d delivery
            </span>
            <span className="flex items-center gap-1 font-medium">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              {service.revisionsAllowed} revisions
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <RatingStars rating={service.ratingAvg || 5.0} count={service.reviewCount || 0} size="sm" />

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Starting at</span>
            <span className="text-base font-extrabold text-emerald-600">
              ${Number(service.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
