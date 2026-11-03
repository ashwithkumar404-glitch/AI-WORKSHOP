import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { AlertCircle, ArrowLeft, Loader2, Shield } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signUp, signInWithGoogle, isDemoMode, allowedDomains } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(4);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Failed to initialize Google Sign-In.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google enrollment failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signUp({
        fullName,
        email,
        usn,
        department,
        semester,
        password: password || undefined,
      });

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Failed to create account.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-navy-950 via-campus-navy-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
        
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Student Enrollment</h2>
            <p className="text-xs text-slate-500 mt-1">
              Create your SCEM student profile for placement aptitude exams and portal access.
            </p>
            {allowedDomains.length > 0 && (
              <div className="mt-2 text-[11px] text-campus-teal-800 bg-campus-teal-50 border border-campus-teal-200/60 rounded-lg px-2.5 py-1 inline-flex items-center gap-1">
                <span className="font-semibold">Eligible:</span> @{allowedDomains.join(', @')} accounts
              </div>
            )}
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Instant Enrollment via Google */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 font-semibold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-campus-teal-500 focus:ring-offset-2 disabled:opacity-60 mb-5"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 text-campus-teal-600 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isGoogleLoading ? 'Redirecting to Google...' : 'Instant Enroll with Google'}</span>
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium">Or complete form manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aditi Rao"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Institutional Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aditi@sahyadri.edu.in"
                required
              />
              <Input
                label="USN (University Seat No.)"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="4SF22CS014"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-campus-teal-500 focus:outline-none"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Science & Engineering">Information Science & Engineering</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="Data Science & Engineering">Data Science & Engineering</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

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

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              helperText={isDemoMode ? "Optional in local demo mode" : "Minimum 6 characters"}
            />

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <Shield className="w-4 h-4 text-campus-teal-600 shrink-0 mt-0.5" />
              <span>
                In compliance with institutional security, all self-registrations are granted strictly <strong>Student</strong> role. Administrative credentials require departmental authorization.
              </span>
            </div>

            <Button type="submit" variant="accent" className="w-full py-2.5 mt-2" isLoading={isLoading}>
              Complete Enrollment
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-campus-teal-700 hover:text-campus-teal-800 underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
