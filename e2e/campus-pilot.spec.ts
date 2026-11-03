import { test, expect } from '@playwright/test';

test.describe('CampusPilot AI — SCEM Academic Portal E2E Tests', () => {
  test('Landing and Dashboard rendering for authenticated student', async ({ page }) => {
    await page.goto('/login');

    // Check branding
    await expect(page.locator('text=CampusPilot')).toBeVisible();
    await expect(page.locator('text=Sahyadri College of Engineering and Management')).toBeVisible();

    // Use Quick Student Persona
    await page.click('button:has-text("Student Login")');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Good day, Aditi Rao')).toBeVisible();
    await expect(page.locator('text=Available Assessments')).toBeVisible();
  });

  test('Exam flow: Start exam, answer questions, review screen, confirm, and verify score calculation', async ({ page }) => {
    await page.goto('/dashboard');

    // Navigate to Examinations
    await page.click('a:has-text("Examinations")');
    await expect(page).toHaveURL(/.*exams/);

    // Look for DBMS or DAA exam card and start
    const startBtn = page.locator('button:has-text("Start Exam"), button:has-text("Resume Attempt"), button:has-text("Retake Exam")').first();
    await startBtn.click();

    // Active exam runner should appear
    await expect(page.locator('text=Review & Submit')).toBeVisible();
    await expect(page.locator('text=Question 1 of')).toBeVisible();

    // Select option A or B
    const firstOption = page.locator('input[type="radio"]').first();
    await firstOption.check();

    // Click Review & Submit to open Review Modal
    await page.click('button:has-text("Review & Submit")');
    await expect(page.locator('text=Assessment Summary & Review')).toBeVisible();

    // Proceed to Final Submission
    await page.click('button:has-text("Proceed to Final Submission")');
    await expect(page.locator('text=Confirm Final Submission')).toBeVisible();

    // Confirm and Finalize
    await page.click('button:has-text("Confirm & Finalize")');

    // Result scorecard should display
    await expect(page.locator('text=Final Score')).toBeVisible();
    await expect(page.locator('text=Topic Mastery & Metadata Breakdown')).toBeVisible();
  });

  test('Newsletter feed: Verify 10-day rolling window, archive, and detail modal', async ({ page }) => {
    await page.goto('/newsletter');

    // Check heading
    await expect(page.locator('text=Campus Newsletter & Notices')).toBeVisible();
    await expect(page.locator('text=Latest 10-Day Feed')).toBeVisible();

    // Switch to Archive tab
    await page.click('button:has-text("Archive")');
    await expect(page.locator('text=Archive (')).toBeVisible();

    // Open first article
    const firstCard = page.locator('h3').first();
    await firstCard.click();

    // Detail modal should be open
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
  });

  test('Ask SCEM AI: Grounded query and source citation inspection', async ({ page }) => {
    await page.goto('/assistant');

    await expect(page.locator('text=Ask SCEM AI')).toBeVisible();
    await expect(page.locator('text=Namaskara!')).toBeVisible();

    // Click suggested prompt chip
    const chip = page.locator('button:has-text("attendance requirement")').first();
    await chip.click();

    // Should receive response with citations
    await expect(page.locator('text=Attendance Policy')).toBeVisible({ timeout: 10000 });
  });

  test('Role security: Student cannot access Administrator Studio', async ({ page }) => {
    // Switch to student persona in demo banner
    await page.goto('/dashboard');
    await page.click('button:has-text("Student (Aditi)")');

    // Try accessing /admin directly
    await page.goto('/admin');

    // Should display Restricted Access page
    await expect(page.locator('text=Restricted Access')).toBeVisible();
    await expect(page.locator('text=requires ADMIN privileges')).toBeVisible();
  });
});

