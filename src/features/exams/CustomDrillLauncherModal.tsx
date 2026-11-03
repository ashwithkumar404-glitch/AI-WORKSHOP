import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Exam, Question, QuestionKey, ExamCategory } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { useAuth } from '@/features/auth/AuthContext';
import { 
  Zap, 
  Layers, 
  Clock, 
  Play, 
  CheckCircle2, 
  Sliders,
  Sparkles
} from 'lucide-react';

interface CustomDrillLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated: (examId: string) => void;
}

export const CustomDrillLauncherModal: React.FC<CustomDrillLauncherModalProps> = ({
  isOpen,
  onClose,
  onExamCreated,
}) => {
  const { user } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<ExamCategory | 'All'>('All');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 25 | 50>(10);
  const [difficultyPreference, setDifficultyPreference] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const durationMap: Record<number, number> = {
    5: 10,
    10: 20,
    25: 45,
    50: 90
  };

  const handleLaunchDrill = () => {
    const allExams = dbRepository.getExams();
    
    // Filter exams by domain
    const targetExams = selectedDomain === 'All' 
      ? allExams 
      : allExams.filter(e => e.category === selectedDomain);

    // Collect all available questions & keys from the matching exams
    const candidateQuestions: { question: Question; key?: QuestionKey }[] = [];
    
    for (const ex of targetExams) {
      const qList = dbRepository.getQuestionsForExam(ex.id);
      for (const q of qList) {
        const key = dbRepository.getQuestionKey(q.id);
        candidateQuestions.push({ question: q, key });
      }
    }

    // Shuffle and sample
    const shuffled = [...candidateQuestions].sort(() => 0.5 - Math.random());
    const countToTake = Math.min(questionCount, shuffled.length);
    const chosenSamples = shuffled.slice(0, countToTake);

    const drillId = `drill-${Date.now()}`;
    const domainTitle = selectedDomain === 'All' ? 'Comprehensive Mixed Aptitude' : selectedDomain;
    const duration = durationMap[questionCount] || 20;

    const drillExam: Exam = {
      id: drillId,
      code: `DRILL-${questionCount}Q`,
      title: `${domainTitle} — ${questionCount}-Question Custom Drill`,
      description: `Targeted practice assessment featuring ${countToTake} timed questions across ${domainTitle}.`,
      category: (selectedDomain === 'All' ? 'Quantitative Aptitude' : selectedDomain) as ExamCategory,
      department: user?.department || 'Computer Science & Engineering',
      semester: user?.semester || 6,
      duration_minutes: duration,
      total_marks: countToTake * 2,
      passing_marks: Math.round(countToTake * 2 * 0.5),
      retake_policy: 'multiple_attempts',
      max_attempts: 10,
      is_published: true,
      created_by: user?.id || 'system',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const finalQuestions: Question[] = [];
    const finalKeys: QuestionKey[] = [];

    chosenSamples.forEach((item, idx) => {
      const newQId = `drill-q-${drillId}-${idx + 1}`;
      finalQuestions.push({
        ...item.question,
        id: newQId,
        exam_id: drillId,
        marks: 2
      });

      if (item.key) {
        finalKeys.push({
          ...item.key,
          question_id: newQId
        });
      }
    });

    // Ingest into storage repository
    dbRepository.addGeneratedExam(drillExam, finalQuestions, finalKeys);

    onClose();
    onExamCreated(drillId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Launch Custom Timed Practice Drill"
      maxWidth="lg"
    >
      <div className="space-y-5 text-xs">
        <div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure a rapid or comprehensive diagnostic practice session. The engine pulls verified placement questions and initiates a timed assessment.
          </p>
        </div>

        {/* Domain Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-campus-teal-600" />
            1. Select Knowledge Domain
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'All', label: 'All Domains (Mixed)' },
              { id: 'Quantitative Aptitude', label: 'Quantitative' },
              { id: 'Logical Reasoning', label: 'Logical Reasoning' },
              { id: 'Verbal Ability', label: 'Verbal Ability' },
              { id: 'Technical & Core CS', label: 'Technical & Core CS' },
            ].map((dom) => (
              <button
                key={dom.id}
                type="button"
                onClick={() => setSelectedDomain(dom.id as any)}
                className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                  selectedDomain === dom.id
                    ? 'bg-campus-teal-50 border-campus-teal-500 text-campus-teal-900 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block">{dom.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-campus-teal-600" />
            2. Select Question Count & Duration
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {([5, 10, 25, 50] as const).map((count) => {
              const mins = durationMap[count];
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-campus-navy-900 border-campus-navy-900 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-base font-black">{count} MCQs</p>
                  <p className={`text-[11px] mt-0.5 flex items-center justify-center gap-1 ${
                    isSelected ? 'text-campus-teal-300 font-semibold' : 'text-slate-500'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {mins} mins
                  </p>
                  <p className={`text-[10px] mt-1 ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {count === 5 ? 'Quick Sprint' : count === 10 ? 'Standard' : count === 25 ? 'Deep Review' : 'Full Marathon'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drill Preview Summary Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-campus-teal-50 to-slate-50 border border-campus-teal-200 text-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900">Drill Configuration Summary</p>
            <p className="text-[11px] text-slate-600">
              Domain: <span className="font-semibold">{selectedDomain}</span> • {questionCount} questions • {durationMap[questionCount]} minutes countdown
            </p>
          </div>
          <Badge variant="teal" size="sm">
            Instant Scoring
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" type="button" onClick={handleLaunchDrill}>
            <Play className="w-4 h-4 mr-1.5" />
            Launch Practice Drill Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
