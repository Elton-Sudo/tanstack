import { expect, test } from '@playwright/test';

test.describe('Course Enrollment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('user can browse courses', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');

    // Wait for courses to load
    await expect(page.locator('h1')).toContainText('Course Catalog');

    // Check if courses are displayed
    await expect(page.locator('text=Phishing Awareness Training')).toBeVisible();
  });

  test('user can search for courses', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');

    // Search for a course
    await page.fill('input[type="search"]', 'Phishing');
    await page.waitForTimeout(500); // Debounce

    // Verify search results
    await expect(page.locator('text=Phishing Awareness Training')).toBeVisible();
  });

  test('user can enroll in a course', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');

    // Click on a course
    await page.click('text=Phishing Awareness Training');

    // Enroll in the course
    await page.click('button:has-text("Enroll Now")');

    // Verify enrollment success (could be a toast notification)
    await expect(page.locator('text=Enrolled')).toBeVisible({ timeout: 5000 });
  });

  test('enrolled course appears in My Courses', async ({ page }) => {
    await page.goto('http://localhost:3000/my-courses');

    // Check if enrolled courses are displayed
    await expect(page.locator('h1')).toContainText('My Courses');
    await expect(page.locator('text=In Progress').first()).toBeVisible();
  });

  test('user can continue a course', async ({ page }) => {
    await page.goto('http://localhost:3000/my-courses');

    // Click continue button
    await page.click('button:has-text("Continue")');

    // Should navigate to course detail page
    await expect(page).toHaveURL(/.*courses\/.*/);
  });

  test('user can filter courses by category', async ({ page }) => {
    await page.goto('http://localhost:3000/courses');

    // Click on a category filter
    await page.click('button:has-text("Email Security")');

    // Wait for filtered results
    await page.waitForTimeout(500);

    // Verify only email security courses are shown
    const courseCards = page.locator('[data-category="Email Security"]');
    expect(await courseCards.count()).toBeGreaterThan(0);
  });
});

test.describe('Course Learning Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('user can view course modules and chapters', async ({ page }) => {
    // Go to a course detail page
    await page.goto('http://localhost:3000/courses/course-1');

    // Check if modules are displayed
    await expect(page.locator('text=Module').first()).toBeVisible();

    // Check if chapters are displayed
    await expect(page.locator('text=Chapter').first()).toBeVisible();
  });

  test('user can start a chapter', async ({ page }) => {
    await page.goto('http://localhost:3000/courses/course-1');

    // Click on first chapter
    await page.click('text=What is Phishing?');

    // Chapter content should be visible
    await expect(page.locator('[data-chapter-content]')).toBeVisible();
  });

  test('progress bar updates as user completes chapters', async ({ page }) => {
    await page.goto('http://localhost:3000/courses/course-1');

    // Get initial progress
    const progressBar = page.locator('[role="progressbar"]');
    const initialProgress = await progressBar.getAttribute('aria-valuenow');

    // Complete a chapter
    await page.click('text=What is Phishing?');
    await page.click('button:has-text("Mark as Complete")');

    // Verify progress increased
    await page.waitForTimeout(1000);
    const newProgress = await progressBar.getAttribute('aria-valuenow');
    expect(Number(newProgress)).toBeGreaterThan(Number(initialProgress));
  });
});

test.describe('Quiz Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('user can take a quiz', async ({ page }) => {
    await page.goto('http://localhost:3000/courses/course-1/quiz');

    // Answer questions
    await page.click('input[value="answer-1"]');
    await page.click('button:has-text("Next")');

    await page.click('input[value="answer-2"]');
    await page.click('button:has-text("Next")');

    // Submit quiz
    await page.click('button:has-text("Submit Quiz")');

    // Verify results page
    await expect(page.locator('text=Quiz Results')).toBeVisible();
  });

  test('user can see quiz score', async ({ page }) => {
    await page.goto('http://localhost:3000/courses/course-1/quiz');

    // Complete and submit quiz
    await page.click('input[value="answer-1"]');
    await page.click('button:has-text("Submit Quiz")');

    // Check for score display
    await expect(page.locator('[data-quiz-score]')).toBeVisible();
  });
});
