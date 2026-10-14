import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5.0, count, size = 'sm', interactive = false, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {stars.map((star) => (
          <Star
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${starSize} ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            } ${
              star <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
            }`}
          />
        ))}
      </div>
      {rating !== undefined && (
        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{Number(rating).toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-slate-400 dark:text-slate-500 text-xs">({count})</span>
      )}
    </div>
  );
};
