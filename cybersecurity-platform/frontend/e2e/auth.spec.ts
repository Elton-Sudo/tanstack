import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await expect(page.locator('h1')).toContainText('Login');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('can login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  test('shows error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 3000 });
  });

  test('can logout', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);

    // Logout
    await page.click('[data-user-menu]');
    await page.click('text=Logout');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('can view profile', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');

    await expect(page.locator('h1')).toContainText('Profile');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('can update profile information', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');

    // Update name
    await page.fill('input[name="name"]', 'Updated Name');
    await page.click('button:has-text("Save Changes")');

    // Should show success message
    await expect(page.locator('text=Profile updated')).toBeVisible({ timeout: 3000 });
  });

  test('can navigate to security settings', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');

    await page.click('text=Security');

    await expect(page).toHaveURL(/.*profile\/security/);
  });
});

test.describe('Security Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('displays MFA status', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/security');

    await expect(page.locator('text=Two-Factor Authentication')).toBeVisible();
    await expect(page.locator('[data-mfa-status]')).toBeVisible();
  });

  test('can enable MFA', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/security');

    // Click enable MFA button
    await page.click('button:has-text("Enable 2FA")');

    // Should show QR code
    await expect(page.locator('[data-qr-code]')).toBeVisible({ timeout: 3000 });
  });

  test('displays active sessions', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/security');

    await expect(page.locator('text=Active Sessions')).toBeVisible();
    await expect(page.locator('text=Current Session')).toBeVisible();
  });

  test('can log out all sessions', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/security');

    await page.click('button:has-text("Log Out All Other Sessions")');

    // Should show confirmation
    await expect(page.locator('text=Sessions logged out')).toBeVisible({ timeout: 3000 });
  });

  test('can change password', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/security');

    await page.click('button:has-text("Change Password")');

    // Should show password change form
    await expect(page.locator('input[name="currentPassword"]')).toBeVisible();
    await expect(page.locator('input[name="newPassword"]')).toBeVisible();
  });
});

test.describe('Password Reset', () => {
  test('forgot password flow', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.click('text=Forgot Password');

    await expect(page).toHaveURL(/.*forgot-password/);
    await expect(page.locator('input[name="email"]')).toBeVisible();

    await page.fill('input[name="email"]', 'learner@example.com');
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Protected Routes', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('cannot access admin routes as regular user', async ({ page }) => {
    // Login as regular user
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Try to access admin page
    await page.goto('http://localhost:3000/admin/users');

    // Should show forbidden or redirect
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });
});
