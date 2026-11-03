import React, { useState, useEffect } from 'react';
import { KnowledgeDocument, KnowledgeCategory, KnowledgeStatus } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { useAuth } from '@/features/auth/AuthContext';
import { isAdversarialInput } from '@/features/assistant/aiProvider';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  BookOpen, 
  ShieldAlert, 
  Upload,
  AlertCircle
} from 'lucide-react';
import { formatInIST } from '@/features/newsletter/dateUtils';

const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  'Academics & Regulations',
  'Examinations & Grading',
  'Admissions',
  'Departments',
  'Campus & Hostels',
  'Placements & Training',
  'Student Clubs',
  'Fees & Scholarships'
];

export const KnowledgeBaseManager: React.FC = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<KnowledgeCategory>('Academics & Regulations');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [status, setStatus] = useState<KnowledgeStatus>('approved');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = () => {
    const list = dbRepository.getKnowledgeDocs(); // Admin receives all
    setDocs(list);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Document title and text content are required.');
      return;
    }

    // Security check: inspect for prompt injection / hostile overrides inside uploaded text
    if (isAdversarialInput(content)) {
      setError('Security Warning: This document text contains adversarial prompt injection keywords (e.g. system instructions override, credential disclosure). Document ingestion rejected.');
      return;
    }

    const newDoc: KnowledgeDocument = {
      id: `kd-${Date.now()}`,
      title: title.trim(),
      category,
      content: content.trim(),
      source_url: sourceUrl.trim() || undefined,
      status,
      approved_by: user?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      dbRepository.saveKnowledgeDoc(newDoc);
      loadDocs();
      setIsModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save knowledge document.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSourceUrl('');
    setStatus('approved');
    setError('');
  };

  const handleToggleStatus = (doc: KnowledgeDocument) => {
    const nextStatus: KnowledgeStatus = doc.status === 'approved' ? 'rejected' : 'approved';
    const updated = { ...doc, status: nextStatus };
    dbRepository.saveKnowledgeDoc(updated);
    loadDocs();
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently remove this knowledge document from the AI grounding index?')) {
      dbRepository.deleteKnowledgeDoc(id);
      loadDocs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ask SCEM AI Grounded Knowledge Base</h2>
          <p className="text-xs text-slate-500">Curate verified institutional documents for high-precision retrieval and anti-hallucination guardrails.</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Ingest Knowledge Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <Card key={doc.id} className="space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={doc.status === 'approved' ? 'teal' : 'danger'} size="sm">
                  {doc.category}
                </Badge>
                <Badge variant={doc.status === 'approved' ? 'success' : 'neutral'} size="sm">
                  {doc.status.toUpperCase()}
                </Badge>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">{doc.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                {doc.content}
              </p>

              {doc.source_url && (
                <p className="text-[11px] text-campus-teal-700 font-mono truncate">
                  Source: {doc.source_url}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Updated: {formatInIST(doc.updated_at, false)}
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(doc)}
                  className="text-xs"
                >
                  {doc.status === 'approved' ? 'Revoke Approval' : 'Approve'}
                </Button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Ingest Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ingest Knowledge Document" maxWidth="2xl">
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Continuous Internal Evaluation (CIE) Scheme 2026"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
              >
                {KNOWLEDGE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <Input
              label="Official Source URL"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://sahyadri.edu.in/..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Document Text (Grounding Reference Data)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Paste official regulations, FAQs, grading rubrics, or campus guidelines..."
              required
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none font-normal"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
            <strong>Adversarial Sanitization:</strong> All uploaded text is scanned for prompt injection attacks and malicious system overrides before indexing.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm">
              Ingest & Index
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
