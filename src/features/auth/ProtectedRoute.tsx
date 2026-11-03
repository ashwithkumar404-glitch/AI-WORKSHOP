import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-campus-navy-800 border-t-campus-teal-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600">Verifying session credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-rose-100 p-8 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Restricted Access</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            The requested area requires <span className="font-semibold text-rose-600 uppercase tracking-wider">{requiredRole}</span> privileges. Your current role is <span className="font-semibold text-slate-800 uppercase tracking-wider">{user.role}</span>.
          </p>
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-campus-navy-800 hover:bg-campus-navy-900 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

