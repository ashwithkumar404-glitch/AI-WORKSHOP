import React, { useState } from 'react';
import { Question, QuestionOption } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface QuestionEditorModalProps {
  examId: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  examId,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [topic, setTopic] = useState('Core Concepts');
  const [marks, setMarks] = useState(3);
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ]);
  const [correctOptionId, setCorrectOptionId] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');

  const handleOptionTextChange = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!questionText.trim()) {
      setError('Question text is mandatory.');
      return;
    }

    if (options.some((o) => !o.text.trim())) {
      setError('All four option choices (A, B, C, D) must contain text.');
      return;
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      exam_id: examId,
      question_text: questionText.trim(),
      options,
      marks: Number(marks),
      topic: topic.trim(),
      order_index: Date.now(),
      created_at: new Date().toISOString(),
    };

    try {
      dbRepository.saveQuestion(newQuestion, correctOptionId, explanation.trim());
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save question.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Evaluated Question & Secure Key" maxWidth="2xl">
      <form onSubmit={handleSave} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Question Text
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            placeholder="Formulate the multiple-choice problem statement..."
            required
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Topic Category"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Asymptotic Analysis"
            required
          />
          <Input
            label="Marks Weightage"
            type="number"
            min={1}
            max={10}
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            required
          />
        </div>

        {/* Options */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Option Choices (A, B, C, D) & Correct Key Selection
          </label>
          <div className="space-y-2.5">
            {options.map((opt) => {
              const isCorrect = correctOptionId === opt.id;
              return (
                <div key={opt.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrectOptionId(opt.id)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border transition-all ${
                      isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                    }`}
                    title={isCorrect ? 'Correct Answer Key' : 'Click to set as correct option'}
                  >
                    {opt.id}
                  </button>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                    placeholder={`Option ${opt.id} content...`}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
                    required
                  />
                  {isCorrect && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                      Answer Key
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Private Answer Key Explanation */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Private Key Explanation / Derivation
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={2}
            placeholder="Official faculty explanation (visible to students only after final submission)..."
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" size="sm">
            Save Question
          </Button>
        </div>
      </form>
    </Modal>
  );
};

