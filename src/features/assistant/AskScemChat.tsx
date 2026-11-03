import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { askScemAssistant } from './aiProvider';
import { ChatMessageBubble, ChatMessageItem } from './ChatMessageBubble';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  HelpCircle, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { formatInIST } from '@/features/newsletter/dateUtils';

const PROMPT_SUGGESTIONS = [
  'What is the mandatory attendance requirement under VTU autonomous rules?',
  'How does the 10-point SGPA and CGPA grading scale work at SCEM?',
  'What are the campus placement eligibility rules and dream tier criteria?',
  'What facilities and timings exist for campus hostels and the central library?'
];

const INITIAL_GREETING: ChatMessageItem = {
  id: 'msg-init',
  role: 'assistant',
  content: `Namaskara! I am **Ask SCEM AI**, your campus-grounded academic assistant for **Sahyadri College of Engineering & Management, Mangaluru**.

I answer questions strictly using official SCEM regulations, academic notices, course evaluation schemes, and verified campus documents.

How may I assist your academic journey today?`,
  grounded: true,
  modelUsed: 'SCEM Grounded Core',
  timestamp: formatInIST(new Date(), true),
};

export const AskScemChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    const saved = localStorage.getItem(`campuspilot_chat_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : [INITIAL_GREETING];
  });
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`campuspilot_chat_${user.id}`, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, user?.id]);

  const handleSend = async (queryText?: string) => {
    const query = (queryText || inputValue).trim();
    if (!query || isProcessing) return;

    setInputValue('');
    const userMsg: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: formatInIST(new Date(), true),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await askScemAssistant(query);
      const botMsg: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        citations: response.citations,
        grounded: response.grounded,
        modelUsed: response.modelUsed,
        timestamp: formatInIST(new Date(), true),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errorMsg: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'An unexpected processing error occurred while retrieving institutional documents. Please try again or consult the academic dean.',
        grounded: false,
        modelUsed: 'SCEM Error Handler',
        timestamp: formatInIST(new Date(), true),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_GREETING]);
    if (user?.id) {
      localStorage.removeItem(`campuspilot_chat_${user.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-campus-navy-900 rounded-3xl p-5 sm:p-6 text-white border border-campus-navy-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-campus-teal-600 to-campus-teal-400 flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">Ask SCEM AI</h1>
              <Badge variant="teal" size="sm">Grounded</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Verified answers retrieved directly from approved SCEM knowledge documents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="text-xs bg-campus-navy-800/80 text-slate-300 hover:text-white border-campus-navy-700"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Conversation
          </Button>
        </div>
      </div>

      {/* Grounding Safety Notice */}
      <div className="p-3 bg-slate-100 border border-slate-200/90 rounded-2xl text-[11px] text-slate-600 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-campus-teal-600 shrink-0" />
          <span>
            <strong>Anti-Hallucination Policy:</strong> Answers are synthesized solely from indexed SCEM regulations. If no verified source exists, the assistant provides official department contacts rather than fabricating answers.
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {isProcessing && (
          <div className="flex gap-3.5 items-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-campus-navy-900 text-campus-teal-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-campus-teal-500 animate-ping"></span>
              Consulting verified SCEM institutional documents...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Suggested Academic Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              disabled={isProcessing}
              className="text-left text-xs bg-white hover:bg-campus-teal-50 hover:border-campus-teal-300 text-slate-700 hover:text-campus-teal-900 px-3 py-1.5 rounded-xl border border-slate-200 transition-all font-medium disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-campus-teal-500 focus-within:border-transparent transition-all"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about SCEM academics, rules, or campus facilities..."
          disabled={isProcessing}
          className="flex-1 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
        />
        <Button
          type="submit"
          variant="accent"
          size="md"
          disabled={!inputValue.trim() || isProcessing}
          isLoading={isProcessing}
          className="shrink-0 rounded-xl"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

