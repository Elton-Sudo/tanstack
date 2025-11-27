export declare const ROLES: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly TENANT_ADMIN: "TENANT_ADMIN";
    readonly MANAGER: "MANAGER";
    readonly USER: "USER";
    readonly INSTRUCTOR: "INSTRUCTOR";
};
export declare const EVENTS: {
    readonly USER_CREATED: "user.created";
    readonly USER_UPDATED: "user.updated";
    readonly USER_DELETED: "user.deleted";
    readonly PASSWORD_RESET_REQUESTED: "password.reset.requested";
    readonly PASSWORD_CHANGED: "password.changed";
    readonly MFA_ENABLED: "mfa.enabled";
    readonly MFA_DISABLED: "mfa.disabled";
    readonly COURSE_PUBLISHED: "course.published";
    readonly ENROLLMENT_CREATED: "enrollment.created";
    readonly ENROLLMENT_COMPLETED: "enrollment.completed";
    readonly QUIZ_SUBMITTED: "quiz.submitted";
    readonly RISK_SCORE_UPDATED: "risk.score.updated";
};
export declare const QUEUE_NAMES: {
    readonly EMAIL: "email-queue";
    readonly SMS: "sms-queue";
    readonly NOTIFICATION: "notification-queue";
    readonly VIDEO_TRANSCODING: "video-transcoding-queue";
    readonly REPORT_GENERATION: "report-generation-queue";
};
