import React, { useState, useEffect } from 'react';
import { dbRepository } from '@/lib/storage';
import { StudyMaterial } from '@/lib/dbTypes';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  FileText, 
  Video, 
  Code, 
  Bookmark, 
  Sparkles,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const StudyMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    setMaterials(dbRepository.getStudyMaterials());
  };

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'Quantitative Aptitude', label: 'Quantitative' },
    { id: 'Logical Reasoning', label: 'Logical' },
    { id: 'Verbal Ability', label: 'Verbal' },
    { id: 'DSA & Algorithms', label: 'DSA & Algorithms' },
    { id: 'Core CS & Placement', label: 'Core CS (OS, DBMS, CN)' },
    { id: 'Interview Preparation', label: 'Technical & HR Interviews' },
  ];

  const filtered = materials.filter((m) => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || m.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getFormatIcon = (format: StudyMaterial['format']) => {
    switch (format) {
      case 'Video Tutorial':
        return <Video className="w-3.5 h-3.5 text-rose-500" />;
      case 'Interactive Problem Set':
        return <Code className="w-3.5 h-3.5 text-campus-teal-600" />;
      case 'Cheat Sheet':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'PDF Notes':
      default:
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-campus-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              Sahyadri One • Curated Learning Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Study Materials & Placement Cheatsheets
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Search hand-picked roadmaps, cheat sheets, lecture notes, and top coding platforms curated for campus placement drives.
          </p>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
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

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
            />
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Filter Level:</span>
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                selectedDifficulty === lvl
                  ? 'bg-campus-navy-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
          <span className="ml-auto text-slate-400 font-mono text-[11px]">
            {filtered.length} Resources Found
          </span>
        </div>
      </div>

      {/* Materials Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No study materials matched your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search terms or reset the category filters to explore all available placement materials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mat) => (
            <Card key={mat.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {getFormatIcon(mat.format)}
                    {mat.format}
                  </span>
                  <Badge
                    variant={
                      mat.difficulty === 'Beginner'
                        ? 'success'
                        : mat.difficulty === 'Intermediate'
                        ? 'teal'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {mat.difficulty}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-campus-teal-600 transition-colors line-clamp-2">
                    {mat.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-campus-teal-700 block mt-0.5">
                    {mat.topic}
                  </span>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                  Source: {mat.source_name}
                </span>

                <a
                  href={mat.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-campus-teal-700 hover:text-campus-teal-800 bg-campus-teal-50 hover:bg-campus-teal-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

