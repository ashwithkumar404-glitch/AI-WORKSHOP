import React from 'react';
import { Newsletter } from '@/lib/dbTypes';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { formatInIST, formatRelativeIST, isWithinRolling10DaysIST } from './dateUtils';
import { Calendar, User, ArrowRight, Sparkles, Archive } from 'lucide-react';

interface NewsletterCardProps {
  newsletter: Newsletter;
  onSelect: (newsletter: Newsletter) => void;
}

export const NewsletterCard: React.FC<NewsletterCardProps> = ({ newsletter, onSelect }) => {
  const isCurrent = isWithinRolling10DaysIST(newsletter.published_at);

  return (
    <Card hoverEffect className="flex flex-col justify-between h-full space-y-4 cursor-pointer" onClick={() => onSelect(newsletter)}>
      <div className="space-y-3">
        {/* Cover image thumbnail if present */}
        {newsletter.cover_image_url && (
          <div className="w-full h-44 rounded-xl overflow-hidden -mt-1 border border-slate-100">
            <img
              src={newsletter.cover_image_url}
              alt={newsletter.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Category & Date badge */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="teal" size="sm">
            {newsletter.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatRelativeIST(newsletter.published_at)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-campus-teal-700 transition-colors">
          {newsletter.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
          {newsletter.summary}
        </p>
      </div>

      {/* Footer info: author & current indicator */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[130px] font-medium">{newsletter.author_name}</span>
        </div>

        <div className="flex items-center gap-2">
          {isCurrent ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-campus-teal-700 bg-campus-teal-50 px-2 py-0.5 rounded border border-campus-teal-200">
              <Sparkles className="w-3 h-3 text-campus-teal-600" />
              10-Day Feed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Archive className="w-3 h-3 text-slate-400" />
              Archive
            </span>
          )}
          <span className="text-campus-teal-700 font-semibold flex items-center gap-0.5">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Card>
  );
};

