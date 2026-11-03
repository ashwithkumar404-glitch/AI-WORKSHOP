import React, { useState, useEffect } from 'react';
import { Exam, Question } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { QuestionEditorModal } from './QuestionEditorModal';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  HelpCircle,
  FileQuestion,
  Users
} from 'lucide-react';

export const ExamManager: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedExamIdForQuestions, setSelectedExamIdForQuestions] = useState<string | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Form fields for new exam
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(4);
  const [duration, setDuration] = useState(25);
  const [totalMarks, setTotalMarks] = useState(15);
  const [passingMarks, setPassingMarks] = useState(8);
  const [retakePolicy, setRetakePolicy] = useState<'single_attempt' | 'multiple_attempts'>('single_attempt');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = () => {
    // Admin receives all exams (published + drafts)
    const list = dbRepository.getExams();
    setExams(list);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      department,
      semester: Number(semester),
      duration_minutes: Number(duration),
      total_marks: Number(totalMarks),
      passing_marks: Number(passingMarks),
      retake_policy: retakePolicy,
      max_attempts: retakePolicy === 'single_attempt' ? 1 : 2,
      is_published: isPublished,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dbRepository.saveExam(newExam);
    loadExams();
    setIsExamModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setCode('');
    setDescription('');
    setDuration(25);
    setTotalMarks(15);
    setPassingMarks(8);
    setIsPublished(false);
  };

  const handleTogglePublish = (exam: Exam) => {
    const updated = { ...exam, is_published: !exam.is_published };
    dbRepository.saveExam(updated);
    loadExams();
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm('Are you sure you want to delete this examination and all its questions? This cannot be undone.')) {
      dbRepository.deleteExam(examId);
      loadExams();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Departmental Exam Architecture</h2>
          <p className="text-xs text-slate-500">Configure questions, duration, server retake policies, and publication state.</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setIsExamModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Examination
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => {
          const questions = dbRepository.getQuestionsForExam(exam.id);
          const attempts = dbRepository.getAttempts().filter(a => a.exam_id === exam.id);

          return (
            <Card key={exam.id} className="space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-navy-50 text-campus-navy-800 border border-campus-navy-200">
                      {exam.code}
                    </span>
                    <span className="text-xs text-slate-500">Sem {exam.semester}</span>
                  </div>
                  <Badge variant={exam.is_published ? 'success' : 'neutral'} size="sm">
                    {exam.is_published ? 'Published' : 'Draft / Unpublished'}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{exam.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{exam.description}</p>

                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                    <span className="font-bold text-slate-800">{exam.duration_minutes}m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Questions</span>
                    <span className="font-bold text-slate-800">{questions.length} Items</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Attempts</span>
                    <span className="font-bold text-slate-800">{attempts.length} Submissions</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedExamIdForQuestions(exam.id);
                      setIsQuestionModalOpen(true);
                    }}
                    className="text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Question
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(exam)}
                    className="text-xs text-slate-600 hover:text-slate-900"
                  >
                    {exam.is_published ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {exam.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                </div>

                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Exam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Exam Modal */}
      <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title="Create Departmental Examination">
        <form onSubmit={handleCreateExam} className="space-y-4">
          <Input
            label="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design & Analysis of Algorithms — CIE 1"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Course Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 22CS41"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Evaluation Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Syllabus scope and instructions..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Duration (Mins)"
              type="number"
              min={5}
              max={180}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
            />
            <Input
              label="Total Marks"
              type="number"
              min={1}
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              required
            />
            <Input
              label="Passing Marks"
              type="number"
              min={1}
              value={passingMarks}
              onChange={(e) => setPassingMarks(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                Retake Policy
              </label>
              <select
                value={retakePolicy}
                onChange={(e) => setRetakePolicy(e.target.value as 'single_attempt' | 'multiple_attempts')}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
              >
                <option value="single_attempt">Single Attempt Only</option>
                <option value="multiple_attempts">Allow Multiple Attempts (Max 2)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isPub"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-campus-teal-600 rounded border-slate-300 focus:ring-campus-teal-500"
              />
              <label htmlFor="isPub" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Publish Immediately
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsExamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm">
              Create Exam Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Question Editor Modal */}
      {selectedExamIdForQuestions && (
        <QuestionEditorModal
          examId={selectedExamIdForQuestions}
          isOpen={isQuestionModalOpen}
          onClose={() => {
            setIsQuestionModalOpen(false);
            setSelectedExamIdForQuestions(null);
          }}
          onSaved={loadExams}
        />
      )}
    </div>
  );
};

