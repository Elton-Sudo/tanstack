import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

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
      status: 'ACTIVE',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      planType: 'ENTERPRISE',
      maxUsers: 1000,
      features: {
        sso: true,
        advancedAnalytics: true,
        customBranding: true,
        apiAccess: true,
      },
      settings: {
        passwordPolicy: {
          minLength: 12,
          requireUppercase: true,
          requireNumbers: true,
          requireSymbols: true,
        },
        mfaRequired: true,
      },
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'techstart-inc' },
    update: {},
    create: {
      name: 'TechStart Inc',
      slug: 'techstart-inc',
      status: 'TRIAL',
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      planType: 'TRIAL',
      maxUsers: 50,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      features: {
        sso: false,
        advancedAnalytics: false,
        customBranding: true,
        apiAccess: false,
      },
    },
  });

  console.log('✅ Created 2 tenants\n');

  // ============================================
  // 2. Create Users
  // ============================================
  console.log('👥 Creating users...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@platform.com' },
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
    },
  });

  const tenantAdmin = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      tenantId: tenant1.id,
      email: 'admin@acme.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Administrator',
      role: 'TENANT_ADMIN',
      emailVerified: true,
      department: 'IT Security',
      position: 'CISO',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@acme.com' },
    update: {},
    create: {
      tenantId: tenant1.id,
      email: 'manager@acme.com',
      passwordHash: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Manager',
      role: 'MANAGER',
      emailVerified: true,
      department: 'Human Resources',
      position: 'HR Manager',
    },
  });

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@acme.com` },
      update: {},
      create: {
        tenantId: tenant1.id,
        email: `user${i}@acme.com`,
        passwordHash: hashedPassword,
        firstName: `User`,
        lastName: `${i}`,
        role: 'USER',
        emailVerified: true,
        department: i % 2 === 0 ? 'Engineering' : 'Sales',
        position: i % 2 === 0 ? 'Software Engineer' : 'Sales Representative',
      },
    });
    users.push(user);
  }

  console.log('✅ Created 13 users\n');

  // ============================================
  // 3. Create Courses
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
      status: 'PUBLISHED',
      tags: ['security', 'awareness', 'basics'],
      passingScore: 80,
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
      status: 'PUBLISHED',
      tags: ['phishing', 'email', 'social-engineering'],
      passingScore: 85,
      createdBy: tenantAdmin.id,
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
      status: 'PUBLISHED',
      tags: ['gdpr', 'compliance', 'privacy', 'data-protection'],
      passingScore: 90,
      createdBy: tenantAdmin.id,
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

  console.log('✅ Created 3 courses\n');

  // ============================================
  // 4. Create Quizzes
  // ============================================
  console.log('❓ Creating quizzes...');

  await prisma.quiz.create({
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

  await prisma.quiz.create({
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
  // 5. Create Enrollments
  // ============================================
  console.log('📝 Creating enrollments...');

  // Enroll all users in course 1
  for (const user of users) {
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course1.id,
        progress: Math.floor(Math.random() * 100),
        status: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 3)] as any,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Enroll some users in course 2
  for (let i = 0; i < 5; i++) {
    await prisma.enrollment.create({
      data: {
        userId: users[i].id,
        courseId: course2.id,
        progress: Math.floor(Math.random() * 50),
        status: ['NOT_STARTED', 'IN_PROGRESS'][Math.floor(Math.random() * 2)] as any,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Created 15 enrollments\n');

  // ============================================
  // 6. Create Learning Path
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
          {
            courseId: course1.id,
            order: 1,
            isRequired: true,
          },
          {
            courseId: course2.id,
            order: 2,
            isRequired: true,
          },
          {
            courseId: course3.id,
            order: 3,
            isRequired: false,
          },
        ],
      },
    },
  });

  console.log('✅ Created 1 learning path\n');

  // ============================================
  // 7. Create Risk Scores
  // ============================================
  console.log('📊 Creating risk scores...');

  for (const user of users) {
    await prisma.riskScore.create({
      data: {
        userId: user.id,
        tenantId: tenant1.id,
        overallScore: Math.random() * 100,
        phishingScore: Math.random() * 100,
        trainingCompletionScore: Math.random() * 100,
        timeSinceTrainingScore: Math.random() * 100,
        quizPerformanceScore: Math.random() * 100,
        securityIncidentScore: Math.random() * 100,
        loginAnomalyScore: Math.random() * 100,
      },
    });
  }

  console.log('✅ Created 10 risk scores\n');

  // ============================================
  // 8. Create Notification Templates
  // ============================================
  console.log('📧 Creating notification templates...');

  await prisma.notificationTemplate.createMany({
    data: [
      {
        tenantId: tenant1.id,
        name: 'Welcome Email',
        type: 'EMAIL',
        subject: 'Welcome to {{tenantName}}',
        template: 'Hello {{firstName}}, welcome to our cybersecurity training platform!',
        variables: ['tenantName', 'firstName'],
      },
      {
        tenantId: tenant1.id,
        name: 'Course Completion',
        type: 'EMAIL',
        subject: 'Congratulations! Course Completed',
        template: 'You have successfully completed {{courseName}}. Your score: {{score}}%',
        variables: ['courseName', 'score'],
      },
      {
        name: 'Password Reset',
        type: 'EMAIL',
        subject: 'Password Reset Request',
        template: 'Click here to reset your password: {{resetLink}}',
        variables: ['resetLink'],
      },
    ],
  });

  console.log('✅ Created 3 notification templates\n');

  // ============================================
  // 9. Create Phishing Simulations
  // ============================================
  console.log('🎣 Creating phishing simulations...');

  for (let i = 0; i < 5; i++) {
    await prisma.phishingSimulation.create({
      data: {
        tenantId: tenant1.id,
        userId: users[i].id,
        campaignId: 'campaign-2024-q1',
        emailSent: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        wasClicked: Math.random() > 0.6,
        wasReported: Math.random() > 0.8,
        clickedAt: Math.random() > 0.6 ? new Date() : null,
        reportedAt: Math.random() > 0.8 ? new Date() : null,
      },
    });
  }

  console.log('✅ Created 5 phishing simulations\n');

  console.log('✨ Database seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
