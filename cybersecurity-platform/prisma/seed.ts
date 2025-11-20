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
      subscriptionPlan: 'ENTERPRISE',
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
      subscriptionPlan: 'TRIAL',
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
    },
  });

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
      department: 'IT Security',
      position: 'CISO',
    },
  });

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
      department: 'Human Resources',
      position: 'HR Manager',
    },
  });

  const users = [];
  for (let i = 1; i <= 10; i++) {
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
      description:
        'Learn the fundamentals of cybersecurity awareness and best practices for staying safe online.',
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
            explanation:
              'Phishing is a social engineering attack where attackers send fraudulent emails to trick victims into revealing sensitive information.',
          },
          {
            type: 'TRUE_FALSE',
            question: 'Using the same password for multiple accounts is a good security practice.',
            correctAnswer: 'false',
            points: 1,
            order: 2,
            explanation:
              'Using unique passwords for each account prevents a single breach from compromising all your accounts.',
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
            explanation:
              'Long passphrases with multiple words are generally stronger than shorter passwords with complexity requirements.',
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
        tenantId: tenant1.id,
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
        tenantId: tenant1.id,
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

  // ============================================
  // 10. Create Cybersecurity Compliance Training Manual
  // ============================================
  console.log('📖 Creating Cybersecurity Compliance Training Manual...');

  const cybersecurityCourse = await prisma.course.upsert({
    where: {
      // Note: We need a unique constraint on tenantId + title in production
      id: 'cybersecurity-manual-course',
    },
    update: {},
    create: {
      id: 'cybersecurity-manual-course',
      tenantId: tenant1.id,
      title: 'Cybersecurity and Information Compliance Training Manual',
      description:
        'Complete cybersecurity awareness training for South African government employees. Covers POPIA, Cybercrimes Act, email security, phishing detection, device safety, and incident response. Based on official government training materials.',
      category: 'Cybersecurity',
      difficulty: 'BEGINNER',
      duration: 600, // 10 hours
      durationMinutes: 600,
      status: 'PUBLISHED',
      isActive: true,
      tags: [
        'cybersecurity',
        'security-awareness',
        'popia',
        'compliance',
        'phishing',
        'data-protection',
        'south-africa',
        'government',
        'email-security',
        'device-safety',
        'incident-response',
      ],
      passingScore: 70,
      complianceFrameworks: ['ISO27001'],
      createdBy: tenantAdmin.id,
      publishedAt: new Date(),
      modules: {
        create: {
          title: 'Cybersecurity Training Manual',
          description:
            'Complete training manual covering all aspects of cybersecurity awareness for government employees',
          order: 1,
          chapters: {
            create: [
              {
                title: 'Chapter 1: Introduction - Why Cybersecurity Matters',
                content: `Government employees in South Africa handle sensitive information every day. Learn why cybersecurity is everyone's responsibility and how to protect citizen data.

Key Topics:
- Recent cyber attacks on SA government (GEPF ransomware, Dept of Defence breach)
- Your role in cybersecurity
- Overview of training content

Statistics: Over 70% of South Africans have been victims of cybercrime. Government sector is a prime target.`,
                duration: 30,
                order: 1,
                isRequired: true,
              },
              {
                title: 'Chapter 2: Common Threats - Know Your Enemy',
                content: `Understanding common cyber threats helps you recognize red flags in daily work.

1. Phishing (34% of incidents in Africa)
- Fraudulent messages to steal information
- Red flags: Generic greetings, misspelled URLs, urgent language

2. Malware & Ransomware
- Ransomware encrypts files and demands payment
- Example: Department of Justice hack (Sept 2021)

3. Weak Passwords
- Reused passwords compromise multiple accounts
- Use strong, unique passwords

4. Social Engineering
- Vishing (voice phishing), smishing (SMS)
- No legitimate IT staff asks for passwords

5. Insider Threats
- Accidental or malicious data exposure
- Handle data on need-to-know basis`,
                duration: 45,
                order: 2,
                isRequired: true,
              },
              {
                title: 'Chapter 3: Email Security - Outlook and Beyond',
                content: `Email is the top attack vector. Master these security practices:

Think Before You Click:
- Verify sender addresses carefully
- Check for unexpected content
- Contact sender via known channel

Phishing Red Flags:
- Misspellings and grammar errors
- Generic greetings ("Dear User")
- Mismatched URLs
- Urgent/threatening language

Handle Attachments Safely:
- Never open unexpected attachments
- Be careful with .zip, .exe files
- Never enable macros from unknown sources
- Use Protected View in Office

Business Email Compromise (BEC):
- Attackers impersonate executives
- Always verify unusual financial requests via phone

Professional Considerations:
- Use work email for work only
- Follow POPIA and PAIA guidelines
- Don't forward to personal accounts`,
                duration: 60,
                order: 3,
                isRequired: true,
              },
              {
                title: 'Chapter 4: Safe Browsing - Staying Secure on the Web',
                content: `Browse safely with these practices:

Browser Security:
- Keep browser updated for security patches
- Use HTTPS (look for padlock icon)
- Don't ignore certificate warnings

Search Wisely:
- Watch for SEO poisoning
- Verify official .gov.za domains
- Download only from trusted sources

Pop-ups and Ads:
- Don't click suspicious pop-ups
- Avoid "Your computer is infected" scams
- Enable pop-up blocker

Work-Related Browsing:
- Limit personal surfing on work devices
- Follow acceptable use policy
- Browsing may be monitored

Privacy:
- Don't enter sensitive data into unapproved forms
- Use official encrypted services
- Configure browser privacy settings`,
                duration: 50,
                order: 4,
                isRequired: true,
              },
              {
                title: 'Chapter 5: Device Safety - Securing Computers and Mobile Devices',
                content: `Protect your devices with these measures:

Secure Access:
- Always lock when not in use (Win+L)
- Use strong passwords/PINs
- Enable biometric locks with password backup

Keep Systems Updated:
- Apply Windows updates regularly
- Update all software promptly
- Don't ignore update prompts

Antivirus & Security:
- Ensure antivirus is running
- Don't disable scans
- Keep firewall active

Physical Security:
- Never leave laptop unattended
- Lock computer when leaving
- Use cable locks in shared spaces
- Be aware of shoulder surfers

Data Protection:
- Enable BitLocker disk encryption
- Use network drives for storage
- Regular backups protect against ransomware

Mobile Device Safety:
1. Strong PIN/biometric lock
2. Keep OS updated
3. Avoid unknown USB charging
4. Enable remote find/wipe
5. Install apps from official stores only`,
                duration: 70,
                order: 5,
                isRequired: true,
              },
              {
                title: 'Chapter 6: Wi-Fi and Network Security - Safe Connections',
                content: `Network security best practices:

Office Network:
- Use secure IT-managed Wi-Fi
- Don't bridge government and external networks

Home Wi-Fi:
- Change default router password
- Use WPA2/WPA3 encryption
- Never leave network open

Public Wi-Fi Dangers:
- Unsafe for sensitive activities
- Use VPN provided by work
- Stick to HTTPS websites
- Verify network name with venue

Mobile Hotspots:
- Safer than public Wi-Fi
- Use strong hotspot password
- Still use VPN for sensitive work

VPN and Remote Access:
- Use official VPN solutions
- Don't use unauthorized remote tools
- Disconnect VPN when done

Network Sharing:
- Turn off file sharing on public networks
- Set to "Public" network on untrusted connections`,
                duration: 55,
                order: 6,
                isRequired: true,
              },
              {
                title: 'Chapter 7: BYOD - Bring Your Own Device',
                content: `Using personal devices for work requires strict security:

Know the Policy:
- Check department's BYOD stance
- Some prohibit, others allow with conditions
- Follow security requirements

Separate Work Data:
- Use container apps (Outlook with Intune)
- Keep work in encrypted containers
- Don't save to personal cloud

Secure Your Device:
1. Keep OS/apps updated
2. Use strong device lock
3. Enable remote wipe
4. No jailbreaking/rooting

Lost or Stolen:
- Report immediately
- IT can remotely wipe work data
- Quick reporting prevents breach

Compliance:
- Understand MDM requirements
- Department can enforce controls
- Personal info should remain private

When in Doubt:
- Use dedicated work device
- Clear boundary between work/personal
- Better privacy protection`,
                duration: 50,
                order: 7,
                isRequired: true,
              },
              {
                title: 'Chapter 8: POPIA and Legal Compliance',
                content: `Understanding South African data protection laws:

POPIA (Protection of Personal Information Act):
- SA's data protection law (like GDPR)
- Covers any info about identifiable person
- Special personal info: race, health, religion, biometrics

POPIA Principles:
1. Minimization: Only collect what you need
2. Purpose: Use only for stated purpose
3. Security: Take appropriate measures (Section 19)
4. Retention: Don't keep longer than necessary
5. Transparency: People have right to know

POPIA Consequences:
- R5 million fine to Dept of Justice (2023)
- Must report breaches to Information Regulator
- Prison terms up to 10 years for serious offenses

Cybercrimes Act (2020):
- Criminalizes unauthorized access
- Criminalizes malware distribution
- Criminalizes identity theft
- Report incidents within 72 hours

Other Policies:
- MISS (Minimum Information Security Standards)
- PAIA (Promotion of Access to Information Act)
- Records Management Acts
- Departmental Information Security Policies

Your Responsibilities:
- Follow security protocols
- Handle personal info carefully
- Report breaches immediately
- Comply with data classification rules`,
                duration: 90,
                order: 8,
                isRequired: true,
              },
              {
                title: 'Chapter 9: Incident Reporting and Response',
                content: `How to respond to security incidents:

What is an Incident?
- Clicking phishing link
- Signs of malware
- Accidental email to wrong recipient
- Lost USB drive with data
- Unusual computer behavior

Report Immediately:
- Contact IT security or designated contact
- Don't delay due to embarrassment
- Fast reporting minimizes harm
- Human error is expected

Do Not Tamper:
- Don't "clean up" without guidance
- Files are evidence
- Transparency is key

Containment Actions:
- Ransomware → Disconnect from network
- Fake site → Change password immediately
- Lost device → Disable SIM, have IT disable accounts

Follow Response Plan:
- Provide detailed information
- Time, what you clicked, error messages
- Follow IT instructions

Incidents to Report:
1. Phishing scam (clicked or entered credentials)
2. Computer behaving oddly
3. Files encrypted or ransom note
4. Lost laptop/phone/USB with data
5. Sensitive data accidentally shared
6. Witnessing policy violations

Remember: It's not IF incidents happen, but WHEN. Don't be ashamed - be empowered to help respond properly.`,
                duration: 60,
                order: 9,
                isRequired: true,
              },
              {
                title: 'Chapter 10: Conclusion - Staying Vigilant',
                content: `Key takeaways and moving forward:

Cybersecurity is Everyone's Responsibility:
- You play a crucial part
- Human vigilance makes the difference
- You are a "human firewall"

Keep Security in Mind Daily:
- Strong passwords
- Watch for phishing
- Secure sites only
- Develop healthy skepticism

Stay Updated:
- Cyber landscape evolves quickly
- Take refresher trainings
- Share knowledge with colleagues
- Build culture of security awareness

Support is Available:
- IT department is here to help
- Information Security Officer available
- No "dumb questions" in security
- Always ask when unsure

Your Impact:
- Each employee practicing good hygiene lowers risk
- Citizens' data depends on you
- Breaches that didn't happen = your success

Thank You:
With knowledgeable and alert staff like you, we maintain public trust by safeguarding information and delivering secure services.

Contact: +27 81 492 5161
Address: Landmark West Building, 13 Umgazi Street, Menlo Park, Pretoria, 0081`,
                duration: 40,
                order: 10,
                isRequired: true,
              },
            ],
          },
        },
      },
    },
  });

  // Create comprehensive quizzes for each chapter
  const chapterQuizzes = [
    {
      title: 'Chapter 1 Quiz - Introduction',
      courseId: cybersecurityCourse.id,
      description: 'Test your understanding of cybersecurity importance',
      questions: [
        {
          type: 'MULTIPLE_CHOICE' as const,
          question: 'Why is cybersecurity awareness important for every government employee?',
          options: {
            a: 'Because only the IT department is responsible for security.',
            b: 'Because even non-technical staff can cause or prevent breaches by their actions.',
            c: 'Because cyber attacks only target personal devices, not government systems.',
            d: "It isn't important – technology will automatically protect us.",
          },
          correctAnswer: 'b',
          points: 1,
          order: 1,
          explanation:
            "Cybersecurity is everyone's responsibility. Even non-technical staff can cause or prevent breaches through their daily actions.",
        },
        {
          type: 'MULTIPLE_CHOICE' as const,
          question:
            'Which incident best illustrates the impact of a cyber attack on SA government?',
          options: {
            a: 'A national department had to shut down services for days due to ransomware.',
            b: 'A personal social media account was hacked.',
            c: "An employee's home computer got a virus with no effect on work.",
            d: 'A minor website typo was found.',
          },
          correctAnswer: 'a',
          points: 1,
          order: 2,
          explanation:
            'The GEPF ransomware attack in 2024 forced offices to close for six days, demonstrating severe impact.',
        },
      ],
    },
    {
      title: 'Chapter 2 Quiz - Common Threats',
      courseId: cybersecurityCourse.id,
      description: 'Identify and understand cyber threats',
      questions: [
        {
          type: 'MULTIPLE_CHOICE' as const,
          question: 'What is phishing?',
          options: {
            a: 'A technique to test network speeds.',
            b: 'A social engineering attack using fake emails to steal information.',
            c: 'A way of catching malware with antivirus.',
            d: 'Only a concern for online shoppers.',
          },
          correctAnswer: 'b',
          points: 1,
          order: 1,
          explanation:
            'Phishing uses fraudulent emails or messages to trick victims into revealing sensitive information.',
        },
        {
          type: 'MULTIPLE_CHOICE' as const,
          question: 'What makes ransomware especially disruptive for government offices?',
          options: {
            a: 'It encrypts files and halts access to important data until ransom is paid.',
            b: 'It only targets home computers.',
            c: 'It steals money directly from bank accounts.',
            d: 'It is easy to remove without backups.',
          },
          correctAnswer: 'a',
          points: 1,
          order: 2,
          explanation:
            'Ransomware encrypts files and prevents access to critical data, causing major service disruptions.',
        },
      ],
    },
    {
      title: 'Chapter 3 Quiz - Email Security',
      courseId: cybersecurityCourse.id,
      description: 'Master email security best practices',
      questions: [
        {
          type: 'MULTIPLE_CHOICE' as const,
          question:
            'You receive an email from unknown address claiming to be your bank. What should you do first?',
          options: {
            a: 'Click the link to verify quickly.',
            b: 'Delete immediately without thinking.',
            c: "Treat with caution – do not click, verify sender's identity by calling bank directly.",
            d: "Reply asking if it's legitimate.",
          },
          correctAnswer: 'c',
          points: 1,
          order: 1,
          explanation:
            'Never click links in unexpected emails. Always verify through official channels.',
        },
        {
          type: 'MULTIPLE_CHOICE' as const,
          question: 'Which is a red flag that an email might be phishing?',
          options: {
            a: 'Professional signature and recognizable sender.',
            b: 'Addresses you by name and relates to expected topic.',
            c: 'Contains spelling mistakes, urgent language, or asks for passwords.',
            d: 'From a colleague on a project.',
          },
          correctAnswer: 'c',
          points: 1,
          order: 2,
          explanation:
            'Phishing emails commonly have spelling errors, urgent language, and request sensitive information.',
        },
      ],
    },
    {
      title: 'Chapter 8 Quiz - POPIA & Legal Compliance',
      courseId: cybersecurityCourse.id,
      description: 'Understand legal compliance requirements',
      questions: [
        {
          type: 'MULTIPLE_CHOICE' as const,
          question: 'Which is considered personal information under POPIA?',
          options: {
            a: "A person's ID number and contact details.",
            b: "A person's race or health information.",
            c: "A company's registration number.",
            d: 'All of the above – personal info is broadly defined.',
          },
          correctAnswer: 'd',
          points: 1,
          order: 1,
          explanation:
            'POPIA broadly defines personal information including identifiers, sensitive data, and juristic person info.',
        },
        {
          type: 'MULTIPLE_CHOICE' as const,
          question: 'The Cybercrimes Act makes which of the following a criminal offense?',
          options: {
            a: "Hacking into someone's account without permission.",
            b: 'Sharing work documents with colleague for project.',
            c: 'Reporting phishing email to police.',
            d: 'Having anti-virus on your computer.',
          },
          correctAnswer: 'a',
          points: 1,
          order: 2,
          explanation:
            'The Cybercrimes Act criminalizes unauthorized access, malware distribution, and identity theft.',
        },
      ],
    },
  ];

  for (const quiz of chapterQuizzes) {
    await prisma.quiz.create({
      data: {
        courseId: quiz.courseId,
        title: quiz.title,
        description: quiz.description,
        passingScore: 70,
        timeLimit: 10,
        maxAttempts: 3,
        shuffleQuestions: true,
        showResults: true,
        questions: {
          create: quiz.questions,
        },
      },
    });
  }

  console.log(
    '✅ Created Cybersecurity Compliance Training Manual with 10 chapters and 4 quizzes\n',
  );

  // ============================================
  // 11. Create Departments
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

  console.log('✅ Created 3 departments\n');

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
