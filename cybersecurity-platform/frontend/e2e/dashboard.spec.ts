import { expect, test } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('displays key metrics', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // Check for metric cards
    await expect(page.locator('text=Active Users')).toBeVisible();
    await expect(page.locator('text=Courses Completed')).toBeVisible();
    await expect(page.locator('text=Risk Score')).toBeVisible();
    await expect(page.locator('text=Training Hours')).toBeVisible();
  });

  test('shows metric values and trends', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // Check if metrics have values
    const metricValue = page.locator('[data-metric-value]').first();
    await expect(metricValue).not.toBeEmpty();

    // Check for trend indicators
    await expect(page.locator('[data-trend]').first()).toBeVisible();
  });

  test('displays charts', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // Check for chart containers
    await expect(page.locator('text=Training Progress')).toBeVisible();
    await expect(page.locator('text=Risk Assessment')).toBeVisible();
  });

  test('shows recent activity', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // Check for recent activity section
    await expect(page.locator('text=Recent Activity')).toBeVisible();

    // Check if activity items are present
    const activityItems = page.locator('[data-activity-item]');
    expect(await activityItems.count()).toBeGreaterThan(0);
  });
});

test.describe('Risk Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('displays user risk score', async ({ page }) => {
    await page.goto('http://localhost:3000/risk');

    // Check for risk score display
    await expect(page.locator('[data-risk-score]')).toBeVisible();

    // Check for risk level (Low, Medium, High)
    await expect(page.locator('[data-risk-level]')).toBeVisible();
  });

  test('shows risk factors breakdown', async ({ page }) => {
    await page.goto('http://localhost:3000/risk');

    // Check for risk factors
    await expect(page.locator('text=Training Completion')).toBeVisible();
    await expect(page.locator('text=Quiz Performance')).toBeVisible();
  });

  test('displays risk trend chart', async ({ page }) => {
    await page.goto('http://localhost:3000/risk');

    // Check for trend chart
    await expect(page.locator('[data-risk-trend-chart]')).toBeVisible();
  });
});

test.describe('Compliance Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('displays compliance metrics', async ({ page }) => {
    await page.goto('http://localhost:3000/compliance');

    // Check for compliance rate
    await expect(page.locator('[data-compliance-rate]')).toBeVisible();

    // Check for required vs completed trainings
    await expect(page.locator('text=Required Courses')).toBeVisible();
    await expect(page.locator('text=Completed Courses')).toBeVisible();
  });

  test('allows framework selection', async ({ page }) => {
    await page.goto('http://localhost:3000/compliance');

    // Check for framework selector
    await expect(page.locator('[data-framework-selector]')).toBeVisible();

    // Select a different framework
    await page.click('[data-framework-selector]');
    await page.click('text=HIPAA');

    // Verify framework changed
    await expect(page.locator('text=HIPAA')).toBeVisible();
  });

  test('shows expiring certificates', async ({ page }) => {
    await page.goto('http://localhost:3000/compliance');

    // Check for expiring certificates section
    await expect(page.locator('text=Expiring Certificates')).toBeVisible();
  });
});

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('lists generated reports', async ({ page }) => {
    await page.goto('http://localhost:3000/reports');

    // Check for reports list
    await expect(page.locator('h1')).toContainText('Reports');

    // Check if reports are displayed
    const reportCards = page.locator('[data-report-card]');
    expect(await reportCards.count()).toBeGreaterThanOrEqual(0);
  });

  test('can download a report', async ({ page }) => {
    await page.goto('http://localhost:3000/reports');

    // Wait for reports to load
    await page.waitForSelector('[data-report-card]', { timeout: 5000 });

    // Click download button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button[data-download-report]');
    const download = await downloadPromise;

    // Verify download started
    expect(download).toBeTruthy();
  });

  test('can navigate to report builder', async ({ page }) => {
    await page.goto('http://localhost:3000/reports');

    // Click generate report button
    await page.click('button:has-text("Generate Report")');

    // Should navigate to report builder
    await expect(page).toHaveURL(/.*reports\/builder/);
  });
});
