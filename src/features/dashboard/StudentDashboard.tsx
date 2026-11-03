import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { dbRepository } from '@/lib/storage';
import { Exam, ExamAttempt, Newsletter } from '@/lib/dbTypes';
import { isWithinRolling10DaysIST, formatInIST, formatRelativeIST } from '@/features/newsletter/dateUtils';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  GraduationCap, 
  Newspaper, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  TrendingUp, 
  FileText,
  Calendar,
  Building,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  useEffect(() => {
    loadData();
    const handleDbChange = () => loadData();
    window.addEventListener('campuspilot_db_change', handleDbChange);
    return () => window.removeEventListener('campuspilot_db_change', handleDbChange);
  }, []);

  const loadData = () => {
    const allExams = dbRepository.getExams(); // Published only for student
    const myAttempts = dbRepository.getAttempts(); // My attempts
    const allNews = dbRepository.getNewsletters();

    setExams(allExams);
    setAttempts(myAttempts);
    
    // Newsletters in rolling 10-day window
    const recentNews = allNews
      .filter(n => n.status === 'published' && isWithinRolling10DaysIST(n.published_at))
      .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());
    setNewsletters(recentNews);
  };

  // Compute real metrics from attempts
  const completedAttempts = attempts.filter(a => a.status === 'submitted');
  const totalScoreObtained = completedAttempts.reduce((sum, a) => sum + Number(a.score), 0);
  const totalMaxScore = completedAttempts.reduce((sum, a) => sum + Number(a.max_score), 0);
  const overallAvgPercent = totalMaxScore > 0 ? Math.round((totalScoreObtained / totalMaxScore) * 100) : 0;
  const passedCount = completedAttempts.filter(a => a.passed).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Personalized Greeting Header */}
      <div className="bg-gradient-to-r from-campus-navy-900 via-campus-navy-800 to-campus-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-campus-navy-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-campus-teal-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-teal-950/80 border border-campus-teal-500/40 text-campus-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-campus-teal-400"></span>
              Department of {user?.department || 'Computer Science & Engineering'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {user?.full_name}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Your autonomous academic portal is active. Inspect upcoming Continuous Internal Evaluation (CIE) assessments, track exam mastery, and explore verified college notices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/exams">
              <Button variant="accent" size="md">
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Take Assessment
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="secondary" size="md" className="bg-campus-navy-800 text-slate-200 hover:bg-campus-navy-700 border border-campus-navy-700">
                <Bot className="w-4 h-4 mr-1.5 text-campus-teal-400" />
                Ask SCEM AI
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick academic details bar */}
        <div className="mt-6 pt-6 border-t border-campus-navy-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">USN</span>
            <span className="font-mono font-bold text-slate-100">{user?.usn || '4SF22CS014'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Semester & Scheme</span>
            <span className="font-semibold text-slate-100">Semester {user?.semester || 4} • 2022 Autonomous</span>
          </div>
          <div>
            <span className="text-slate-400 block">Institution</span>
            <span className="font-semibold text-slate-100">SCEM Mangaluru</span>
          </div>
          <div>
            <span className="text-slate-400 block">Accreditation</span>
            <span className="font-semibold text-campus-teal-300">NAAC 'A' | NBA Tier-1</span>
          </div>
        </div>
      </div>

      {/* Real Statistics Calculated From Database Records */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-campus-navy-50 text-campus-navy-800 border border-campus-navy-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Assessments</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{exams.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Published for your branch</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-campus-teal-50 text-campus-teal-700 border border-campus-teal-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Attempts</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{completedAttempts.length}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{passedCount} tests cleared</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{overallAvgPercent}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {totalScoreObtained} of {totalMaxScore} marks
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">10-Day Newsletter Feed</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{newsletters.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Current verified updates</p>
          </div>
        </Card>
      </div>

      {/* Main Grid: Exams Left, Newsletter & AI Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Online Assessments & Performance Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active & Available Examinations */}
          <Card>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-campus-teal-600" />
                  Available Examinations
                </h3>
                <p className="text-xs text-slate-500">Autonomous MCQ assessments ready to be attempted.</p>
              </div>
              <Link to="/exams" className="text-xs font-semibold text-campus-teal-700 hover:text-campus-teal-800 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {exams.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No examinations currently published.</p>
                <p className="text-xs text-slate-500 mt-1">Check back later when departmental evaluation schedules are released.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exams.slice(0, 3).map((exam) => {
                  const studentAttempt = attempts.find(a => a.exam_id === exam.id && a.student_id === user?.id);
                  const isSubmitted = studentAttempt?.status === 'submitted';
                  const isInProgress = studentAttempt?.status === 'in_progress';

                  return (
                    <div
                      key={exam.id}
                      className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-navy-50 text-campus-navy-800 border border-campus-navy-200">
                            {exam.code}
                          </span>
                          <span className="text-xs text-slate-500">• Sem {exam.semester}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{exam.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {exam.duration_minutes} Mins
                          </span>
                          <span>•</span>
                          <span>{exam.total_marks} Marks</span>
                          <span>•</span>
                          <span>Pass: {exam.passing_marks}</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isSubmitted ? (
                          <div className="text-right">
                            <Badge variant={studentAttempt?.passed ? 'success' : 'danger'} size="sm">
                              {studentAttempt?.score} / {studentAttempt?.max_score} ({studentAttempt?.percentage}%)
                            </Badge>
                            <Link to="/exams" className="block text-[11px] text-campus-teal-700 hover:underline mt-1">
                              View Results
                            </Link>
                          </div>
                        ) : isInProgress ? (
                          <Link to="/exams">
                            <Button variant="accent" size="sm" className="bg-amber-600 hover:bg-amber-700">
                              Resume Test
                            </Button>
                          </Link>
                        ) : (
                          <Link to="/exams">
                            <Button variant="primary" size="sm">
                              Start Exam
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Performance Highlights */}
          <Card>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-campus-teal-600" />
                  Recent Performance Summary
                </h3>
                <p className="text-xs text-slate-500">Records evaluated securely by institutional scoring logic.</p>
              </div>
              <Link to="/exams" className="text-xs font-semibold text-campus-teal-700 hover:text-campus-teal-800 flex items-center gap-1">
                Full Analytics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {completedAttempts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No exam attempts recorded yet.</p>
                <p className="text-xs text-slate-500 mt-1">Complete your first MCQ assessment to see verified performance trends.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedAttempts.slice(0, 3).map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">
                        {att.exam?.title || 'Course Examination'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Completed on {formatInIST(att.submitted_at || att.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          {att.score} / {att.max_score}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          {att.percentage}%
                        </span>
                      </div>
                      <Badge variant={att.passed ? 'success' : 'danger'} size="sm">
                        {att.passed ? 'PASSED' : 'RETRY NEEDED'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Rolling 10-Day Newsletters & AI Assistant Card */}
        <div className="space-y-6">
          {/* Ask SCEM AI Assistant Teaser */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-campus-teal-900 via-campus-teal-950 to-campus-navy-950 text-white shadow-md border border-campus-teal-700/40 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-campus-teal-500/20 border border-campus-teal-400/30 flex items-center justify-center text-campus-teal-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Ask SCEM AI</h4>
                <p className="text-[11px] text-campus-teal-300">Grounded Academic Assistant</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Have questions regarding VTU autonomous attendance rules, 2026 academic calendar, or hostel facilities? Get answers grounded in approved SCEM documents.
            </p>

            <Link to="/assistant">
              <Button variant="accent" size="sm" className="w-full bg-campus-teal-500 hover:bg-campus-teal-600 text-campus-navy-950 font-bold">
                Launch Assistant
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Rolling Latest-10-Calendar-Days Newsletter Feed */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4 text-campus-teal-600" />
                    Latest 10-Day Feed
                  </h3>
                  <span className="text-[10px] font-bold text-campus-teal-700 bg-campus-teal-50 px-1.5 py-0.2 rounded border border-campus-teal-200">
                    IST
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Rolling calendar window</p>
              </div>
              <Link to="/newsletter" className="text-xs font-semibold text-campus-teal-700 hover:underline">
                Archive & All
              </Link>
            </div>

            {newsletters.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs font-semibold text-slate-700">No articles in the last 10 days.</p>
                <Link to="/newsletter" className="text-xs text-campus-teal-600 hover:underline mt-1 inline-block">
                  Browse previous publications in archive
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {newsletters.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    to="/newsletter"
                    className="block p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-campus-teal-700 bg-campus-teal-50 px-1.5 py-0.5 rounded border border-campus-teal-200/50">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {formatRelativeIST(item.published_at)}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 group-hover:text-campus-teal-700 transition-colors line-clamp-2">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {item.summary}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

