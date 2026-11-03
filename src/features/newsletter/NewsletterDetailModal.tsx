import React from 'react';
import { Newsletter } from '@/lib/dbTypes';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { formatInIST, isWithinRolling10DaysIST } from './dateUtils';
import { Calendar, User, Tag, Sparkles, Archive } from 'lucide-react';

interface NewsletterDetailModalProps {
  newsletter: Newsletter | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterDetailModal: React.FC<NewsletterDetailModalProps> = ({
  newsletter,
  isOpen,
  onClose,
}) => {
  if (!newsletter) return null;

  const isCurrent = isWithinRolling10DaysIST(newsletter.published_at);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={newsletter.title}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Cover image if available */}
        {newsletter.cover_image_url && (
          <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200">
            <img
              src={newsletter.cover_image_url}
              alt={newsletter.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category & Status badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="teal" size="md">
              {newsletter.category}
            </Badge>
            {isCurrent ? (
              <Badge variant="success" size="sm">
                <Sparkles className="w-3 h-3" />
                Latest 10-Day Feed (Current)
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm">
                <Archive className="w-3 h-3" />
                Archived Issue
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatInIST(newsletter.published_at || newsletter.created_at)}</span>
          </div>
        </div>

        {/* Author info */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-campus-navy-800 text-campus-teal-400 font-bold text-xs flex items-center justify-center">
            {newsletter.author_name.charAt(0)}
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900">{newsletter.author_name}</p>
            <p className="text-slate-500">Official SCEM Publication Desk</p>
          </div>
        </div>

        {/* Summary Callout */}
        <div className="p-4 bg-campus-teal-50/50 border-l-4 border-campus-teal-500 rounded-r-xl text-slate-700 text-sm italic font-medium leading-relaxed">
          {newsletter.summary}
        </div>

        {/* Full Article Content */}
        <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-3 font-normal">
          {newsletter.content}
        </div>

        {/* Tags */}
        {newsletter.tags && newsletter.tags.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Indexed Tags:</span>
            {newsletter.tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

