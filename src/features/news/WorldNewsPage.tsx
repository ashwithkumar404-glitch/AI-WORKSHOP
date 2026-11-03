import React, { useState, useEffect } from 'react';
import { dbRepository } from '@/lib/storage';
import { WorldNewsArticle, Newsletter } from '@/lib/dbTypes';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { formatInIST, isWithinRolling10DaysIST } from '@/features/newsletter/dateUtils';
import { 
  Globe2, 
  ExternalLink, 
  Calendar, 
  Newspaper, 
  Sparkles, 
  Filter, 
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export const WorldNewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'world' | 'campus'>('world');
  const [articles, setArticles] = useState<WorldNewsArticle[]>([]);
  const [campusNews, setCampusNews] = useState<Newsletter[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterLast10Days, setFilterLast10Days] = useState(true);

  useEffect(() => {
    setArticles(dbRepository.getWorldNews());
    setCampusNews(dbRepository.getNewsletters().filter(n => n.status === 'published'));
  }, []);

  const categories = [
    { id: 'all', label: 'All Developments' },
    { id: 'Tech & AI', label: 'Tech & AI' },
    { id: 'Hiring Trends', label: 'Hiring Trends' },
    { id: 'Higher Education', label: 'Higher Education' },
    { id: 'Science & Space', label: 'Science & Space' },
  ];

  const filteredArticles = articles.filter((a) => {
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matches10Days = !filterLast10Days || isWithinRolling10DaysIST(a.published_at);
    return matchesCategory && matches10Days;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-campus-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              Sahyadri One • Intelligence & News Wire
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Global Tech, Career Trends & Campus Digest
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Curated 10-day rolling digest of technological breakthroughs, IT hiring demands, and autonomous college initiatives.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-campus-navy-900/90 p-1.5 rounded-2xl border border-campus-navy-700 flex items-center shrink-0">
          <button
            onClick={() => setActiveTab('world')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'world'
                ? 'bg-campus-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            World & Tech Wire
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'campus'
                ? 'bg-campus-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Campus Daily Digest
          </button>
        </div>
      </div>

      {activeTab === 'world' ? (
        <div className="space-y-6">
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? 'bg-campus-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={filterLast10Days}
                onChange={(e) => setFilterLast10Days(e.target.checked)}
                className="rounded border-slate-300 text-campus-teal-600 focus:ring-campus-teal-500 w-4 h-4"
              />
              <span>Rolling 10-Days Window Only</span>
            </label>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-campus-teal-700 bg-campus-teal-50 border border-campus-teal-200/60 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatInIST(article.published_at)}
                    </span>
                  </div>

                  {article.image_url && (
                    <div className="h-40 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Source: {article.source_name}
                  </span>

                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-campus-teal-700 hover:text-campus-teal-800 bg-campus-teal-50 hover:bg-campus-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <span>Read Original</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Campus Digest Stream */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Official Sahyadri College Daily Digest • Continuous Internal Announcements
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campusNews.map((n) => (
              <Card key={n.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" size="sm">{n.category}</Badge>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatInIST(n.published_at || n.created_at)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{n.summary}</p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Author: {n.author_name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
