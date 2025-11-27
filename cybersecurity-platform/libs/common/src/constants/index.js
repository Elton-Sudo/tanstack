"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUEUE_NAMES = exports.EVENTS = exports.ROLES = void 0;
exports.ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    TENANT_ADMIN: 'TENANT_ADMIN',
    MANAGER: 'MANAGER',
    USER: 'USER',
    INSTRUCTOR: 'INSTRUCTOR',
};
exports.EVENTS = {
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    PASSWORD_RESET_REQUESTED: 'password.reset.requested',
    PASSWORD_CHANGED: 'password.changed',
    MFA_ENABLED: 'mfa.enabled',
    MFA_DISABLED: 'mfa.disabled',
    COURSE_PUBLISHED: 'course.published',
    ENROLLMENT_CREATED: 'enrollment.created',
    ENROLLMENT_COMPLETED: 'enrollment.completed',
    QUIZ_SUBMITTED: 'quiz.submitted',
    RISK_SCORE_UPDATED: 'risk.score.updated',
};
exports.QUEUE_NAMES = {
    EMAIL: 'email-queue',
    SMS: 'sms-queue',
    NOTIFICATION: 'notification-queue',
    VIDEO_TRANSCODING: 'video-transcoding-queue',
    REPORT_GENERATION: 'report-generation-queue',
};
//# sourceMappingURL=index.js.map