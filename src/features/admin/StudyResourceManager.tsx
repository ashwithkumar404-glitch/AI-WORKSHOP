import React, { useState, useEffect } from 'react';
import { dbRepository } from '@/lib/storage';
import { StudyMaterial } from '@/lib/dbTypes';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Search, 
  Layers,
  Sparkles
} from 'lucide-react';

export const StudyResourceManager: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudyMaterial['category']>('DSA & Algorithms');
  const [topic, setTopic] = useState('Dynamic Programming');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [format, setFormat] = useState<StudyMaterial['format']>('PDF Notes');
  const [sourceName, setSourceName] = useState('SCEM Placement Cell');
  const [sourceUrl, setSourceUrl] = useState('https://sahyadri.edu.in');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('DSA, Trees, Placements');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    setMaterials(dbRepository.getStudyMaterials());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sourceUrl.trim()) return;

    const newMaterial: StudyMaterial = {
      id: `study-${Date.now()}`,
      title: title.trim(),
      category,
      topic: topic.trim() || 'General',
      difficulty,
      format,
      source_name: sourceName.trim() || 'SCEM Placement Cell',
      source_url: sourceUrl.trim(),
      description: description.trim() || `${title} study guide.`,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      is_featured: true,
      created_at: new Date().toISOString()
    };

    dbRepository.saveStudyMaterial(newMaterial);
    loadMaterials();
    setIsModalOpen(false);

    // Reset
    setTitle('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this study resource?')) {
      dbRepository.deleteStudyMaterial(id);
      loadMaterials();
    }
  };

  const filtered = materials.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-campus-teal-600" />
            Curated Study Resources & Roadmaps Manager
          </h2>
          <p className="text-xs text-slate-500">
            Publish learning sheets, coding roadmaps, and interview preparation guides for students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-campus-teal-500"
            />
          </div>
          <Button variant="accent" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Study Resource
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Resource Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Format</th>
                <th className="pb-3">Difficulty</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((mat) => (
                <tr key={mat.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <span className="font-bold text-slate-900 block">{mat.title}</span>
                    <span className="text-slate-500 text-[11px] line-clamp-1">{mat.description}</span>
                  </td>
                  <td className="py-3.5">
                    <Badge variant="teal" size="sm">{mat.category}</Badge>
                  </td>
                  <td className="py-3.5 font-medium text-slate-700">
                    {mat.format}
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      mat.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                      mat.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {mat.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={mat.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="View Resource"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(mat.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Placement Study Resource"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Resource Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dynamic Programming Master Sheet"
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="DSA & Algorithms">DSA & Algorithms</option>
                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                <option value="Logical Reasoning">Logical Reasoning</option>
                <option value="Verbal Ability">Verbal Ability</option>
                <option value="Core CS & Placement">Core CS & Placement</option>
                <option value="Interview Preparation">Interview Preparation</option>
                <option value="Web & Software Engineering">Web & Software Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="PDF Notes">PDF Notes</option>
                <option value="Video Tutorial">Video Tutorial</option>
                <option value="Interactive Problem Set">Interactive Problem Set</option>
                <option value="Cheat Sheet">Cheat Sheet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Topic (e.g. Trees, SQL, Syllogisms)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dynamic Programming"
            />
            <Input
              label="Source / Curator Name"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. Striver / SCEM Placement Cell"
            />
          </div>

          <Input
            label="Verified Resource URL"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://..."
            required
          />

          <Input
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. SDE, Coding, Algorithms"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Summary / Recommendations</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Why should students review this resource and how does it fit into their placement timeline?"
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
