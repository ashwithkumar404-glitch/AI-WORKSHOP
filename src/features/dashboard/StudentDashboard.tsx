import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { dbRepository } from '@/lib/storage';
import { Exam, ExamAttempt, Newsletter, JobOpportunity, CodingSubmission, StudentAchievement } from '@/lib/dbTypes';
import { isWithinRolling10DaysIST, formatInIST } from '@/features/newsletter/dateUtils';
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
  Briefcase,
  BookOpen,
  Code2,
  Trophy,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Target
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [codingSubs, setCodingSubs] = useState<CodingSubmission[]>([]);
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);

  useEffect(() => {
    loadData();
    const handleDbChange = () => loadData();
    window.addEventListener('campuspilot_db_change', handleDbChange);
    return () => window.removeEventListener('campuspilot_db_change', handleDbChange);
  }, []);

  const loadData = () => {
    const allExams = dbRepository.getExams();
    const myAttempts = dbRepository.getAttempts();
    const allNews = dbRepository.getNewsletters();
    const allJobs = dbRepository.getJobs();
    const myCoding = dbRepository.getCodingSubmissions();
    const allAchs = dbRepository.getAchievements();

    setExams(allExams);
    setAttempts(myAttempts);
    setJobs(allJobs.filter(j => j.status === 'active'));
    setCodingSubs(myCoding);
    setAchievements(allAchs.filter(a => a.status === 'approved'));

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

  // Provisional Placement Readiness Score (Documented Activity-Weighted Formula)
  // 40% from Aptitude Exam Accuracy + 30% from Test Completion Consistency + 30% from Coding Submissions
  const examCompletionRatio = Math.min(completedAttempts.length / 5, 1.0); // baseline target: 5 completed tests
  const codingCompletionRatio = Math.min(codingSubs.length / 3, 1.0); // baseline target: 3 solved challenges
  const provisionalReadinessScore = Math.round(
    (overallAvgPercent * 0.4) + (examCompletionRatio * 100 * 0.3) + (codingCompletionRatio * 100 * 0.3)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Personalized Greeting Header */}
      <div className="bg-gradient-to-r from-campus-navy-950 via-campus-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-campus-navy-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-teal-950/80 border border-campus-teal-500/40 text-campus-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-campus-teal-400"></span>
              Department of {user?.department || 'Computer Science & Engineering'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Your Sahyadri One placement intelligence portal is active. Track measured aptitude mastery, practice coding challenges, and discover verified campus recruitment drives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/exams">
              <Button variant="accent" size="md">
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Take Aptitude Exam
              </Button>
            </Link>
            <Link to="/coding">
              <Button variant="outline" size="md" className="border-slate-600 text-white hover:bg-slate-800">
                <Code2 className="w-4 h-4 mr-1.5 text-campus-teal-400" />
                Coding Lab
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
            <span className="font-semibold text-slate-100">Semester {user?.semester || 6} • Autonomous</span>
          </div>
          <div>
            <span className="text-slate-400 block">Placement Eligibility</span>
            <span className="font-semibold text-emerald-400">Eligible (Dream & Core Tiers)</span>
          </div>
          <div>
            <span className="text-slate-400 block">Institutional Node</span>
            <span className="font-semibold text-campus-teal-300">SCEM Mangaluru</span>
          </div>
        </div>
      </div>

      {/* Real Statistics Calculated From Database Records */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Provisional Readiness Score Gauge */}
        <Card className="flex items-center gap-4 bg-gradient-to-br from-white to-campus-teal-50/40 border-campus-teal-200/60">
          <div className="w-12 h-12 rounded-2xl bg-campus-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-campus-teal-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-campus-teal-900 uppercase tracking-wider">Placement Readiness</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{provisionalReadinessScore}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Provisional activity formula</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-campus-navy-50 text-campus-navy-800 border border-campus-navy-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aptitude Exams</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{exams.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{completedAttempts.length} completed</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Job Drives</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{jobs.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Verified company links</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rolling Notices</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{newsletters.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Last 10 calendar days</p>
          </div>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assessments, Drives & Coding */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Job Opportunities Preview */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-campus-teal-600" />
                  Upcoming Campus Placement Drives
                </h3>
                <p className="text-xs text-slate-500">Verified institutional hiring schedules and deadlines.</p>
              </div>
              <Link to="/jobs" className="text-xs font-bold text-campus-teal-700 hover:text-campus-teal-800 flex items-center gap-1">
                View All ({jobs.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{job.company}</span>
                      <Badge variant="teal" size="sm">{job.type}</Badge>
                      <span className="text-[11px] font-semibold text-campus-teal-700">{job.ctc_or_stipend}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{job.role} • {job.location}</p>
                  </div>

                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-campus-navy-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <span>Apply Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Aptitude Assessment Start */}
          <Card>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-campus-teal-600" />
                  Recommended Aptitude Tests
                </h3>
                <p className="text-xs text-slate-500">Practice questions across Quantitative, Logical & Technical domains.</p>
              </div>
              <Link to="/exams" className="text-xs font-bold text-campus-teal-700 hover:text-campus-teal-800 flex items-center gap-1">
                Full Question Bank ({exams.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exams.slice(0, 4).map((exam) => (
                <div key={exam.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{exam.title}</span>
                    <Badge variant="neutral" size="sm">{exam.duration_minutes}m</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{exam.description}</p>
                  <Link to="/exams" className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                      Start Test
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Rolling Newsletters & Senior Debriefs */}
        <div className="space-y-6">
          {/* Rolling 10-Days Notice Feed */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-campus-teal-600" />
                Latest 10-Day Campus Notices
              </h3>
              <Link to="/newsletter" className="text-xs font-semibold text-campus-teal-700">
                View All
              </Link>
            </div>

            {newsletters.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center">No notices in the last 10 days.</p>
            ) : (
              <div className="space-y-2.5">
                {newsletters.slice(0, 3).map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-campus-teal-700">{n.category}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatInIST(n.published_at || '')}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{n.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick AI Advisor & Senior Debriefs Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-campus-teal-900 to-campus-navy-950 text-white space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-campus-teal-300" />
              <h3 className="text-sm font-bold">Ask Sahyadri AI Intelligence</h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Have questions about dream company eligibility cutoffs, hostel closing hours, or syllabus topics? Get instant, verified answers grounded in official college records.
            </p>
            <Link to="/assistant" className="block pt-1">
              <Button variant="accent" size="sm" className="w-full justify-center text-xs">
                Open Campus Assistant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
