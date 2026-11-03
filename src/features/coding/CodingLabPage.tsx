import React, { useState } from 'react';
import { dbRepository } from '@/lib/storage';
import { CodingProblem, CodingSubmission } from '@/lib/dbTypes';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { executeStudentCode, ExecutionResult } from './executionEngine';
import { 
  Code2, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle,
  Send,
  Eye, 
  Terminal,
  BookOpen,
  Compass,
  ArrowRight
} from 'lucide-react';

export const CodingLabPage: React.FC = () => {
  const { user } = useAuth();
  const problems = dbRepository.getCodingProblems();
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem>(problems[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'cpp'>('javascript');
  const [userCode, setUserCode] = useState<string>(selectedProblem.starter_code[selectedLanguage] || '');
  
  // 5-Level Hint state: 0 = none, 1 = observation, 2 = diagnostic, 3 = concept, 4 = guided correction, 5 = reveal solution
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  
  // Execution result state
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState<ExecutionResult | null>(null);

  const handleSelectProblem = (p: CodingProblem) => {
    setSelectedProblem(p);
    setUserCode(p.starter_code[selectedLanguage] || p.starter_code.javascript || '');
    setUnlockedHintLevel(0);
    setTestResults(null);
  };

  const handleLanguageChange = (lang: 'javascript' | 'python' | 'cpp') => {
    setSelectedLanguage(lang);
    setUserCode(selectedProblem.starter_code[lang] || '');
    setTestResults(null);
  };

  const handleUnlockNextHint = () => {
    if (unlockedHintLevel < 5) {
      setUnlockedHintLevel(prev => prev + 1);
    }
  };

  const handleResetCode = () => {
    setUserCode(selectedProblem.starter_code[selectedLanguage] || '');
    setTestResults(null);
    setUnlockedHintLevel(0);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);

    try {
      const result = await executeStudentCode(
        userCode,
        selectedLanguage,
        selectedProblem.slug,
        selectedProblem.test_cases
      );

      setTestResults(result);

      // Persist submission record
      const mapSubmissionStatus = (s: typeof result.status): CodingSubmission['status'] => {
        if (s === 'compile_error') return 'compilation_error';
        if (s === 'time_limit_exceeded') return 'runtime_error';
        return s;
      };

      const submission: CodingSubmission = {
        id: `sub-${Date.now()}`,
        problem_id: selectedProblem.id,
        student_id: user?.id || 'guest',
        language: selectedLanguage,
        code: userCode,
        status: mapSubmissionStatus(result.status),
        passed_cases: result.passedCount,
        total_cases: result.totalCount,
        hints_used: unlockedHintLevel,
        runtime_ms: result.runtimeMs,
        created_at: new Date().toISOString()
      };
      dbRepository.saveCodingSubmission(submission);
    } catch (err: any) {
      setTestResults({
        status: 'runtime_error',
        passedCount: 0,
        totalCount: selectedProblem.test_cases.length,
        runtimeMs: 0,
        outputDetails: [],
        errorDiagnostic: err.message || 'Execution failed'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-campus-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-campus-navy-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-campus-teal-950 text-campus-teal-400 border border-campus-teal-600/40">
              Sahyadri One • Technical Interview Workbench
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Guided Coding & Debugging Lab
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Real sandboxed execution engine with true testcase verification and progressive 5-stage debugging assistance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-campus-navy-900/90 px-4 py-2.5 rounded-2xl border border-campus-navy-800 text-xs">
          <Terminal className="w-4 h-4 text-campus-teal-400" />
          <span className="text-slate-300">Target Language:</span>
          <span className="font-bold text-white capitalize">{selectedLanguage}</span>
        </div>
      </div>

      {/* Main Lab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Bank & Statement (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Problem Selector Card */}
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-campus-teal-600" />
              Interview Problem Bank
            </h3>
            <div className="space-y-1.5">
              {problems.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProblem(p)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedProblem.id === p.id
                      ? 'bg-campus-teal-50 border border-campus-teal-300 text-campus-teal-900 font-bold shadow-sm'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="block truncate">{p.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{p.category}</span>
                  </div>
                  <Badge variant={p.difficulty === 'Easy' ? 'success' : p.difficulty === 'Medium' ? 'warning' : 'danger'} size="sm">
                    {p.difficulty}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>

          {/* Problem Statement Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedProblem.title}</h2>
                <span className="text-xs text-campus-teal-700 font-semibold">{selectedProblem.category}</span>
              </div>
              <Badge variant={selectedProblem.difficulty === 'Easy' ? 'success' : 'warning'} size="sm">
                {selectedProblem.difficulty}
              </Badge>
            </div>

            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <p>{selectedProblem.description}</p>

              {/* Examples */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-900 text-xs block">Examples:</span>
                {selectedProblem.examples.map((ex, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                    <div><span className="text-slate-400">Input: </span>{ex.input}</div>
                    <div><span className="text-slate-400">Output: </span>{ex.output}</div>
                    {ex.explanation && (
                      <div className="text-slate-500 font-sans text-[11px] pt-1 italic">{ex.explanation}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="pt-2">
                <span className="font-bold text-slate-900 text-xs block mb-1">Constraints:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                  {selectedProblem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Code Editor & Execution Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
            {/* Editor Top Bar */}
            <div className="bg-campus-navy-950 text-white px-4 py-2.5 flex items-center justify-between border-b border-campus-navy-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-campus-teal-400" />
                <span className="text-xs font-bold font-mono">Solution Workspace</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value as any)}
                  className="bg-campus-navy-900 text-xs font-mono text-slate-200 border border-campus-navy-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-campus-teal-500"
                >
                  <option value="javascript">JavaScript (ES6 Sandboxed)</option>
                  <option value="python">Python 3.11</option>
                  <option value="cpp">C++ 20</option>
                </select>

                <button
                  onClick={handleResetCode}
                  title="Reset to starter template"
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="p-3 bg-slate-900">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={13}
                spellCheck={false}
                className="w-full bg-transparent text-slate-100 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                placeholder="Write your solution code here..."
              />
            </div>

            {/* Editor Action Footer */}
            <div className="bg-white p-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedLanguage === 'javascript' 
                  ? 'Real in-browser runtime • Pure sandboxed evaluation' 
                  : 'Syntax and structural validator • Client runner'}
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={handleRunCode}
                isLoading={isExecuting}
                className="text-xs"
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Execute Test Cases
              </Button>
            </div>
          </Card>

          {/* Test Results Output Banner */}
          {testResults && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
              testResults.status === 'accepted'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : testResults.status === 'compile_error'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {testResults.status === 'accepted' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>ACCEPTED — All {testResults.passedCount}/{testResults.totalCount} Test Cases Passed</span>
                    </>
                  ) : testResults.status === 'compile_error' ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span>COMPILATION / SYNTAX ERROR</span>
                    </>
                  ) : testResults.status === 'runtime_error' ? (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>RUNTIME ERROR ({testResults.passedCount}/{testResults.totalCount} Passed)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>WRONG ANSWER ({testResults.passedCount}/{testResults.totalCount} Test Cases Passed)</span>
                    </>
                  )}
                </div>
                <span className="font-mono text-[11px] opacity-80">
                  Execution: {testResults.runtimeMs} ms
                </span>
              </div>

              {testResults.errorDiagnostic && (
                <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200 font-mono text-[11px] text-rose-700">
                  {testResults.errorDiagnostic}
                </div>
              )}

              {testResults.outputDetails.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {testResults.outputDetails.map((od, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white/90 border border-slate-200/80 font-mono text-[11px] flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-slate-500 mr-2">Case {i + 1}:</span>
                        <span className="text-slate-700">{od.input}</span>
                      </div>
                      <span className={`shrink-0 ${od.passed ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}`}>
                        {od.passed ? 'PASS' : `FAIL (Expected: ${od.expected}, Got: ${od.actual})`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5-Level Progressive Debugging Hint Sequence */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-campus-teal-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  5-Stage Guided Debugging Ladder
                </h3>
              </div>

              {testResults?.status !== 'accepted' && unlockedHintLevel < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnlockNextHint}
                  className="text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-campus-teal-600" />
                  Unlock Stage {unlockedHintLevel + 1}
                </Button>
              )}
            </div>

            {testResults?.status === 'accepted' ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Challenge Solved Successfully!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Your code correctly satisfies all visible and hidden constraints without hints. Excellent problem-solving!
                  </p>
                </div>
              </div>
            ) : unlockedHintLevel === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Encountering an issue or need guidance? Step through our 5-stage progressive learning sequence: Observation → Diagnostic → Concept → Guided Correction → Solution Reveal.
              </p>
            ) : (
              <div className="space-y-2.5">
                {/* Level 1: Observation */}
                {unlockedHintLevel >= 1 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-black">1</span>
                      Level 1 — Observation
                    </span>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Analyze the expected return type and constraints. What input caused the deviation, and does your function return a value for all execution branches?
                    </p>
                  </div>
                )}

                {/* Level 2: Diagnostic */}
                {unlockedHintLevel >= 2 && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-[10px] flex items-center justify-center font-black">2</span>
                      Level 2 — Diagnostic
                    </span>
                    <p className="text-amber-800 pl-6 leading-relaxed">
                      {testResults && testResults.failedCaseIndex !== undefined
                        ? `Failure identified on Test Case ${testResults.failedCaseIndex + 1}: Check why the output deviated from the required format.`
                        : selectedProblem.hints[0] || 'Check loop boundaries and variable initialization.'}
                    </p>
                  </div>
                )}

                {/* Level 3: Conceptual */}
                {unlockedHintLevel >= 3 && (
                  <div className="p-3 rounded-xl bg-campus-teal-50/70 border border-campus-teal-200 text-xs space-y-1">
                    <span className="font-bold text-campus-teal-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-campus-teal-200 text-campus-teal-800 text-[10px] flex items-center justify-center font-black">3</span>
                      Level 3 — Conceptual Hint
                    </span>
                    <p className="text-campus-teal-800 pl-6 leading-relaxed">
                      {selectedProblem.hints[1] || selectedProblem.hints[0]}
                    </p>
                  </div>
                )}

                {/* Level 4: Guided Correction */}
                {unlockedHintLevel >= 4 && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-1">
                    <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 text-[10px] flex items-center justify-center font-black">4</span>
                      Level 4 — Guided Correction & Edge Cases
                    </span>
                    <p className="text-indigo-800 pl-6 leading-relaxed">
                      {selectedProblem.hints[2] || 'Consider empty inputs, negative values, and repeated elements.'}
                    </p>
                  </div>
                )}

                {/* Level 5: Solution Reveal */}
                {unlockedHintLevel >= 5 && (
                  <div className="p-4 rounded-xl bg-campus-navy-950 text-white text-xs space-y-2 border border-campus-navy-800">
                    <span className="font-bold text-campus-teal-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-campus-teal-500 text-campus-navy-950 text-[10px] flex items-center justify-center font-black">5</span>
                      Level 5 — Reference Solution & Editorial
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedProblem.editorial}
                    </p>
                    <pre className="p-3 rounded-lg bg-black/50 text-campus-teal-200 font-mono text-[11px] overflow-x-auto">
                      {selectedProblem.solution_code[selectedLanguage] || selectedProblem.solution_code.javascript}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
