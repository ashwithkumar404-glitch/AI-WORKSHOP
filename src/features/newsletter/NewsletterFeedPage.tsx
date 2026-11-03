import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { dbRepository } from '@/lib/storage';
import { Newsletter, NewsletterCategory } from '@/lib/dbTypes';
import { isWithinRolling10DaysIST, formatInIST } from './dateUtils';
import { NewsletterCard } from './NewsletterCard';
import { NewsletterDetailModal } from './NewsletterDetailModal';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Sparkles, 
  Archive, 
  Calendar, 
  Clock, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES: (NewsletterCategory | 'All')[] = [
  'All',
  'Academics',
  'Research & Innovation',
  'Placements',
  'Campus Life',
  'Events',
  'Notices'
];

export const NewsletterFeedPage: React.FC = () => {
  const { role } = useAuth();
  const [allNewsletters, setAllNewsletters] = useState<Newsletter[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsletterCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'current-feed' | 'archive'>('current-feed');
  const [selectedArticle, setSelectedArticle] = useState<Newsletter | null>(null);

  useEffect(() => {
    loadNewsletters();
    const handleDbChange = () => loadNewsletters();
    window.addEventListener('campuspilot_db_change', handleDbChange);
    return () => window.removeEventListener('campuspilot_db_change', handleDbChange);
  }, []);

  const loadNewsletters = () => {
    // Only published/archived for students
    const items = dbRepository.getNewsletters().filter(n => n.status === 'published' || n.status === 'archived');
    setAllNewsletters(items);
  };

  // Split into rolling 10-day window vs archive
  const currentFeed = allNewsletters
    .filter(n => isWithinRolling10DaysIST(n.published_at))
    .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());

  const archiveFeed = allNewsletters
    .filter(n => !isWithinRolling10DaysIST(n.published_at))
    .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());

  // Filter based on active tab, category, and search query
  const targetList = activeTab === 'current-feed' ? currentFeed : archiveFeed;

  const filtered = targetList.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-campus-navy-900 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              Official SCEM Weekly Publication
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Timezone: Asia/Kolkata (IST)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Newsletter & Notices
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Curated updates spanning VTU autonomous academic circulars, campus placement milestones, research breakthroughs, and student innovations.
          </p>
        </div>

        {/* Action button if Admin */}
        {role === 'admin' && (
          <Link to="/admin">
            <Button variant="accent" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              Newsletter Studio
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-4">
        {/* Top: Tab switcher & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('current-feed')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'current-feed'
                  ? 'bg-campus-navy-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-campus-teal-400" />
              Latest 10-Day Feed ({currentFeed.length})
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'archive'
                  ? 'bg-campus-navy-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-slate-400" />
              Archive ({archiveFeed.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search newsletter title, topic or tags..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
            />
          </div>
        </div>

        {/* Bottom: Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px] shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-campus-teal-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rolling 10-Day Policy Clarification Alert */}
      {activeTab === 'current-feed' && (
        <div className="p-3.5 bg-campus-navy-950/5 border border-campus-teal-500/30 rounded-2xl flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-campus-teal-600 shrink-0" />
            <span>
              <strong>Rolling Window Active:</strong> Displaying articles published within the latest 10 calendar days in Asia/Kolkata (including today). Older verified publications automatically migrate to the <strong>Archive</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No newsletters match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or switching to the {activeTab === 'current-feed' ? 'Archive' : '10-Day Feed'}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <NewsletterCard
              key={item.id}
              newsletter={item}
              onSelect={(n) => setSelectedArticle(n)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <NewsletterDetailModal
        newsletter={selectedArticle}
        isOpen={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};
