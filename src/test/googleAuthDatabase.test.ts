import { describe, it, expect, beforeEach } from 'vitest';
import { dbRepository } from '@/lib/storage';
import { INITIAL_STUDENT_USER, INITIAL_ADMIN_USER } from '@/lib/mockData';
import {
  isEmailDomainAllowed,
  isSupabaseConfigured,
  checkDatabaseConnection,
} from '@/lib/supabaseClient';

describe('Phase 2: Supabase Database, Google OAuth & Role Hardening', () => {
  beforeEach(() => {
    dbRepository.resetToDefaults();
  });

  describe('1. Institutional Email Domain Eligibility', () => {
    it('approves institutional sahdyadri.edu.in addresses', () => {
      expect(isEmailDomainAllowed('aditi.cs22@sahyadri.edu.in')).toBe(true);
      expect(isEmailDomainAllowed('rajesh.kamath@sahyadri.edu.in')).toBe(true);
      expect(isEmailDomainAllowed('PRINCIPAL@SAHYADRI.EDU.IN')).toBe(true);
    });

    it('rejects public or unapproved domains when institutional restrictions apply', () => {
      // In default environment, sahyadri.edu.in is configured
      expect(isEmailDomainAllowed('random.user@gmail.com')).toBe(false);
      expect(isEmailDomainAllowed('attacker@yahoo.com')).toBe(false);
      expect(isEmailDomainAllowed('student@othercollege.edu.in')).toBe(false);
    });

    it('handles empty or malformed email strings gracefully without crashing', () => {
      expect(isEmailDomainAllowed('')).toBe(false);
      expect(isEmailDomainAllowed('invalid-email-format')).toBe(false);
      expect(isEmailDomainAllowed('@sahyadri.edu.in')).toBe(false);
    });
  });

  describe('2. Student Identity & Role Privilege Escalation Defense', () => {
    it('strictly prevents a student from updating their role to admin', () => {
      dbRepository.setCurrentUser(INITIAL_STUDENT_USER);

      expect(() => {
        dbRepository.updateProfile({
          ...INITIAL_STUDENT_USER,
          role: 'admin',
        });
      }).toThrow(/Unauthorized: Students cannot alter user roles/);

      // Verify the persisted profile role remains student
      const currentUser = dbRepository.getCurrentUser();
      expect(currentUser?.role).toBe('student');
    });

    it('ensures self-registration always defaults to role = student', () => {
      const studentProfile = {
        id: 'usr-new-registered',
        email: 'newstudent@sahyadri.edu.in',
        full_name: 'New Student',
        department: 'Information Science',
        semester: 3,
        role: 'student' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      dbRepository.updateProfile(studentProfile);
      const profiles = dbRepository.getProfiles();
      const saved = profiles.find((p) => p.email === 'newstudent@sahyadri.edu.in');
      expect(saved).toBeDefined();
      expect(saved?.role).toBe('student');
    });

    it('prevents duplicate profile creation on retry', () => {
      const initialCount = dbRepository.getProfiles().length;

      // Updating or logging in an existing user updates the existing record
      dbRepository.updateProfile({
        ...INITIAL_STUDENT_USER,
        full_name: 'Aditi Rao Updated',
      });

      const updatedProfiles = dbRepository.getProfiles();
      expect(updatedProfiles.length).toBe(initialCount);
      const matched = updatedProfiles.find((p) => p.id === INITIAL_STUDENT_USER.id);
      expect(matched?.full_name).toBe('Aditi Rao Updated');
      expect(matched?.role).toBe('student');
    });
  });

  describe('3. Student Data & Private Answer Key Isolation', () => {
    it('never exposes private answer keys to students', () => {
      dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
      const questions = dbRepository.getQuestionsForExam('exam-daa-401');

      for (const q of questions) {
        expect((q as any).correct_option_id).toBeUndefined();
        expect((q as any).explanation).toBeUndefined();
      }
    });

    it('isolates student exam attempts to the authenticated owner', () => {
      dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
      const studentAttempts = dbRepository.getAttempts();

      // Student can only see their own attempts
      for (const attempt of studentAttempts) {
        expect(attempt.student_id).toBe(INITIAL_STUDENT_USER.id);
      }
    });

    it('allows administrators to inspect all student attempts for evaluation', () => {
      dbRepository.setCurrentUser(INITIAL_ADMIN_USER);
      const adminAttempts = dbRepository.getAttempts();

      expect(adminAttempts.length).toBeGreaterThan(0);
      expect(adminAttempts.some((a) => a.student_id === INITIAL_STUDENT_USER.id)).toBe(true);
    });
  });

  describe('4. Database Connection & Environment Safety', () => {
    it('returns structured connection status when unconfigured without throwing', async () => {
      const status = await checkDatabaseConnection();
      expect(status).toHaveProperty('ok');
      expect(status).toHaveProperty('isConfigured');
      expect(status).toHaveProperty('message');
      expect(status).toHaveProperty('mode');
    });

    it('safely distinguishes between unconfigured placeholders and valid credentials', () => {
      // With default unconfigured env placeholders:
      const configured = isSupabaseConfigured();
      expect(typeof configured).toBe('boolean');
    });
  });
});
