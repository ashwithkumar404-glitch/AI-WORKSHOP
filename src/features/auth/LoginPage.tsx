import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import {
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Sparkles,
  Lock,
  Globe,
  Loader2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signInWithGoogle, isDemoMode, switchDemoRole, allowedDomains, dbStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Failed to initialize Google Sign-In.');
      }
      // Note: On success, browser will redirect to Google's OAuth consent screen
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google Sign-In failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Failed to authenticate.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (targetRole: 'student' | 'admin') => {
    switchDemoRole(targetRole);
    navigate(targetRole === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-navy-950 via-campus-navy-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-campus-teal-600 to-campus-teal-400 text-white shadow-xl shadow-campus-teal-500/20 mb-4 font-black text-2xl">
          S1
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sahyadri <span className="text-campus-teal-400">ONE</span>
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Sahyadri College of Engineering and Management, Mangaluru
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campus-navy-800/80 border border-campus-teal-500/30 text-[11px] font-medium text-campus-teal-300">
          <Globe className="w-3 h-3 text-campus-teal-400" />
          <span>Placement & Academic Portal • Autonomous Institute</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Access placement aptitude exams, weekly notices, and AI assistance.
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

          {/* Primary Action: Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 font-semibold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-campus-teal-500 focus:ring-offset-2 disabled:opacity-60"
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
            <span>{isGoogleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium">Or institutional password</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aditi.cs22@sahyadri.edu.in"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              helperText={isDemoMode ? "In local sandbox mode, any password works" : undefined}
            />

            <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" isLoading={isLoading}>
              <Lock className="w-4 h-4 mr-1.5" />
              Sign In with Password
            </Button>
          </form>

          {/* Development / Demo Mode Sandbox Box */}
          {isDemoMode && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-campus-teal-600" />
                  Development Sandbox Personas
                </span>
                <span className="text-[10px] text-amber-600 font-medium px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                  Local Offline
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('student')}
                  className="p-3 text-left rounded-xl border border-campus-teal-200 bg-campus-teal-50/60 hover:bg-campus-teal-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2 text-campus-teal-800 font-bold text-xs">
                    <UserCheck className="w-4 h-4 text-campus-teal-600" />
                    Student Persona
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 truncate">Aditi Rao (4th Sem)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-3 text-left rounded-xl border border-campus-navy-200 bg-campus-navy-50/60 hover:bg-campus-navy-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2 text-campus-navy-800 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-campus-navy-700" />
                    Admin Persona
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 truncate">Dr. Rajesh Kamath</p>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-500">
            Need an institutional profile?{' '}
            <Link to="/register" className="font-semibold text-campus-teal-700 hover:text-campus-teal-800 underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
