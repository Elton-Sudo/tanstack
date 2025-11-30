import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');

  // Clean up existing data (optional - comment out if you want to keep existing data)
  // await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;

  // ============================================
  // 1. Create Tenants
  // ============================================
  console.log('📦 Creating tenants...');

  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      domain: 'acme.example.com',
      description: 'Leading enterprise security solutions provider',
      website: 'https://acme.example.com',
      contactEmail: 'contact@acme.com',
      contactPhone: '+27 11 123 4567',
      status: 'ACTIVE',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      subscriptionPlan: 'ENTERPRISE',
      maxUsers: 1000,
      subscriptionStartDate: new Date('2024-01-01'),
      subscriptionEndDate: new Date('2025-01-01'),
      features: {
        sso: true,
        advancedAnalytics: true,
        customBranding: true,
        apiAccess: true,
        gamification: true,
        phishingSimulation: true,
        reporting: true,
      },
      settings: {
        passwordPolicy: {
          minLength: 12,
          requireUppercase: true,
          requireNumbers: true,
          requireSymbols: true,
        },
        mfaRequired: true,
        sessionTimeout: 30,
      },
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'techstart-inc' },
    update: {},
    create: {
      name: 'TechStart Inc',
      slug: 'techstart-inc',
      description: 'Innovative tech startup',
      contactEmail: 'hello@techstart.com',
      status: 'TRIAL',
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      subscriptionPlan: 'TRIAL',
      maxUsers: 50,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: {
        sso: false,
        advancedAnalytics: false,
        customBranding: true,
        apiAccess: false,
        gamification: false,
      },
    },
  });

  const tenant3 = await prisma.tenant.upsert({
    where: { slug: 'gov-dept' },
    update: {},
    create: {
      name: 'Government Department',
      slug: 'gov-dept',
      domain: 'dept.gov.za',
      description: 'South African Government Department',
      contactEmail: 'security@dept.gov.za',
      status: 'ACTIVE',
      primaryColor: '#007A4D',
      secondaryColor: '#DE3831',
      subscriptionPlan: 'PROFESSIONAL',
      maxUsers: 500,
      features: {
        sso: true,
        customBranding: true,
        gamification: true,
      },
    },
  });

  console.log('✅ Created 3 tenants\n');

  // ============================================
  // 2. Create Departments
  // ============================================
  console.log('🏢 Creating departments...');

  const itDept = await prisma.department.create({
    data: {
      tenantId: tenant1.id,
      name: 'Information Technology',
      description: 'IT and technology services',
    },
  });

  const hrDept = await prisma.department.create({
    data: {
      tenantId: tenant1.id,
      name: 'Human Resources',
      description: 'HR and personnel management',
    },
  });

  const financeDept = await prisma.department.create({
    data: {
      tenantId: tenant1.id,
      name: 'Finance',
      description: 'Financial management and accounting',
    },
  });

  const salesDept = await prisma.department.create({
    data: {
      tenantId: tenant1.id,
      name: 'Sales',
      description: 'Sales and business development',
    },
  });

  const engineeringDept = await prisma.department.create({
    data: {
      tenantId: tenant1.id,
      name: 'Engineering',
      description: 'Software and product engineering',
    },
  });

  console.log('✅ Created 5 departments\n');

  // ============================================
  // 3. Create Users
  // ============================================
  console.log('👥 Creating users...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'superadmin@platform.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      email: 'superadmin@platform.com',
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      mfaEnabled: false,
      departmentId: itDept.id,
      position: 'System Administrator',
    },
  });

  // Tenant Admin
  const tenantAdmin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'admin@acme.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      email: 'admin@acme.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Administrator',
      role: 'TENANT_ADMIN',
      emailVerified: true,
      departmentId: itDept.id,
      position: 'CISO',
      phoneNumber: '+27 11 123 4568',
    },
  });

  // Manager
  const manager = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'manager@acme.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      email: 'manager@acme.com',
      passwordHash: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Manager',
      role: 'MANAGER',
      emailVerified: true,
      departmentId: hrDept.id,
      position: 'HR Manager',
      phoneNumber: '+27 11 123 4569',
    },
  });

  // Instructor
  const instructor = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant1.id,
        email: 'instructor@acme.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant1.id,
      email: 'instructor@acme.com',
      passwordHash: hashedPassword,
      firstName: 'Emma',
      lastName: 'Instructor',
      role: 'INSTRUCTOR',
      emailVerified: true,
      departmentId: itDept.id,
      position: 'Security Trainer',
      phoneNumber: '+27 11 123 4570',
    },
  });

  // Regular Users
  const users = [];
  const departments = [itDept, hrDept, financeDept, salesDept, engineeringDept];
  const positions = [
    'Software Engineer',
    'Sales Representative',
    'Financial Analyst',
    'HR Specialist',
    'Security Analyst',
    'DevOps Engineer',
    'Product Manager',
    'Business Analyst',
  ];

  for (let i = 1; i <= 20; i++) {
    const dept = departments[i % departments.length];
    const position = positions[i % positions.length];

    const user = await prisma.user.upsert({
      where: {
        tenantId_email: {
          tenantId: tenant1.id,
          email: `user${i}@acme.com`,
        },
      },
      update: {},
      create: {
        tenantId: tenant1.id,
        email: `user${i}@acme.com`,
        passwordHash: hashedPassword,
        firstName: `User`,
        lastName: `${i}`,
        role: 'USER',
        emailVerified: true,
        departmentId: dept.id,
        position: position,
        phoneNumber: `+27 11 123 ${4570 + i}`,
      },
    });
    users.push(user);
  }

  console.log('✅ Created 24 users (1 super admin, 1 tenant admin, 1 manager, 1 instructor, 20 users)\n');

  // ============================================
  // 4. Create Custom Roles & Permissions
  // ============================================
  console.log('🔐 Creating permissions and custom roles...');

  const permissions = [
    { key: 'users.view', category: 'users', name: 'View Users', description: 'View user list and details' },
    { key: 'users.create', category: 'users', name: 'Create Users', description: 'Create new users' },
    { key: 'users.edit', category: 'users', name: 'Edit Users', description: 'Modify user information' },
    { key: 'users.delete', category: 'users', name: 'Delete Users', description: 'Delete users' },
    { key: 'courses.view', category: 'courses', name: 'View Courses', description: 'View course catalog' },
    { key: 'courses.create', category: 'courses', name: 'Create Courses', description: 'Create new courses' },
    { key: 'courses.edit', category: 'courses', name: 'Edit Courses', description: 'Modify courses' },
    { key: 'courses.assign', category: 'courses', name: 'Assign Courses', description: 'Assign courses to users' },
    { key: 'reports.view', category: 'reports', name: 'View Reports', description: 'View analytics and reports' },
    { key: 'reports.generate', category: 'reports', name: 'Generate Reports', description: 'Generate new reports' },
    { key: 'settings.manage', category: 'settings', name: 'Manage Settings', description: 'Manage system settings' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: perm,
    });
  }

  const customRole1 = await prisma.customRole.create({
    data: {
      tenantId: tenant1.id,
      name: 'Course Manager',
      description: 'Can manage courses and view reports',
      permissions: ['courses.view', 'courses.create', 'courses.edit', 'courses.assign', 'reports.view'],
      isSystem: false,
    },
  });

  const customRole2 = await prisma.customRole.create({
    data: {
      tenantId: tenant1.id,
      name: 'Report Viewer',
      description: 'Can only view reports and analytics',
      permissions: ['reports.view', 'courses.view'],
      isSystem: false,
    },
  });

  // Assign custom roles
  await prisma.userRole.create({
    data: {
      userId: users[0].id,
      roleId: customRole1.id,
      assignedBy: tenantAdmin.id,
    },
  });

  console.log('✅ Created 11 permissions and 2 custom roles\n');

  // ============================================
  // 5. Create Courses
  // ============================================
  console.log('📚 Creating courses...');

  const course1 = await prisma.course.create({
    data: {
      tenantId: tenant1.id,
      title: 'Introduction to Cybersecurity Awareness',
      description: 'Learn the fundamentals of cybersecurity awareness and best practices for staying safe online.',
      category: 'Security Basics',
      difficulty: 'BEGINNER',
      duration: 45,
      durationMinutes: 45,
      status: 'PUBLISHED',
      tags: ['security', 'awareness', 'basics'],
      passingScore: 80,
      complianceFrameworks: ['ISO27001'],
      createdBy: tenantAdmin.id,
      publishedAt: new Date(),
      modules: {
        create: [
          {
            title: 'Understanding Cyber Threats',
            description: 'Learn about common cyber threats and attack vectors',
            order: 1,
            chapters: {
              create: [
                {
                  title: 'Introduction to Cyber Threats',
                  content: 'Overview of modern cyber threats and their impact on organizations.',
                  order: 1,
                  duration: 10,
                },
                {
                  title: 'Common Attack Vectors',
                  content: 'Learn about phishing, malware, ransomware, and social engineering.',
                  order: 2,
                  duration: 15,
                },
              ],
            },
          },
          {
            title: 'Password Security',
            description: 'Best practices for creating and managing secure passwords',
            order: 2,
            chapters: {
              create: [
                {
                  title: 'Creating Strong Passwords',
                  content: 'Guidelines for creating secure, memorable passwords.',
                  order: 1,
                  duration: 10,
                },
                {
                  title: 'Password Managers',
                  content: 'How to use password managers effectively.',
                  order: 2,
                  duration: 10,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      tenantId: tenant1.id,
      title: 'Phishing Detection and Prevention',
      description: 'Advanced training on identifying and preventing phishing attacks.',
      category: 'Phishing',
      difficulty: 'INTERMEDIATE',
      duration: 60,
      durationMinutes: 60,
      status: 'PUBLISHED',
      tags: ['phishing', 'email', 'social-engineering'],
      passingScore: 85,
      complianceFrameworks: ['ISO27001'],
      createdBy: instructor.id,
      publishedAt: new Date(),
      modules: {
        create: [
          {
            title: 'Recognizing Phishing Emails',
            description: 'Learn to identify phishing attempts',
            order: 1,
            chapters: {
              create: [
                {
                  title: 'Red Flags in Emails',
                  content: 'Common indicators of phishing emails.',
                  order: 1,
                  duration: 15,
                },
                {
                  title: 'Analyzing Email Headers',
                  content: 'How to verify email authenticity.',
                  order: 2,
                  duration: 20,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      tenantId: tenant1.id,
      title: 'Data Protection and Privacy (GDPR)',
      description: 'Understanding data protection regulations and compliance requirements.',
      category: 'Compliance',
      difficulty: 'ADVANCED',
      duration: 90,
      durationMinutes: 90,
      status: 'PUBLISHED',
      tags: ['gdpr', 'compliance', 'privacy', 'data-protection'],
      passingScore: 90,
      complianceFrameworks: ['GDPR', 'ISO27001'],
      createdBy: instructor.id,
      publishedAt: new Date(),
      modules: {
        create: [
          {
            title: 'GDPR Fundamentals',
            description: 'Core principles of GDPR',
            order: 1,
            chapters: {
              create: [
                {
                  title: 'What is GDPR?',
                  content: 'Introduction to General Data Protection Regulation.',
                  order: 1,
                  duration: 30,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course4 = await prisma.course.create({
    data: {
      tenantId: tenant1.id,
      title: 'Incident Response and Management',
      description: 'Learn how to respond to and manage security incidents effectively.',
      category: 'Incident Response',
      difficulty: 'ADVANCED',
      duration: 120,
      durationMinutes: 120,
      status: 'PUBLISHED',
      tags: ['incident-response', 'security', 'management'],
      passingScore: 85,
      complianceFrameworks: ['NIST', 'ISO27001'],
      createdBy: instructor.id,
      publishedAt: new Date(),
    },
  });

  const course5 = await prisma.course.create({
    data: {
      tenantId: tenant1.id,
      title: 'Secure Coding Practices',
      description: 'Best practices for writing secure code and avoiding common vulnerabilities.',
      category: 'Development',
      difficulty: 'EXPERT',
      duration: 180,
      durationMinutes: 180,
      status: 'DRAFT',
      tags: ['coding', 'development', 'owasp', 'security'],
      passingScore: 80,
      prerequisites: [course1.id],
      createdBy: instructor.id,
    },
  });

  console.log('✅ Created 5 courses\n');

  // ============================================
  // 6. Create Quizzes
  // ============================================
  console.log('❓ Creating quizzes...');

  const quiz1 = await prisma.quiz.create({
    data: {
      courseId: course1.id,
      title: 'Cybersecurity Basics Quiz',
      description: 'Test your knowledge of cybersecurity fundamentals',
      passingScore: 80,
      timeLimit: 15,
      maxAttempts: 3,
      shuffleQuestions: true,
      questions: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'What is phishing?',
            options: {
              a: 'A type of fishing technique',
              b: 'A social engineering attack using fraudulent emails',
              c: 'A computer virus',
              d: 'A firewall technology',
            },
            correctAnswer: 'b',
            points: 1,
            order: 1,
            explanation: 'Phishing is a social engineering attack where attackers send fraudulent emails to trick victims into revealing sensitive information.',
          },
          {
            type: 'TRUE_FALSE',
            question: 'Using the same password for multiple accounts is a good security practice.',
            correctAnswer: 'false',
            points: 1,
            order: 2,
            explanation: 'Using unique passwords for each account prevents a single breach from compromising all your accounts.',
          },
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Which of the following is the strongest password?',
            options: {
              a: 'password123',
              b: 'MyP@ssw0rd',
              c: 'Tr0ub4dor&3',
              d: 'correct horse battery staple',
            },
            correctAnswer: 'd',
            points: 1,
            order: 3,
            explanation: 'Long passphrases with multiple words are generally stronger than shorter passwords with complexity requirements.',
          },
        ],
      },
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      courseId: course2.id,
      title: 'Phishing Recognition Test',
      description: 'Identify phishing attempts and learn prevention techniques',
      passingScore: 85,
      timeLimit: 20,
      maxAttempts: 2,
      questions: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Which of these is a common sign of a phishing email?',
            options: {
              a: 'Generic greeting like "Dear Customer"',
              b: 'Urgent language creating pressure',
              c: 'Suspicious sender email address',
              d: 'All of the above',
            },
            correctAnswer: 'd',
            points: 1,
            order: 1,
          },
          {
            type: 'TRUE_FALSE',
            question: 'Hovering over a link before clicking can help verify its legitimacy.',
            correctAnswer: 'true',
            points: 1,
            order: 2,
          },
        ],
      },
    },
  });

  console.log('✅ Created 2 quizzes\n');

  // ============================================
  // 7. Create Enrollments & Quiz Attempts
  // ============================================
  console.log('📝 Creating enrollments and quiz attempts...');

  const enrollmentStatuses: Array<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'> = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];

  for (const user of users) {
    // Enroll in course 1
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course1.id,
        tenantId: tenant1.id,
        progress: Math.floor(Math.random() * 100),
        status: enrollmentStatuses[Math.floor(Math.random() * 3)],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Some users completed quiz
    if (Math.random() > 0.5) {
      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          quizId: quiz1.id,
          score: 70 + Math.random() * 30,
          answers: { q1: 'b', q2: 'false', q3: 'd' },
          isPassing: Math.random() > 0.3,
        },
      });
    }
  }

  // Enroll some users in course 2
  for (let i = 0; i < 10; i++) {
    await prisma.enrollment.create({
      data: {
        userId: users[i].id,
        courseId: course2.id,
        tenantId: tenant1.id,
        progress: Math.floor(Math.random() * 60),
        status: enrollmentStatuses[Math.floor(Math.random() * 2)] as any,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Enroll advanced users in course 3
  for (let i = 0; i < 5; i++) {
    await prisma.enrollment.create({
      data: {
        userId: users[i].id,
        courseId: course3.id,
        tenantId: tenant1.id,
        progress: Math.floor(Math.random() * 40),
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Created 35 enrollments and quiz attempts\n');

  // ============================================
  // 8. Create Learning Paths
  // ============================================
  console.log('🛤️ Creating learning paths...');

  await prisma.learningPath.create({
    data: {
      tenantId: tenant1.id,
      title: 'Security Awareness Certification',
      description: 'Complete certification program for security awareness',
      isRequired: true,
      courses: {
        create: [
          { courseId: course1.id, order: 1, isRequired: true },
          { courseId: course2.id, order: 2, isRequired: true },
          { courseId: course3.id, order: 3, isRequired: false },
        ],
      },
    },
  });

  await prisma.learningPath.create({
    data: {
      tenantId: tenant1.id,
      title: 'Advanced Security Professional',
      description: 'Advanced security training for IT professionals',
      isRequired: false,
      courses: {
        create: [
          { courseId: course2.id, order: 1, isRequired: true },
          { courseId: course3.id, order: 2, isRequired: true },
          { courseId: course4.id, order: 3, isRequired: true },
        ],
      },
    },
  });

  console.log('✅ Created 2 learning paths\n');

  // ============================================
  // 9. Create Risk Scores
  // ============================================
  console.log('📊 Creating risk scores...');

  for (const user of users) {
    await prisma.riskScore.create({
      data: {
        userId: user.id,
        tenantId: tenant1.id,
        overallScore: 20 + Math.random() * 60,
        phishingScore: Math.random() * 100,
        trainingCompletionScore: Math.random() * 100,
        timeSinceTrainingScore: Math.random() * 100,
        quizPerformanceScore: Math.random() * 100,
        securityIncidentScore: Math.random() * 100,
        loginAnomalyScore: Math.random() * 100,
      },
    });
  }

  console.log('✅ Created 20 risk scores\n');

  // ============================================
  // 10. Create Phishing Simulations & Events
  // ============================================
  console.log('🎣 Creating phishing simulations and events...');

  for (let i = 0; i < 15; i++) {
    const user = users[i % users.length];
    const wasClicked = Math.random() > 0.6;
    const wasReported = Math.random() > 0.7;

    await prisma.phishingSimulation.create({
      data: {
        tenantId: tenant1.id,
        userId: user.id,
        campaignId: `campaign-2024-q${Math.floor(i / 5) + 1}`,
        emailSent: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        wasClicked,
        wasReported,
        clickedAt: wasClicked ? new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000) : null,
        reportedAt: wasReported ? new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000) : null,
      },
    });

    await prisma.phishingEvent.create({
      data: {
        tenantId: tenant1.id,
        userId: user.id,
        campaignId: `campaign-2024-q${Math.floor(i / 5) + 1}`,
        subject: 'Urgent: Account Verification Required',
        clicked: wasClicked,
        reported: wasReported,
        sentAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        clickedAt: wasClicked ? new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000) : null,
        reportedAt: wasReported ? new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000) : null,
        metadata: {
          template: 'banking-alert',
          difficulty: 'medium',
        },
      },
    });
  }

  console.log('✅ Created 15 phishing simulations and events\n');

  // ============================================
  // 11. Create Notifications & Templates
  // ============================================
  console.log('📧 Creating notification templates and notifications...');

  await prisma.notificationTemplate.createMany({
    data: [
      {
        tenantId: tenant1.id,
        name: 'Welcome Email',
        type: 'EMAIL',
        category: 'SYSTEM',
        subject: 'Welcome to {{tenantName}}',
        template: 'Hello {{firstName}}, welcome to our cybersecurity training platform!',
        variables: ['tenantName', 'firstName'],
      },
      {
        tenantId: tenant1.id,
        name: 'Course Completion',
        type: 'EMAIL',
        category: 'COURSE_COMPLETION',
        subject: 'Congratulations! Course Completed',
        template: 'You have successfully completed {{courseName}}. Your score: {{score}}%',
        variables: ['courseName', 'score'],
      },
      {
        name: 'Password Reset',
        type: 'EMAIL',
        category: 'SYSTEM',
        subject: 'Password Reset Request',
        template: 'Click here to reset your password: {{resetLink}}',
        variables: ['resetLink'],
      },
      {
        tenantId: tenant1.id,
        name: 'Training Reminder',
        type: 'EMAIL',
        category: 'TRAINING_REMINDER',
        subject: 'Training Due Soon',
        template: 'Your training "{{courseName}}" is due on {{dueDate}}',
        variables: ['courseName', 'dueDate'],
      },
    ],
  });

  // Create some notifications
  for (let i = 0; i < 5; i++) {
    await prisma.notification.create({
      data: {
        userId: users[i].id,
        tenantId: tenant1.id,
        type: 'EMAIL',
        category: 'COURSE_ENROLLMENT',
        priority: 'MEDIUM',
        status: 'SENT',
        title: 'New Course Assigned',
        message: 'You have been enrolled in a new cybersecurity training course.',
        read: Math.random() > 0.5,
        sentAt: new Date(),
      },
    });
  }

  // Create notification preferences
  for (const user of users.slice(0, 10)) {
    await prisma.notificationPreference.create({
      data: {
        userId: user.id,
        tenantId: tenant1.id,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        inAppEnabled: true,
        courseEnabled: true,
        complianceEnabled: true,
        securityEnabled: true,
        systemEnabled: true,
      },
    });
  }

  console.log('✅ Created 4 notification templates, 5 notifications, and 10 preferences\n');

  // ============================================
  // 12. Create Certificates
  // ============================================
  console.log('🏆 Creating certificates...');

  for (let i = 0; i < 5; i++) {
    await prisma.certificate.create({
      data: {
        tenantId: tenant1.id,
        userId: users[i].id,
        courseId: course1.id,
        title: 'Cybersecurity Awareness Certificate',
        description: 'Successfully completed Introduction to Cybersecurity Awareness',
        certificateUrl: `https://cdn.example.com/certificates/${users[i].id}-${course1.id}.pdf`,
        issuedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        metadata: {
          score: 85 + Math.random() * 15,
          completionDate: new Date().toISOString(),
        },
      },
    });
  }

  console.log('✅ Created 5 certificates\n');

  // ============================================
  // 13. Create Gamification Data
  // ============================================
  console.log('🎮 Creating gamification data...');

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        tenantId: tenant1.id,
        key: 'first_course_complete',
        name: 'First Steps',
        description: 'Complete your first training course',
        iconUrl: '/icons/first-course.svg',
        points: 100,
        tier: 'STARTER',
        category: 'completion',
        criteria: { type: 'course_completion', count: 1 },
      },
    }),
    prisma.achievement.create({
      data: {
        tenantId: tenant1.id,
        key: 'perfect_score',
        name: 'Perfect Score',
        description: 'Score 100% on a quiz',
        iconUrl: '/icons/perfect.svg',
        points: 200,
        tier: 'PROFESSIONAL',
        category: 'mastery',
        criteria: { type: 'quiz_score', minScore: 100 },
      },
    }),
    prisma.achievement.create({
      data: {
        tenantId: tenant1.id,
        key: 'phishing_hunter',
        name: 'Phishing Hunter',
        description: 'Report 5 phishing attempts',
        iconUrl: '/icons/hunter.svg',
        points: 150,
        tier: 'PROFESSIONAL',
        category: 'security',
        criteria: { type: 'phishing_reports', count: 5 },
      },
    }),
    prisma.achievement.create({
      data: {
        tenantId: tenant1.id,
        key: 'week_streak',
        name: 'Week Warrior',
        description: 'Login 7 days in a row',
        iconUrl: '/icons/streak.svg',
        points: 250,
        tier: 'ENTERPRISE',
        category: 'streak',
        criteria: { type: 'login_streak', days: 7 },
      },
    }),
  ]);

  // Award achievements to users
  for (let i = 0; i < 10; i++) {
    await prisma.userAchievement.create({
      data: {
        userId: users[i].id,
        achievementId: achievements[i % achievements.length].id,
        earnedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
        notified: true,
      },
    });
  }

  // Create user points
  for (const user of users) {
    await prisma.userPoints.create({
      data: {
        userId: user.id,
        tenantId: tenant1.id,
        totalPoints: Math.floor(Math.random() * 1000),
        currentStreak: Math.floor(Math.random() * 10),
        longestStreak: Math.floor(Math.random() * 15) + 5,
        lastActivityAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Create leaderboard entries
  const periods = ['daily', 'weekly', 'monthly', 'all-time'];
  for (const period of periods) {
    const sortedUsers = [...users]
      .map((user) => ({
        user,
        points: Math.floor(Math.random() * 1000),
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    for (let i = 0; i < sortedUsers.length; i++) {
      await prisma.leaderboard.create({
        data: {
          tenantId: tenant1.id,
          userId: sortedUsers[i].user.id,
          rank: i + 1,
          points: sortedUsers[i].points,
          period: period,
          date: new Date(),
        },
      });
    }
  }

  console.log('✅ Created 4 achievements, 10 user achievements, 20 user points, and leaderboard\n');

  // ============================================
  // 14. Create API Keys & Integrations
  // ============================================
  console.log('🔑 Creating API keys and integrations...');

  await prisma.apiKey.create({
    data: {
      userId: tenantAdmin.id,
      tenantId: tenant1.id,
      name: 'Production API Key',
      key: 'sk_live_' + Math.random().toString(36).substring(2, 15),
      isActive: true,
      permissions: {
        courses: ['read', 'write'],
        users: ['read'],
        reports: ['read'],
      },
    },
  });

  await prisma.webhook.create({
    data: {
      tenantId: tenant1.id,
      url: 'https://api.example.com/webhooks/cybersecurity',
      events: ['course.completed', 'user.enrolled', 'certificate.issued'],
      secret: 'whsec_' + Math.random().toString(36).substring(2, 15),
      status: 'ACTIVE',
      lastTriggeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      failureCount: 0,
    },
  });

  await prisma.integration.create({
    data: {
      tenantId: tenant1.id,
      type: 'SSO',
      name: 'Azure AD SSO',
      config: {
        clientId: 'azure-client-id',
        tenantId: 'azure-tenant-id',
        encrypted: true,
      },
      isActive: true,
      lastSyncAt: new Date(),
    },
  });

  console.log('✅ Created 1 API key, 1 webhook, and 1 integration\n');

  // ============================================
  // 15. Create Reports & Schedules
  // ============================================
  console.log('📊 Creating reports and schedules...');

  await prisma.report.create({
    data: {
      tenantId: tenant1.id,
      type: 'EXECUTIVE_DASHBOARD',
      title: 'Q4 2024 Executive Summary',
      description: 'Executive dashboard for Q4 2024',
      format: 'PDF',
      status: 'COMPLETED',
      fileUrl: 'https://cdn.example.com/reports/q4-2024-executive.pdf',
      fileSize: 2456789,
      filters: { quarter: 'Q4', year: 2024 },
      metadata: { generatedIn: '5.2s', pages: 15 },
      generatedBy: tenantAdmin.id,
      generatedAt: new Date(),
    },
  });

  await prisma.reportSchedule.create({
    data: {
      tenantId: tenant1.id,
      name: 'Weekly Training Report',
      description: 'Weekly summary of training progress',
      reportType: 'USER_PROGRESS',
      format: 'PDF',
      frequency: 'WEEKLY',
      dayOfWeek: 1, // Monday
      time: '09:00',
      recipients: ['admin@acme.com', 'manager@acme.com'],
      filters: { includeInactive: false },
      enabled: true,
      createdBy: tenantAdmin.id,
      nextRunAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.reportTemplate.create({
    data: {
      tenantId: tenant1.id,
      name: 'Compliance Report Template',
      description: 'Standard compliance reporting template',
      type: 'COMPLIANCE_REPORT',
      configuration: {
        sections: ['overview', 'training', 'phishing', 'incidents'],
        includeGraphs: true,
        includeRawData: false,
      },
      isDefault: true,
      createdBy: tenantAdmin.id,
    },
  });

  console.log('✅ Created 1 report, 1 schedule, and 1 template\n');

  // ============================================
  // 16. Create Subscription & Billing Data
  // ============================================
  console.log('💳 Creating subscription and billing data...');

  await prisma.subscriptionHistory.create({
    data: {
      tenantId: tenant1.id,
      previousPlan: 'PROFESSIONAL',
      newPlan: 'ENTERPRISE',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      amount: 9999.99,
      currency: 'ZAR',
      changeType: 'UPGRADE',
      changeReason: 'Need for advanced features',
    },
  });

  await prisma.usageMetrics.create({
    data: {
      tenantId: tenant1.id,
      month: new Date('2024-11-01'),
      activeUsers: 24,
      storageGB: 45.5,
      apiCalls: 15000,
      overage: {
        users: 0,
        storage: 0,
        apiCalls: 0,
      },
    },
  });

  // Create usage events
  const eventTypes = ['USER_LOGIN', 'COURSE_CREATED', 'API_CALL', 'STORAGE_UPLOAD'];
  for (let i = 0; i < 20; i++) {
    await prisma.usageEvent.create({
      data: {
        tenantId: tenant1.id,
        userId: users[i % users.length].id,
        metricType: eventTypes[i % eventTypes.length],
        metricValue: 1,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    });
  }

  await prisma.invoice.create({
    data: {
      tenantId: tenant1.id,
      invoiceNumber: 'INV-2024-001',
      amount: 9999.99,
      currency: 'ZAR',
      status: 'PAID',
      dueDate: new Date('2024-01-31'),
      paidAt: new Date('2024-01-15'),
      items: [
        { description: 'Enterprise Plan - Annual', quantity: 1, unitPrice: 9999.99, total: 9999.99 },
      ],
    },
  });

  console.log('✅ Created subscription history, usage metrics, events, and invoice\n');

  // ============================================
  // 17. Create System Alerts & Support Tickets
  // ============================================
  console.log('⚠️ Creating system alerts and support tickets...');

  await prisma.systemAlert.create({
    data: {
      type: 'WARNING',
      severity: 'MEDIUM',
      message: 'High API usage detected',
      source: 'api-gateway',
      metadata: {
        threshold: 10000,
        current: 15000,
      },
      resolved: true,
      resolvedAt: new Date(),
      resolvedBy: superAdmin.id,
    },
  });

  await prisma.systemAlert.create({
    data: {
      type: 'INFO',
      severity: 'LOW',
      message: 'Scheduled maintenance completed',
      source: 'maintenance-service',
      resolved: true,
    },
  });

  await prisma.supportTicket.create({
    data: {
      tenantId: tenant1.id,
      userId: users[0].id,
      subject: 'Cannot access course materials',
      description: 'I am unable to view the video content in the phishing detection course.',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      assignedTo: tenantAdmin.id,
      resolvedAt: new Date(),
      messages: {
        create: [
          {
            userId: users[0].id,
            message: 'I tried refreshing but still cannot see the videos.',
          },
          {
            userId: tenantAdmin.id,
            message: 'I have reset your access. Please try again.',
          },
        ],
      },
    },
  });

  await prisma.supportTicket.create({
    data: {
      tenantId: tenant1.id,
      userId: users[1].id,
      subject: 'Request for training extension',
      description: 'Can I get an extension on my GDPR training deadline?',
      status: 'OPEN',
      priority: 'LOW',
    },
  });

  console.log('✅ Created 2 system alerts and 2 support tickets\n');

  // ============================================
  // 18. Create Tenant Impersonation Logs
  // ============================================
  console.log('👤 Creating impersonation logs...');

  await prisma.tenantImpersonation.create({
    data: {
      superAdminId: superAdmin.id,
      tenantId: tenant1.id,
      reason: 'Customer support - investigating reported issue',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Created impersonation log\n');

  // ============================================
  // 19. Create Audit Logs
  // ============================================
  console.log('📝 Creating audit logs...');

  const actions = [
    { action: 'USER_LOGIN', resource: 'User' },
    { action: 'COURSE_CREATED', resource: 'Course' },
    { action: 'USER_ENROLLED', resource: 'Enrollment' },
    { action: 'CERTIFICATE_ISSUED', resource: 'Certificate' },
    { action: 'SETTINGS_UPDATED', resource: 'Tenant' },
  ];

  for (let i = 0; i < 10; i++) {
    const actionData = actions[i % actions.length];
    await prisma.auditLog.create({
      data: {
        userId: users[i % users.length].id,
        tenantId: tenant1.id,
        action: actionData.action,
        resource: actionData.resource,
        resourceId: Math.random().toString(36).substring(7),
        ipAddress: `192.168.1.${100 + i}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        metadata: {
          timestamp: new Date().toISOString(),
          details: `${actionData.action} performed`,
        },
      },
    });
  }

  console.log('✅ Created 10 audit logs\n');

  // ============================================
  // Summary
  // ============================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('✨ Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log('   • 3 Tenants');
  console.log('   • 5 Departments');
  console.log('   • 24 Users (1 super admin, 1 tenant admin, 1 manager, 1 instructor, 20 users)');
  console.log('   • 5 Courses with modules and chapters');
  console.log('   • 2 Quizzes with questions');
  console.log('   • 35+ Enrollments');
  console.log('   • 2 Learning Paths');
  console.log('   • 20 Risk Scores');
  console.log('   • 15 Phishing Simulations & Events');
  console.log('   • 5 Certificates');
  console.log('   • 4 Achievements');
  console.log('   • Gamification data (points, leaderboards)');
  console.log('   • API keys, webhooks, integrations');
  console.log('   • Reports and schedules');
  console.log('   • Subscription and billing data');
  console.log('   • System alerts and support tickets');
  console.log('   • Audit logs');
  console.log('═══════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
