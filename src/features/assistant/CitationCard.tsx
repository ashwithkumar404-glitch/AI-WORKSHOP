import React from 'react';
import { GroundedCitation } from './aiProvider';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface CitationCardProps {
  citation: GroundedCitation;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation }) => {
  return (
    <div className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all text-xs space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold text-campus-navy-900 truncate">
          <BookOpen className="w-3.5 h-3.5 text-campus-teal-600 shrink-0" />
          <span className="truncate">{citation.title}</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-campus-teal-700 bg-campus-teal-50 px-1.5 py-0.5 rounded border border-campus-teal-200 shrink-0">
          {citation.category}
        </span>
      </div>

      <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2 italic">
        "{citation.snippet}"
      </p>

      {citation.sourceUrl && (
        <a
          href={citation.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-campus-teal-700 hover:text-campus-teal-800 font-semibold mt-1 hover:underline"
        >
          <span>Official Institutional Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};

