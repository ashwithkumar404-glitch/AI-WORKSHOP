import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { GraduationCap, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isDemoMode, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          CP
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          CampusPilot <span className="text-campus-teal-400">AI</span>
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Sahyadri College of Engineering and Management, Mangaluru
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campus-navy-800/80 border border-campus-teal-500/30 text-[11px] font-medium text-campus-teal-300">
          <span>Autonomous Institute Affiliated to VTU</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">Access academic examinations, rolling newsletters, and Ask SCEM AI.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
              helperText={isDemoMode ? "In demo mode, any password or empty works" : undefined}
            />

            <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {isDemoMode && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-campus-teal-600" />
                  Instant Demo Personas
                </span>
                <span className="text-[10px] text-slate-400 font-mono">No password required</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('student')}
                  className="p-3 text-left rounded-xl border border-campus-teal-200 bg-campus-teal-50/60 hover:bg-campus-teal-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2 text-campus-teal-800 font-bold text-xs">
                    <UserCheck className="w-4 h-4 text-campus-teal-600" />
                    Student Login
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
                    Admin Login
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

