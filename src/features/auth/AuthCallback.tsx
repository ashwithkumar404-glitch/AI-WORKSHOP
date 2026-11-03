import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const AuthCallback: React.FC = () => {
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const processCallback = async () => {
      // 1. Check URL parameters for explicit OAuth errors
      const params = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.substring(1));

      const errorParam = params.get('error') || hashParams.get('error');
      const errorDesc = params.get('error_description') || hashParams.get('error_description');

      if (errorParam) {
        if (!isMounted) return;
        setStatus('error');
        if (errorParam === 'access_denied') {
          setErrorMessage('Google Sign-In was cancelled or access was denied.');
        } else {
          setErrorMessage(errorDesc ? decodeURIComponent(errorDesc.replace(/\+/g, ' ')) : errorParam);
        }
        return;
      }

      // 2. Resolve session and profile with Supabase
      try {
        const result = await handleOAuthCallback();
        if (!isMounted) return;

        if (result.success) {
          setStatus('success');
          // Short delay for visual confirmation before navigating
          setTimeout(() => {
            if (isMounted) {
              navigate('/dashboard', { replace: true });
            }
          }, 800);
        } else {
          setStatus('error');
          setErrorMessage(result.error || 'Authentication callback failed.');
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Unexpected authentication error');
      }
    };

    processCallback();

    return () => {
      isMounted = false;
    };
  }, [handleOAuthCallback, location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-navy-950 via-campus-navy-900 to-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100 text-center">
          {status === 'loading' && (
            <div className="py-6 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-campus-teal-50 border border-campus-teal-200">
                <Loader2 className="w-8 h-8 text-campus-teal-600 animate-spin" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Verifying Institutional Identity</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Establishing secure session with Supabase and verifying Google credentials...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Authentication Confirmed</h2>
              <p className="text-xs text-slate-500">
                Redirecting to your student academic dashboard...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="py-6 space-y-4 text-left">
              <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold">Access Verification Failed</h3>
                  <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => navigate('/login', { replace: true })}
                >
                  Return to Sign In
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <div className="text-center">
                  <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 underline">
                    Switch to another Google Account
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
