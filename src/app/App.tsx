import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { AuthCallback } from '@/features/auth/AuthCallback';
import { Layout } from './Layout';
import { StudentDashboard } from '@/features/dashboard/StudentDashboard';
import { ExamsPage } from '@/features/exams/ExamsPage';
import { CodingLabPage } from '@/features/coding/CodingLabPage';
import { StudyMaterialsPage } from '@/features/study/StudyMaterialsPage';
import { JobsDirectoryPage } from '@/features/jobs/JobsDirectoryPage';
import { WorldNewsPage } from '@/features/news/WorldNewsPage';
import { InterviewHubPage } from '@/features/interviews/InterviewHubPage';
import { NewsletterFeedPage } from '@/features/newsletter/NewsletterFeedPage';
import { AskScemChat } from '@/features/assistant/AskScemChat';
import { AdminDashboard } from '@/features/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="coding" element={<CodingLabPage />} />
            <Route path="study" element={<StudyMaterialsPage />} />
            <Route path="jobs" element={<JobsDirectoryPage />} />
            <Route path="news" element={<WorldNewsPage />} />
            <Route path="interviews" element={<InterviewHubPage />} />
            <Route path="newsletter" element={<NewsletterFeedPage />} />
            <Route path="assistant" element={<AskScemChat />} />

            {/* Admin Restricted Area */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
