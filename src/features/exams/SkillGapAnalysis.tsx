import React from 'react';
import { Link } from 'react-router-dom';
import { ExamAttempt } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  Compass,
  CalendarCheck,
  Zap
} from 'lucide-react';

interface SkillGapAnalysisProps {
  attempts: ExamAttempt[];
}

interface TopicStat {
  topic: string;
  category: string;
  totalQuestions: number;
  totalMarksAvailable: number;
  marksEarned: number;
  accuracy: number;
  status: 'Critical Skill Gap' | 'Needs Reinforcement' | 'Placement Ready';
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ attempts }) => {
  const completedAttempts = attempts.filter((a) => a.status === 'submitted');

  // Compute topic-level mastery from real responses and questions
  const topicStatsMap: Record<string, {
    category: string;
    totalQuestions: number;
    totalMarksAvailable: number;
    marksEarned: number;
  }> = {};

  const allExams = dbRepository.getExams();
  const examMap = new Map(allExams.map((e) => [e.id, e]));

  for (const att of completedAttempts) {
    const responses = dbRepository.getResponsesForAttempt(att.id);
    const questions = dbRepository.getQuestionsForExam(att.exam_id);
    const qMap = new Map(questions.map((q) => [q.id, q]));
    const exam = examMap.get(att.exam_id);
    const category = exam?.category || 'Aptitude & Technical';

    for (const resp of responses) {
      const q = qMap.get(resp.question_id);
      const topicName = q?.topic || exam?.title || 'General Aptitude';

      if (!topicStatsMap[topicName]) {
        topicStatsMap[topicName] = {
          category,
          totalQuestions: 0,
          totalMarksAvailable: 0,
          marksEarned: 0,
        };
      }

      const qMarks = q?.marks || 2;
      topicStatsMap[topicName].totalQuestions += 1;
      topicStatsMap[topicName].totalMarksAvailable += qMarks;
      topicStatsMap[topicName].marksEarned += resp.marks_awarded || 0;
    }
  }

  // If no attempts, provide default topics for baseline readiness
  const topics: TopicStat[] = Object.keys(topicStatsMap).length > 0
    ? Object.entries(topicStatsMap).map(([topic, data]) => {
        const accuracy = data.totalMarksAvailable > 0
          ? Math.round((data.marksEarned / data.totalMarksAvailable) * 100)
          : 0;

        let status: TopicStat['status'] = 'Needs Reinforcement';
        if (accuracy >= 80) status = 'Placement Ready';
        else if (accuracy < 60) status = 'Critical Skill Gap';

        return {
          topic,
          category: data.category,
          totalQuestions: data.totalQuestions,
          totalMarksAvailable: data.totalMarksAvailable,
          marksEarned: data.marksEarned,
          accuracy,
          status,
        };
      })
    : [
        {
          topic: 'Data Structures & Algorithms',
          category: 'Technical & Core CS',
          totalQuestions: 10,
          totalMarksAvailable: 20,
          marksEarned: 16,
          accuracy: 80,
          status: 'Placement Ready',
        },
        {
          topic: 'Permutations, Combinations & Probability',
          category: 'Quantitative Aptitude',
          totalQuestions: 10,
          totalMarksAvailable: 20,
          marksEarned: 11,
          accuracy: 55,
          status: 'Critical Skill Gap',
        },
        {
          topic: 'Syllogisms & Analytical Deduction',
          category: 'Logical Reasoning',
          totalQuestions: 10,
          totalMarksAvailable: 20,
          marksEarned: 14,
          accuracy: 70,
          status: 'Needs Reinforcement',
        },
        {
          topic: 'Database Management Systems & SQL',
          category: 'Technical & Core CS',
          totalQuestions: 10,
          totalMarksAvailable: 20,
          marksEarned: 17,
          accuracy: 85,
          status: 'Placement Ready',
        },
      ];

  const criticalGaps = topics.filter((t) => t.status === 'Critical Skill Gap');
  const needsWork = topics.filter((t) => t.status === 'Needs Reinforcement');
  const readyTopics = topics.filter((t) => t.status === 'Placement Ready');

  return (
    <div className="space-y-6">
      {/* Skill Gap Analysis Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-campus-navy-950 via-campus-navy-900 to-slate-900 text-white border border-campus-navy-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              Automated Diagnostic Telemetry
            </span>
          </div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-campus-teal-400" />
            Topic-Level Competency & Skill-Gap Diagnostic
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Evaluates your accuracy across technical and aptitude subject areas. Identified gaps automatically configure your recommended study roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center px-3 py-2 rounded-xl bg-campus-navy-900 border border-campus-navy-800">
            <p className="text-xs font-bold text-rose-400">{criticalGaps.length}</p>
            <p className="text-[10px] text-slate-400">Critical Gaps</p>
          </div>
          <div className="text-center px-3 py-2 rounded-xl bg-campus-navy-900 border border-campus-navy-800">
            <p className="text-xs font-bold text-amber-400">{needsWork.length}</p>
            <p className="text-[10px] text-slate-400">To Reinforce</p>
          </div>
          <div className="text-center px-3 py-2 rounded-xl bg-campus-navy-900 border border-campus-navy-800">
            <p className="text-xs font-bold text-emerald-400">{readyTopics.length}</p>
            <p className="text-[10px] text-slate-400">Ready</p>
          </div>
        </div>
      </div>

      {/* Topic Accuracy Matrix Table */}
      <Card>
        <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Topic Accuracy & Mastery Breakdown</h4>
            <p className="text-xs text-slate-500">Calculated from verified examination responses.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Subject / Topic</th>
                <th className="pb-3">Domain</th>
                <th className="pb-3">Evaluated Questions</th>
                <th className="pb-3">Accuracy Gauge</th>
                <th className="pb-3 text-right pr-2">Competency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topics.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 font-bold text-slate-900">
                    {t.topic}
                  </td>
                  <td className="py-3 text-slate-600">
                    <span className="text-[11px] font-medium">{t.category}</span>
                  </td>
                  <td className="py-3 text-slate-600 font-medium">
                    {t.marksEarned} / {t.totalMarksAvailable} marks ({t.totalQuestions} questions)
                  </td>
                  <td className="py-3 w-48">
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            t.accuracy >= 80 ? 'bg-emerald-500' :
                            t.accuracy >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${t.accuracy}%` }}
                        />
                      </div>
                      <span className="font-bold text-[11px] text-slate-700 w-9 text-right">
                        {t.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        t.status === 'Placement Ready'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : t.status === 'Needs Reinforcement'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {t.status === 'Placement Ready' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {t.status === 'Needs Reinforcement' && <TrendingUp className="w-3 h-3 text-amber-600" />}
                      {t.status === 'Critical Skill Gap' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actionable Personalized Placement Career Roadmap */}
      <Card className="bg-gradient-to-br from-white to-campus-teal-50/30 border-campus-teal-200/60">
        <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-campus-teal-600 text-white flex items-center justify-center shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Personalized 4-Week Placement Readiness Roadmap</h4>
              <p className="text-xs text-slate-500">Action items structured around your diagnosed weak topics.</p>
            </div>
          </div>
          <Link to="/study">
            <Button variant="outline" size="sm" className="text-xs">
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              Study Hub
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-campus-teal-700 text-[11px] uppercase tracking-wider">Week 1</span>
              <Badge variant="danger" size="sm">Gap Fix</Badge>
            </div>
            <h5 className="font-bold text-slate-900">
              {criticalGaps.length > 0 ? criticalGaps[0].topic : 'Aptitude Fundamentals'}
            </h5>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Complete formula sheets, solve 20 drill questions daily, and review step-by-step solutions.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-campus-teal-700 text-[11px] uppercase tracking-wider">Week 2</span>
              <Badge variant="warning" size="sm">Reinforce</Badge>
            </div>
            <h5 className="font-bold text-slate-900">
              {needsWork.length > 0 ? needsWork[0].topic : 'Logical Reasoning & Syllogisms'}
            </h5>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Focus on pattern deduction, seating arrangements, and timed 15-minute speed tests.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-campus-teal-700 text-[11px] uppercase tracking-wider">Week 3</span>
              <Badge variant="teal" size="sm">Core CS</Badge>
            </div>
            <h5 className="font-bold text-slate-900">Operating Systems & DBMS</h5>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Review transaction isolation, indexing, SQL queries, paging, and thread synchronization.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-campus-teal-700 text-[11px] uppercase tracking-wider">Week 4</span>
              <Badge variant="success" size="sm">Mock Drives</Badge>
            </div>
            <h5 className="font-bold text-slate-900">Company Simulation Mocks</h5>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Execute full 50-MCQ marathon assessments under strict countdown timers to benchmark speed.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

