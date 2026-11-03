import { describe, it, expect, beforeEach } from 'vitest';
import { dbRepository } from '@/lib/storage';
import { INITIAL_STUDENT_USER, INITIAL_ADMIN_USER } from '@/lib/mockData';

describe('RBAC & Row Level Security Enforcement', () => {
  beforeEach(() => {
    dbRepository.resetToDefaults();
  });

  it('prevents students from changing their role to admin', () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);

    // Attempt privilege escalation
    expect(() => {
      dbRepository.updateProfile({
        ...INITIAL_STUDENT_USER,
        role: 'admin',
      });
    }).toThrow(/Unauthorized/);
  });

  it('hides unpublished draft exams from ordinary students', () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    const studentExams = dbRepository.getExams();

    // Verify all returned exams have is_published = true
    for (const e of studentExams) {
      expect(e.is_published).toBe(true);
    }

    // Verify draft exam 'exam-ethics-201' is not present
    expect(studentExams.some(e => e.id === 'exam-ethics-201')).toBe(false);

    // Now switch to Admin persona
    dbRepository.setCurrentUser(INITIAL_ADMIN_USER);
    const adminExams = dbRepository.getExams();
    expect(adminExams.some(e => e.id === 'exam-ethics-201')).toBe(true);
  });

  it('hides unpublished newsletter drafts from students', () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);
    const studentNews = dbRepository.getNewsletters();

    // Verify all returned newsletters have status = 'published' or 'archived'
    for (const n of studentNews) {
      expect(n.status).not.toBe('draft');
    }
    expect(studentNews.some(n => n.id === 'nl-draft-001')).toBe(false);

    // Admin can see the draft
    dbRepository.setCurrentUser(INITIAL_ADMIN_USER);
    const adminNews = dbRepository.getNewsletters();
    expect(adminNews.some(n => n.id === 'nl-draft-001')).toBe(true);
  });

  it('prohibits non-admin users from creating or saving exams', () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);

    expect(() => {
      dbRepository.saveExam({
        id: 'hacked-exam',
        title: 'Unauthorized Exam',
        code: 'HACK01',
        description: 'Test',
        department: 'CSE',
        semester: 4,
        duration_minutes: 30,
        total_marks: 10,
        passing_marks: 5,
        retake_policy: 'single_attempt',
        max_attempts: 1,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }).toThrow(/Forbidden/);
  });

  it('prohibits non-admin users from publishing newsletters', () => {
    dbRepository.setCurrentUser(INITIAL_STUDENT_USER);

    expect(() => {
      dbRepository.saveNewsletter({
        id: 'hacked-nl',
        title: 'Fake News',
        slug: 'fake-news',
        summary: 'Fake',
        content: 'Fake body',
        category: 'Academics',
        status: 'published',
        author_name: 'Attacker',
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }).toThrow(/Forbidden/);
  });
});
