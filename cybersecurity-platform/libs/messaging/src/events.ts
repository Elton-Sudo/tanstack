// Event names for the application
export const EVENTS = {
  // Auth events
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  PASSWORD_RESET_REQUESTED: 'password.reset.requested',
  PASSWORD_CHANGED: 'password.changed',
  MFA_ENABLED: 'mfa.enabled',
  MFA_DISABLED: 'mfa.disabled',

  // Tenant events
  TENANT_CREATED: 'tenant.created',
  TENANT_UPDATED: 'tenant.updated',
  TENANT_SUSPENDED: 'tenant.suspended',
  TENANT_ACTIVATED: 'tenant.activated',
  TENANT_DELETED: 'tenant.deleted',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_EXPIRED: 'subscription.expired',

  // User events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_INVITED: 'user.invited',

  // Course events
  COURSE_CREATED: 'course.created',
  COURSE_UPDATED: 'course.updated',
  COURSE_PUBLISHED: 'course.published',
  COURSE_ARCHIVED: 'course.archived',

  // Enrollment events
  ENROLLMENT_CREATED: 'enrollment.created',
  ENROLLMENT_COMPLETED: 'enrollment.completed',
  ENROLLMENT_CANCELLED: 'enrollment.cancelled',

  // Assessment events
  QUIZ_SUBMITTED: 'quiz.submitted',
  QUIZ_PASSED: 'quiz.passed',
  QUIZ_FAILED: 'quiz.failed',
  CERTIFICATE_ISSUED: 'certificate.issued',

  // Notification events
  NOTIFICATION_SENT: 'notification.sent',
  EMAIL_SENT: 'email.sent',

  // Phishing simulation events
  PHISHING_SIMULATION_STARTED: 'phishing.simulation.started',
  PHISHING_CLICKED: 'phishing.clicked',
  PHISHING_REPORTED: 'phishing.reported',
};
