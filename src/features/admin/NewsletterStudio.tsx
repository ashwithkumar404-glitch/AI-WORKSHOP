import React, { useState, useEffect } from 'react';
import { Newsletter, NewsletterCategory, NewsletterStatus } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { 
  Plus, 
  Trash2, 
  Eye, 
  Send, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Archive
} from 'lucide-react';
import { formatInIST, isWithinRolling10DaysIST } from '@/features/newsletter/dateUtils';

const CATEGORIES: NewsletterCategory[] = [
  'Academics',
  'Research & Innovation',
  'Placements',
  'Campus Life',
  'Events',
  'Sports & Culture',
  'Notices'
];

export const NewsletterStudio: React.FC = () => {
  const { user } = useAuth();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<Newsletter | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsletterCategory>('Academics');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [status, setStatus] = useState<NewsletterStatus>('published');
  const [error, setError] = useState('');

  useEffect(() => {
    loadNewsletters();
  }, []);

  const loadNewsletters = () => {
    // Admin receives all newsletters including drafts
    const items = dbRepository.getNewsletters();
    setNewsletters(items);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError('Title, summary, and article content are required.');
      return;
    }

    const slug = title.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const isPublishing = status === 'published';
    const newArticle: Newsletter = {
      id: `nl-${Date.now()}`,
      title: title.trim(),
      slug,
      summary: summary.trim(),
      content: content.trim(),
      category,
      cover_image_url: coverImageUrl.trim() || undefined,
      status,
      published_at: isPublishing ? new Date().toISOString() : undefined,
      author_id: user?.id,
      author_name: user?.full_name || 'SCEM Editorial Desk',
      tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      dbRepository.saveNewsletter(newArticle);
      loadNewsletters();
      setIsModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save newsletter.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setCoverImageUrl('');
    setTagsStr('');
    setStatus('published');
    setError('');
  };

  const handleToggleStatus = (item: Newsletter) => {
    const nextStatus: NewsletterStatus = item.status === 'published' ? 'draft' : 'published';
    const updated: Newsletter = {
      ...item,
      status: nextStatus,
      published_at: nextStatus === 'published' ? (item.published_at || new Date().toISOString()) : undefined,
    };
    dbRepository.saveNewsletter(updated);
    loadNewsletters();
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this newsletter article?')) {
      dbRepository.deleteNewsletter(id);
      loadNewsletters();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Institutional Newsletter Studio</h2>
          <p className="text-xs text-slate-500">Draft, preview, and publish verified college news and departmental announcements.</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Compose Newsletter
        </Button>
      </div>

      <div className="space-y-3">
        {newsletters.map((item) => {
          const isCurrent = isWithinRolling10DaysIST(item.published_at);

          return (
            <Card key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={item.status === 'published' ? 'success' : 'neutral'} size="sm">
                    {item.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-bold text-campus-teal-800 bg-campus-teal-50 px-2 py-0.5 rounded border border-campus-teal-200">
                    {item.category}
                  </span>
                  {item.status === 'published' && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      isCurrent ? 'bg-campus-teal-100 text-campus-teal-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isCurrent ? 'In 10-Day Window' : 'Archived'}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{item.summary}</p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Author: {item.author_name}</span>
                  <span>•</span>
                  <span>Date: {formatInIST(item.published_at || item.created_at)}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreviewItem(item);
                    setIsPreviewOpen(true);
                  }}
                  className="text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Preview
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleStatus(item)}
                  className="text-xs"
                >
                  {item.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Compose Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Compose Newsletter Publication" maxWidth="2xl">
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. SCEM Students Win National Aerospace Hackathon"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsletterCategory)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NewsletterStatus)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
              >
                <option value="published">Publish to Feed Immediately</option>
                <option value="draft">Save as Editorial Draft</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Executive Summary (Appears in Card & Feed)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="Concise 1-2 sentence overview for the rolling feed..."
              required
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Full Article Body
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Comprehensive official text, event breakdown, or policy notice..."
              required
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none font-normal"
            />
          </div>

          <Input
            label="Cover Image URL (Optional)"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />

          <Input
            label="Tags (Comma-separated)"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="Hackathon, VTU, CSE, Placements"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm">
              Save Publication
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewItem && (
        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Newsletter Preview" maxWidth="2xl">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">{previewItem.title}</h2>
            <div className="p-3 bg-campus-teal-50/50 border-l-4 border-campus-teal-500 rounded-r-xl text-slate-700 text-xs italic">
              {previewItem.summary}
            </div>
            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
              {previewItem.content}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

