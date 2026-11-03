import React from 'react';
import { Bot, User, ShieldAlert, Sparkles, BookCheck } from 'lucide-react';
import { CitationCard } from './CitationCard';
import { GroundedCitation } from './aiProvider';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: GroundedCitation[];
  grounded?: boolean;
  modelUsed?: string;
  timestamp: string;
}

interface ChatMessageBubbleProps {
  message: ChatMessageItem;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-campus-navy-900 text-campus-teal-400 flex items-center justify-center shrink-0 shadow-sm border border-campus-navy-800">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
            isUser
              ? 'bg-campus-navy-800 text-white rounded-tr-none'
              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
          }`}
        >
          <div className="whitespace-pre-line font-normal">{message.content}</div>
        </div>

        {/* Citations if assistant provided any */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="p-3 bg-campus-teal-50/40 border border-campus-teal-200/60 rounded-xl space-y-2 mt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-campus-teal-900">
              <span className="flex items-center gap-1.5">
                <BookCheck className="w-3.5 h-3.5 text-campus-teal-600" />
                Verified Citations & Sources ({message.citations.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">SCEM Grounded Knowledge</span>
            </div>
            <div className="space-y-2">
              {message.citations.map((c) => (
                <CitationCard key={c.id} citation={c} />
              ))}
            </div>
          </div>
        )}

        {/* Grounding & Verification Metadata */}
        {!isUser && (
          <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-campus-teal-500" />
              {message.modelUsed || 'SCEM Knowledge Engine'}
            </span>
            <span>•</span>
            <span>{message.timestamp}</span>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-campus-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

