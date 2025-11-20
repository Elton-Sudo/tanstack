import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService, EVENTS } from '@app/messaging';
import { Injectable } from '@nestjs/common';
import { CourseStatus, Difficulty } from '@prisma/client';

/**
 * Service for ingesting the South African Cybersecurity Training Manual content
 * into the platform's course structure
 */
@Injectable()
export class ContentIngestionService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Ingest the complete Cybersecurity Training Manual
   * Creates course, chapters, quizzes, and compliance mappings
   */
  async ingestCybersecurityManual(tenantId: string, createdBy: string) {
    this.logger.log('Starting Cybersecurity Manual ingestion', 'ContentIngestionService');

    const course = await this.createCybersecurityCourse(tenantId, createdBy);
    const chapters = await this.createChapters(course.id);
    const quizzes = await this.createQuizzes(course.id);

    await this.eventBus.publish(EVENTS.COURSE_CREATED, {
      courseId: course.id,
      title: course.title,
      tenantId: course.tenantId,
      chaptersCount: chapters.length,
      quizzesCount: quizzes.length,
      createdBy,
    });

    this.logger.log(
      `Cybersecurity Manual ingested successfully: ${chapters.length} chapters, ${quizzes.length} quizzes`,
      'ContentIngestionService',
    );

    return {
      course,
      chapters,
      quizzes,
    };
  }

  /**
   * Create the main cybersecurity awareness course
   */
  private async createCybersecurityCourse(tenantId: string, createdBy: string) {
    return await this.prisma.course.upsert({
      where: {
        tenantId_title: {
          tenantId,
          title: 'Cybersecurity and Information Compliance Training',
        },
      },
      update: {},
      create: {
        tenantId,
        title: 'Cybersecurity and Information Compliance Training',
        description:
          'Comprehensive cybersecurity awareness training for South African government employees. Learn to identify threats, protect sensitive data, and comply with POPIA and Cybercrimes Act.',
        category: 'Cybersecurity',
        difficulty: Difficulty.BEGINNER,
        duration: 600, // 10 hours total
        durationMinutes: 600,
        status: CourseStatus.PUBLISHED,
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
        ],
        passingScore: 70,
        complianceFrameworks: ['ISO27001'],
        createdBy,
        publishedAt: new Date(),
      },
    });
  }

  /**
   * Create all 10 chapters from the training manual
   */
  private async createChapters(courseId: string) {
    const chapters = [
      {
        title: 'Chapter 1: Introduction - Why Cybersecurity Matters',
        content: this.getChapter1Content(),
        duration: 30,
        order: 1,
      },
      {
        title: 'Chapter 2: Common Threats - Know Your Enemy',
        content: this.getChapter2Content(),
        duration: 45,
        order: 2,
      },
      {
        title: 'Chapter 3: Email Security - Outlook and Beyond',
        content: this.getChapter3Content(),
        duration: 60,
        order: 3,
      },
      {
        title: 'Chapter 4: Safe Browsing - Staying Secure on the Web',
        content: this.getChapter4Content(),
        duration: 50,
        order: 4,
      },
      {
        title: 'Chapter 5: Device Safety - Securing Your Computers and Mobile Devices',
        content: this.getChapter5Content(),
        duration: 70,
        order: 5,
      },
      {
        title: 'Chapter 6: Wi-Fi and Network Security - Safe Connections',
        content: this.getChapter6Content(),
        duration: 55,
        order: 6,
      },
      {
        title: 'Chapter 7: BYOD - Bring Your Own Device',
        content: this.getChapter7Content(),
        duration: 50,
        order: 7,
      },
      {
        title: 'Chapter 8: POPIA and Legal Compliance',
        content: this.getChapter8Content(),
        duration: 90,
        order: 8,
      },
      {
        title: 'Chapter 9: Incident Reporting and Response',
        content: this.getChapter9Content(),
        duration: 60,
        order: 9,
      },
      {
        title: 'Chapter 10: Conclusion - Staying Vigilant',
        content: this.getChapter10Content(),
        duration: 40,
        order: 10,
      },
    ];

    // Create a single module to contain all chapters
    const module = await this.prisma.module.create({
      data: {
        courseId,
        title: 'Cybersecurity Training Manual',
        description: 'Complete training manual covering all aspects of cybersecurity awareness',
        order: 1,
      },
    });

    // Create all chapters
    const createdChapters = [];
    for (const chapter of chapters) {
      const created = await this.prisma.chapter.create({
        data: {
          moduleId: module.id,
          title: chapter.title,
          content: chapter.content,
          duration: chapter.duration,
          order: chapter.order,
          isRequired: true,
        },
      });
      createdChapters.push(created);
    }

    return createdChapters;
  }

  /**
   * Create quizzes for each chapter
   */
  private async createQuizzes(courseId: string) {
    const quizzes = [
      {
        title: 'Chapter 1 Quiz - Introduction',
        description: 'Test your understanding of cybersecurity importance',
        questions: this.getChapter1QuizQuestions(),
      },
      {
        title: 'Chapter 2 Quiz - Common Threats',
        description: 'Identify and understand cyber threats',
        questions: this.getChapter2QuizQuestions(),
      },
      {
        title: 'Chapter 3 Quiz - Email Security',
        description: 'Master email security best practices',
        questions: this.getChapter3QuizQuestions(),
      },
      {
        title: 'Chapter 4 Quiz - Safe Browsing',
        description: 'Learn safe web browsing techniques',
        questions: this.getChapter4QuizQuestions(),
      },
      {
        title: 'Chapter 5 Quiz - Device Safety',
        description: 'Secure your devices properly',
        questions: this.getChapter5QuizQuestions(),
      },
      {
        title: 'Chapter 6 Quiz - Wi-Fi and Network Security',
        description: 'Understand network security fundamentals',
        questions: this.getChapter6QuizQuestions(),
      },
      {
        title: 'Chapter 7 Quiz - BYOD',
        description: 'Learn BYOD security practices',
        questions: this.getChapter7QuizQuestions(),
      },
      {
        title: 'Chapter 8 Quiz - POPIA & Legal Compliance',
        description: 'Understand legal compliance requirements',
        questions: this.getChapter8QuizQuestions(),
      },
      {
        title: 'Chapter 9 Quiz - Incident Reporting',
        description: 'Master incident response procedures',
        questions: this.getChapter9QuizQuestions(),
      },
      {
        title: 'Chapter 10 Quiz - Conclusion',
        description: 'Final assessment of your learning',
        questions: this.getChapter10QuizQuestions(),
      },
    ];

    const createdQuizzes = [];
    for (const quiz of quizzes) {
      const created = await this.prisma.quiz.create({
        data: {
          courseId,
          title: quiz.title,
          description: quiz.description,
          passingScore: 70,
          timeLimit: 15,
          maxAttempts: 3,
          shuffleQuestions: true,
          showResults: true,
          questions: {
            create: quiz.questions,
          },
        },
      });
      createdQuizzes.push(created);
    }

    return createdQuizzes;
  }

  // Chapter content methods
  private getChapter1Content(): string {
    return `# Why Cybersecurity Matters

Government employees in South Africa handle sensitive information every day – from citizen data and financial records to confidential policy documents. In recent years, cyber attacks on public institutions have risen sharply, underscoring the need for vigilance.

## Key Statistics

- South Africa remains a top target for cybercrime, particularly in the government sector
- Over 70% of South Africans have been victims of some form of cybercrime
- In 2024, the Government Employees Pension Fund (GEPF) was hit by ransomware, forcing offices to close for six days
- The Department of Defence lost 1.6 terabytes of data including the President's contact details

## Your Role

Cybersecurity is everyone's responsibility – whether you're in IT or not. By learning safe practices and understanding compliance requirements, you become a crucial line of defense to protect citizens' data and keep government services running.

## What You'll Learn

This training will guide you through:
- Common threats and how to spot them
- Safe email, browsing, and device practices
- POPIA and Cybercrimes Act compliance
- Incident reporting procedures
- Real-world examples from South African public sector`;
  }

  private getChapter2Content(): string {
    return `# Common Threats - Know Your Enemy

Understanding the most common cyber threats will help you recognize red flags in your daily work.

## 1. Phishing

Phishing is the #1 cyber threat in Africa (34% of incidents). It involves fraudulent messages that trick you into revealing information or downloading malware.

**Red Flags:**
- Generic greetings ("Dear User")
- Misspelled URLs or email addresses
- Urgent or threatening language
- Unexpected requests for credentials or money

## 2. Malware & Ransomware

Malicious software designed to harm or exploit devices. Ransomware encrypts your files and demands payment.

**Example:** Department of Justice hack (September 2021) - ransomware locked officials out of critical systems.

**Protection:**
- Never open attachments from untrusted sources
- Keep security software updated
- Be cautious with USB drives

## 3. Weak Passwords

Using weak or reused passwords is a major risk. If attackers obtain one password, they can access multiple accounts.

**Best Practices:**
- Use strong, unique passwords for each account
- Use password managers
- Enable multi-factor authentication

## 4. Social Engineering

Exploiting human trust to break security rules. Includes vishing (voice phishing) and smishing (SMS phishing).

**Remember:** No legitimate IT staffer will ever ask for your password over phone or email.

## 5. Insider Threats

Could be malicious (employee abusing access) or accidental (clicking something harmful).

**Key Point:** Handle sensitive data on a need-to-know basis and report suspicious behavior.`;
  }

  private getChapter3Content(): string {
    return `# Email Security - Outlook and Beyond

Email is the top way cyber criminals reach us. Here's how to stay safe.

## Think Before You Click

Treat every email with healthy suspicion. Before clicking links or opening attachments:
- Verify the sender's address closely
- Check for unexpected or odd content
- Contact sender via known channel to confirm

## Phishing Red Flags

Look for:
- Misspellings and grammar errors
- Generic greetings
- Mismatched URLs
- Urgent/threatening language
- Unexpected requests for information

## Handle Attachments Safely

- Never open unexpected attachments
- Be careful with .zip, .exe files
- Never enable macros from unknown sources
- Use Protected View in Office documents
- Consider using cloud storage links instead

## Protect Your Account

- Use strong, unique password
- Enable multi-factor authentication (MFA)
- Never share your password
- Avoid logging in on public computers
- Beware of fake login pages

## Business Email Compromise (BEC)

Attackers impersonate senior officials to authorize fake transfers or data sharing.

**Action:** Always verify unusual requests from executives via phone, especially involving money or confidential data.

## Professional Considerations

- Use work email for work only
- Don't forward official emails to personal accounts
- Follow departmental email policies
- Mark confidential emails appropriately
- Follow POPIA and PAIA guidelines`;
  }

  private getChapter4Content(): string {
    return `# Safe Browsing - Staying Secure on the Web

Using the internet safely is essential for daily work.

## Keep Your Browser Updated

- Use latest browser version for security patches
- Enable automatic updates
- Use built-in security features

## Use HTTPS and Secure Connections

- Ensure URLs begin with https://
- Look for padlock icon in address bar
- Don't proceed past certificate warnings
- Manually type addresses for sensitive sites

## Search Wisely

- Be cautious about which results you click
- Watch for SEO poisoning (malicious sites in results)
- Verify official .gov.za domains
- Download only from trusted sources

## Beware of Pop-ups and Advertising

- Don't click suspicious pop-up ads
- Avoid "Your computer is infected" scare tactics
- Enable browser pop-up blocker
- Never download from unexpected pop-ups

## Stick to Work-Related Browsing

- Limit personal surfing on work computers
- Follow acceptable use policy
- Remember browsing may be monitored/logged

## Privacy and Sensitive Data

- Don't enter sensitive data into unapproved web forms
- Use official encrypted services
- Configure privacy settings in browser
- Disable unnecessary extensions

## Recognize Unsafe Websites

- Watch for browser warning screens
- Check for professional, legitimate content
- Enable Safe Search features
- Trust your instincts

## Logging In and Out

- Log out when done on shared computers
- Don't save passwords in browser on shared devices
- Use incognito/private mode on public computers`;
  }

  private getChapter5Content(): string {
    return `# Device Safety - Securing Your Computers and Mobile Devices

Your work devices are prime targets for attackers. Here's how to protect them.

## Secure Access to Your Device

- Always lock when not in use (Win+L on Windows)
- Set automatic screen lock (5-10 minutes)
- Use strong passwords or PINs
- Use biometric locks with password backup
- Never share your login credentials

## Keep Systems Updated and Patched

- Apply Windows updates regularly
- Update Microsoft Office and other software
- Don't ignore update prompts
- Let IT manage centralized updates

## Antivirus and Security Software

- Ensure antivirus is running and updated
- Check system tray for security status
- Don't disable or cancel scans
- Pay attention to suspicious behavior warnings
- Keep firewall active

## Avoid Unverified Software and Devices

- Only install IT-approved software
- Don't use unapproved USB drives
- Scan external drives before use
- Avoid downloading unauthorized tools

## Physical Security of Devices

- Never leave laptop unattended in public
- Lock computer when leaving for the day
- Use cable locks in shared environments
- Don't leave devices in cars
- Be aware of shoulder surfers in public

## Data Encryption

- Enable BitLocker or similar disk encryption
- Don't disable encryption features
- Use network drives or secure cloud storage
- Encrypt sensitive local files

## Backups

- Save important data to network drives
- Use OneDrive/SharePoint for backups
- Regular backups protect against ransomware
- Follow departmental backup procedures

## Mobile Device Safety

1. Use strong PIN or biometric lock
2. Keep OS updated
3. Avoid unknown USB charging ports
4. Separate work and personal data
5. Enable remote find/wipe features
6. Install only reputable apps from official stores
7. Review app permissions carefully`;
  }

  private getChapter6Content(): string {
    return `# Wi-Fi and Network Security - Safe Connections

How you connect to networks can introduce risks.

## Office Network vs External Networks

- Stick to secure, IT-managed office Wi-Fi
- Don't connect to unknown networks
- Don't bridge government and external networks simultaneously

## Home Wi-Fi Security

- Change default router password
- Use WPA2 or WPA3 encryption
- Never leave network open (no password)
- Change network name (SSID) to something neutral
- Position router securely

## Public Wi-Fi Dangers

Free Wi-Fi at airports, cafes, hotels is unsafe for sensitive activities.

**Risks:**
- Attackers can intercept traffic
- Session cookie theft
- Rogue hotspots that look legitimate

**Protection:**
- Avoid work logins on public Wi-Fi
- Use VPN provided by work
- Stick to HTTPS websites
- Verify exact network name with venue

## Mobile Hotspots

- Safer than unknown public Wi-Fi
- Use strong hotspot password
- Cellular data is encrypted
- Still use VPN for very sensitive systems

## Network Etiquette and Policy

- Follow departmental network policies
- Use separate guest Wi-Fi for personal devices
- Respect network segmentation rules
- Ask IT before connecting personal devices

## VPN and Remote Access

- Use official VPN or remote desktop solutions
- Don't use unauthorized remote access tools
- Disconnect VPN when done with work
- Follow DPSA remote access requirements

## Email and Wi-Fi

- Ensure email uses encryption (Outlook/Exchange default)
- Wait for secure network for sensitive attachments
- POPIA requires protection of data in transit

## Network Sharing Features

- Turn off file sharing on public networks
- Disable AirDrop on public networks
- Set network location to "Public" on untrusted networks
- Only share on trusted home/office networks`;
  }

  private getChapter7Content(): string {
    return `# BYOD (Bring Your Own Device) - Personal Devices and Work

Using personal devices for work requires careful security practices.

## Know the Policy

- Find out your department's BYOD stance
- Some prohibit BYOD entirely
- Others allow with conditions (MDM enrollment, agreements)
- Follow security requirements

## Separate Work Data on Your Device

- Use container apps (Outlook with Intune)
- Keep work email/contacts in encrypted container
- Don't save work files to personal cloud services
- Avoid mingling work and personal data

## Be Wary of Apps and Services

- Avoid sketchy apps
- Give minimal permissions to apps
- Don't use random third-party email apps
- Stick to official app stores

## Secure Your Personal Device

1. Keep OS and apps updated
2. Install reputable security software
3. Use strong device lock with auto-lock
4. Enable remote wipe capability
5. Accept MDM policies if required

## No Jailbreaking/Rooting

- Don't jailbreak (iPhone) or root (Android)
- These remove built-in security controls
- MDM solutions block jailbroken/rooted devices
- Against policy for work use

## Network and Access for BYOD

- Follow network guidelines from Chapter 6
- Use specific Wi-Fi for personal devices
- Use official VPN/portal for remote access
- Don't email yourself work files

## Lost or Stolen Personal Device

- Report immediately like any work device
- IT can remotely wipe work data
- Quick reporting prevents data breach
- Failure to report can lead to serious issues

## Compliance and Privacy

- Understand MDM requirements
- Work data subject to work rules
- Department can enforce security controls
- Personal info should remain private
- Keep personal and work separated

## When in Doubt, Use a Work Device

- Consider using dedicated work devices
- Clear boundary between work and personal
- Simpler compliance
- Better privacy protection
- Many employees prefer this approach`;
  }

  private getChapter8Content(): string {
    return `# POPIA and Legal Compliance - Protecting Information and Abiding by the Law

South African government employees must adhere to several laws governing information security and privacy.

## Protection of Personal Information Act (POPIA)

POPIA is South Africa's data protection law (similar to GDPR).

### What is Personal Information?

- Any information about an identifiable person
- Name, ID number, email, phone
- IP addresses, employment records
- Special personal information: race, health, religion, biometrics, criminal records

### POPIA Principles

1. **Minimization:** Only collect what you need
2. **Purpose:** Use only for stated purpose
3. **Security:** Take appropriate measures (Section 19)
4. **Retention:** Don't keep longer than necessary
5. **Transparency:** People have right to know what you have

### POPIA Consequences

- Information Regulator can issue penalties
- R5 million fine to Dept of Justice (2023) for failing to renew security software
- Must report breaches to Regulator and affected individuals
- Prison terms up to 10 years for serious offenses

### Your POPIA Responsibilities

- Collect minimum, secure maximum
- Use only as agreed
- Dispose when done
- Follow data handling procedures
- Report suspected breaches immediately

## Cybercrimes Act (2020)

### Key Provisions

1. Criminalizes unauthorized access to systems/data
2. Criminalizes malware distribution and phishing
3. Criminalizes identity theft and online impersonation
4. Requires certain institutions to report cyber incidents within 72 hours

### What This Means for You

- Don't access systems without authorization
- No "poking around" out of curiosity
- Using someone else's login is a crime
- Report attacks to help investigations
- Cooperate with law enforcement

## Other Government Policies

### Minimum Information Security Standards (MISS)

- Classification of government information
- Confidential, Secret classifications
- Physical security requirements
- Handle marked documents with extra care

### PAIA (Promotion of Access to Information Act)

- Transparency in government operations
- Records can be requested by citizens
- Keep records in order
- Balance with POPIA (don't release personal data improperly)

### Records Management Acts

- National Archives Act requirements
- Proper disposal procedures
- Shred sensitive documents (cross-cut)
- Don't delete official records improperly

### Information Security Policies

- Every department has security policy
- Employees sign acknowledgment
- Covers: passwords, internet use, email, incidents
- Common rules: no unauthorized software, no rogue Wi-Fi, no copying to personal devices

## Disciplinary and Legal Consequences

- Internal disciplinary action possible
- Job loss for serious violations
- Criminal charges under Cybercrimes Act
- POPIA prison terms for offenses
- Selling personal information is serious crime
- Obstructing the Regulator is offense

## Compliance is Part of Your Job

- Following best practices = legal compliance
- Security measures fulfill POPIA Section 19
- Training employees is required organizational measure
- Reporting incidents is DPSA directive requirement
- When in doubt, ask Information Officer or supervisor`;
  }

  private getChapter9Content(): string {
    return `# Incident Reporting and Response - Don't Panic, Do Act

A quick, effective response can contain damage and meet compliance obligations.

## What is an Incident?

An incident could be:
- Clicking a phishing link
- Signs of malware on computer
- Accidental email to wrong recipient
- Lost USB drive with data
- Unusual computer behavior
- Noticing someone else's risky behavior

**Rule:** If it seems like a cybersecurity or data protection issue, treat it as an incident.

## Report Immediately

- Report to IT security or designated contact
- Don't delay due to embarrassment
- Don't try to fix it yourself
- Fast reporting minimizes harm
- Example: Phishing click → IT resets credentials, scans PC, alerts others

## Do Not Tamper or Hide Information

- Don't "clean up" without guidance
- Files are evidence
- Don't factory reset stolen devices before investigation
- Transparency is key
- Human error is expected, hiding makes it worse

## Immediate Containment Actions

If safe to do so:
- Ransomware detected → Disconnect from network
- Password entered on fake site → Change password immediately
- Lost device → Call provider to disable SIM, have IT disable accounts
- Only do what you're comfortable with
- When unsure, isolate device and wait for instructions

## Follow the Incident Response Plan

- Department has incident response plan
- Follow instructions from IT security
- They may ask you to:
  - Disconnect device
  - Run scan
  - Take screenshots
  - Fill out incident report form
- Provide detailed information: time, what you clicked, error messages

## Notify Supervisors if Needed

- Severe incidents may need manager notification
- Management handles POPIA notifications if personal data compromised
- IT security handles escalation to higher-ups
- Cybersecurity Hub (national CSIRT) may be engaged
- Your job: ensure right people know quickly

## Do Not Publicly Disclose or Gossip

- Don't post on social media about incidents
- Don't speculate widely via email
- Contain information to official channels
- Premature disclosure can cause panic
- Can tip off attackers
- Legal ramifications possible

## Learn and Improve

- After incident, attend debrief
- Pay attention to follow-up training
- Use mistakes as learning experiences
- Organization may update procedures
- Example improvements: phishing tests, encryption requirements
- Embrace security improvements

## Incidents to Report

1. Falling for phishing scam
2. Computer behaving oddly (malware signs)
3. Files encrypted or ransom note
4. Unusual/fraudulent request received
5. Lost laptop, smartphone, ID card, or work device
6. Sensitive papers missing or in wrong hands
7. Accidentally emailed sensitive info to wrong person
8. USB drive with data lost
9. Witnessing policy violation that could lead to breach

## Remember

- Reporting aligns with policy and laws
- POPIA and Cybercrimes Act benefit from quick reporting
- Law enforcement can only act if they know in time
- It's not IF incidents happen, but WHEN
- Don't feel ashamed - feel empowered
- You're helping organization respond properly`;
  }

  private getChapter10Content(): string {
    return `# Conclusion - Staying Vigilant and Continuing the Journey

Congratulations on completing this comprehensive training manual!

## Key Takeaways

### Cybersecurity is Everyone's Responsibility

- No matter your role, you play a part
- Technology alone can't stop all breaches
- Human vigilance makes the difference
- Think twice before clicking
- Promptly report strange activity
- You are a "human firewall"

### Keep Security in Mind Daily

- Security isn't a checklist, it's a mindset
- Remember strong passwords
- Watch for phishing red flags
- Stick to secure sites
- Think about where files are stored
- Develop healthy skepticism
- With practice, it becomes second nature

### Stay Updated and Keep Learning

- Cyber landscape evolves quickly
- New scams, malware, and policies emerge
- Take refresher trainings
- Read awareness newsletters
- Check Cybersecurity Hub resources
- Share knowledge with colleagues
- Build culture of security awareness

### Empowerment Over Fear

- Goal is to empower, not scare
- Threats are real, but you have the tools
- Think of it like defensive driving
- You know how to navigate safely
- You know response steps if something happens
- Embrace security as part of professionalism

### Support is Available

- You're not alone
- IT department is here to help
- Information Security Officer available
- Colleagues are in this together
- Ask questions when unsure
- No "dumb questions" in security
- Leadership backs cybersecurity priority

### Thank You for Doing Your Part

- Each employee practicing good hygiene lowers risk significantly
- Government data is like a vast vault
- IT sets up defenses, but you hold the keys
- Thanks for keeping your key safe
- Citizens may never know about breaches that didn't happen
- That's the unsung heroism of public sector cybersecurity

## Moving Forward

- Commit to making cybersecurity routine
- Encourage your team
- Celebrate when you catch a phish
- Approach incidents calmly
- Follow your training
- Stay safe, stay secure
- Keep information protected

## Final Thought

With knowledgeable and alert staff like you, we can ensure that our department – and the government at large – maintains the trust of the public by safeguarding their information and delivering services without disruption.

**Thank you for reading, and keep up the great work in being cyber secure!**

---

*Contact Information:*
**Phone:** +27 81 492 5161
**Address:** Landmark West Building, 13 Umgazi Street, Menlo Park, Pretoria, 0081`;
  }

  // Quiz question methods
  private getChapter1QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
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
          "Cybersecurity is everyone's responsibility. Even non-technical staff can cause or prevent breaches through their daily actions and decisions.",
      },
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'Which of the following incidents best illustrates the impact of a cyber attack on a South African government institution?',
        options: {
          a: 'A national department had to shut down services for days due to ransomware.',
          b: 'A personal social media account was hacked.',
          c: "An employee's home computer got a virus with no effect on work.",
          d: 'A minor website typo was found on a government page.',
        },
        correctAnswer: 'a',
        points: 1,
        order: 2,
        explanation:
          'The GEPF ransomware attack in 2024 forced offices to close for six days, demonstrating the severe real-world impact of cyber attacks on government services.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'What is the Protection of Personal Information Act (POPIA)?',
        options: {
          a: 'A policy that mandates how the government purchases IT equipment.',
          b: "South Africa's data protection law that requires safe handling of personal information.",
          c: 'A guideline for creating strong passwords.',
          d: 'An international agreement on cybersecurity cooperation.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 3,
        explanation:
          "POPIA is South Africa's data protection law that requires organizations to handle personal information lawfully and securely.",
      },
    ];
  }

  private getChapter2QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question: 'Phishing is:',
        options: {
          a: 'A technique to test network speeds on Wi-Fi.',
          b: 'A social engineering attack using fake emails or messages to steal information.',
          c: 'A way of catching malware using antivirus software.',
          d: 'Only a concern for people who shop online.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 1,
        explanation:
          'Phishing is a social engineering attack that uses fraudulent emails or messages to trick victims into revealing sensitive information or downloading malware.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'Which of the following is not an example of social engineering?',
        options: {
          a: 'An email that tricks you into clicking a malicious link.',
          b: 'A hacker exploiting an unpatched software vulnerability without contacting a user.',
          c: 'A phone call pretending to be IT support asking for your login details.',
          d: 'Someone posing as a delivery person to enter a secure office.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 2,
        explanation:
          "Social engineering relies on human interaction and manipulation. Exploiting a software vulnerability is a technical attack that doesn't involve tricking people.",
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'What makes ransomware especially disruptive for government offices?',
        options: {
          a: 'It encrypts files and can halt access to important data until a ransom is paid.',
          b: 'It only targets home computers, not office networks.',
          c: 'It steals money directly from bank accounts.',
          d: 'It is easy to remove without backups.',
        },
        correctAnswer: 'a',
        points: 1,
        order: 3,
        explanation:
          'Ransomware encrypts files and prevents access to critical data and systems until a ransom is paid, causing major service disruptions.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'Why are weak or reused passwords a security risk?',
        options: {
          a: 'They are harder for employees to remember.',
          b: 'Attackers can guess or crack common passwords and reuse leaked passwords to access other accounts.',
          c: 'Strong passwords attract more hacker attention.',
          d: 'Changing passwords frequently makes hacking easier.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 4,
        explanation:
          'Weak passwords can be easily guessed or cracked. Reused passwords mean that if one account is breached, attackers can access all accounts using the same password.',
      },
    ];
  }

  private getChapter3QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'You receive an email from an unknown address claiming to be your bank, asking you to click a link to verify your account. What should you do first?',
        options: {
          a: 'Click the link to verify quickly, then inform IT.',
          b: 'Delete the email immediately without thinking.',
          c: "Treat it with caution – do not click the link, verify the sender's identity (e.g., call your bank directly).",
          d: "Reply to the email asking if it's legitimate.",
        },
        correctAnswer: 'c',
        points: 1,
        order: 1,
        explanation:
          'Never click links in unexpected emails. Always verify through official channels like calling the organization directly using a known phone number.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'Which of these is a red flag that an email might be a phishing attempt?',
        options: {
          a: 'The email has a professional signature and a recognizable sender.',
          b: "The email addresses you by name and relates to something you're expecting.",
          c: 'The email contains spelling mistakes, urgent language, or asks for sensitive info like passwords.',
          d: "The email is from a colleague on a project you're working on.",
        },
        correctAnswer: 'c',
        points: 1,
        order: 2,
        explanation:
          'Phishing emails commonly contain spelling mistakes, urgent/threatening language, and requests for sensitive information like passwords or account details.',
      },
      {
        type: 'TRUE_FALSE',
        question:
          "It is safe to enable macros in an attachment from an external sender as long as the email says it's important.",
        options: {
          true: 'True – if it seems important, you should enable content.',
          false:
            "False – never enable macros on an attachment unless you have verified it's from a trusted source.",
        },
        correctAnswer: 'false',
        points: 1,
        order: 3,
        explanation:
          'Never enable macros on attachments from external or untrusted sources. Macros can contain malicious code. Always verify the source first.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'Your boss emails you (from their real address) asking for a transfer of funds to a new vendor account ASAP. It sounds urgent and unusual. What is the best course of action?',
        options: {
          a: 'Make the transfer immediately to avoid angering your boss.',
          b: 'Email back asking for more details and wait for the reply.',
          c: 'Call your boss (or verify through another channel) to confirm the request is legitimate before taking any action. This could be a BEC scam.',
          d: 'Forward the email to all staff as an example of a possible scam.',
        },
        correctAnswer: 'c',
        points: 1,
        order: 4,
        explanation:
          'Business Email Compromise (BEC) scams involve impersonating executives. Always verify unusual or urgent financial requests through a separate communication channel like a phone call.',
      },
    ];
  }

  private getChapter4QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question:
          "When browsing the web, you notice the URL of a site starts with http:// (not https) and there's no padlock icon. What does this mean, and what should you do?",
        options: {
          a: 'It means the site is secure; padlock is optional – proceed normally.',
          b: 'It means the connection is not encrypted; avoid entering any sensitive information on that site.',
          c: "It's a government site, so it's safe even without https.",
          d: 'It means your internet is down.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 1,
        explanation:
          'HTTP (without the S) means the connection is not encrypted. Never enter sensitive information on non-HTTPS sites as the data can be intercepted.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'What is a safe practice when using search engines at work?',
        options: {
          a: 'Click on results immediately; search providers block all bad sites.',
          b: 'Be cautious and only click links from reputable sources; verify that the link looks legitimate (e.g., correct .gov.za domain for government sites).',
          c: 'Download free software from any search result to save time.',
          d: 'Assume the top search result is always the official site.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 2,
        explanation:
          'SEO poisoning can place malicious sites in search results. Always verify domains and sources before clicking, especially for government or sensitive sites.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'Which of the following actions can improve your web browsing security?',
        options: {
          a: 'Keeping your browser updated to the latest version.',
          b: 'Installing every browser extension you can find.',
          c: "Disabling the browser's pop-up blocker.",
          d: 'Ignoring browser security warnings because they are often wrong.',
        },
        correctAnswer: 'a',
        points: 1,
        order: 3,
        explanation:
          'Keeping your browser updated ensures you have the latest security patches and protection against known vulnerabilities.',
      },
    ];
  }

  private getChapter5QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'What is one of the most effective ways to prevent malware infections on your work PC?',
        options: {
          a: 'Only turn on the computer once a week.',
          b: 'Keep your operating system and software updated with the latest security patches.',
          c: 'Delete all emails after reading them.',
          d: "Use the same password for your PC and other accounts so it's easier to remember.",
        },
        correctAnswer: 'b',
        points: 1,
        order: 1,
        explanation:
          'Keeping your OS and software updated with security patches closes vulnerabilities that malware could exploit.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'You find a USB flash drive in the parking lot and it has no labels. What should you do?',
        options: {
          a: "Plug it into your work computer to see what's on it.",
          b: 'Throw it in the trash immediately.',
          c: 'Hand it to your IT/security team – it could be malicious, and they can safely check it.',
          d: 'Keep it for personal use at home.',
        },
        correctAnswer: 'c',
        points: 1,
        order: 2,
        explanation:
          'Unknown USB drives can contain malware. They\'re sometimes left intentionally as "bait." Always give them to IT/security for safe inspection.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'Which of the following is a good practice for mobile devices used for work?',
        options: {
          a: 'Not setting any lock on your phone for convenience.',
          b: 'Installing apps from unofficial sources to get things done faster.',
          c: "Enabling the ability to remotely locate or wipe your phone in case it's lost.",
          d: 'Storing work passwords in a note-taking app on your phone for easy access.',
        },
        correctAnswer: 'c',
        points: 1,
        order: 3,
        explanation:
          'Enabling remote locate/wipe features allows you or IT to protect work data if your device is lost or stolen.',
      },
    ];
  }

  private getChapter6QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'Why is it risky to use public Wi-Fi (like in a café or airport) for work purposes?',
        options: {
          a: 'Public Wi-Fi is usually slower than mobile data.',
          b: "Others on the network could potentially intercept your data if it's not encrypted, or you might connect to a fake hotspot set up by an attacker.",
          c: "It's not risky at all; Wi-Fi is always safe.",
          d: 'Public Wi-Fi automatically installs viruses.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 1,
        explanation:
          'Public Wi-Fi networks are not secure. Attackers can intercept data or set up fake hotspots. Always use VPN and avoid sensitive activities on public Wi-Fi.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'What should you do to secure your home Wi-Fi if you use it for remote work?',
        options: {
          a: "Keep the default router name and password so you don't forget them.",
          b: 'Enable WPA2/WPA3 encryption and set a strong Wi-Fi password (not the factory default).',
          c: 'Turn off encryption to make it faster.',
          d: 'Set the Wi-Fi to "hidden" and use "password" as the password.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 2,
        explanation:
          'Strong WPA2/WPA3 encryption and changing the default password are essential to prevent unauthorized access to your home network.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question:
          "Is it okay to connect your personal smartphone or tablet to the office's secure Wi-Fi network?",
        options: {
          a: 'Always – any personal device can connect without issue.',
          b: 'Never – personal devices are completely banned on any work network.',
          c: "Only if allowed by your department's policy; if allowed, the device should have proper security (PIN, antivirus) and you might be required to use a guest network or register the device.",
          d: 'Only during lunch breaks.',
        },
        correctAnswer: 'c',
        points: 1,
        order: 3,
        explanation:
          "Follow your department's BYOD policy. Personal devices may be allowed on guest networks with proper security measures in place.",
      },
    ];
  }

  private getChapter7QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question: 'What is a key requirement if you use your personal smartphone for work email?',
        options: {
          a: 'You must let your colleagues borrow it any time.',
          b: 'You should have a strong PIN/password and possibly allow IT to enforce security policies or wipe work data if needed.',
          c: "You should disable all security so it's easier for IT to access.",
          d: "It's best to jailbreak or root it to install more apps.",
        },
        correctAnswer: 'b',
        points: 1,
        order: 1,
        explanation:
          'BYOD devices must have strong security and you must accept that IT may need to enforce policies or remotely wipe work data if the device is lost.',
      },
      {
        type: 'TRUE_FALSE',
        question:
          "If your personal laptop, which has some work files on it, gets stolen, it's not necessary to inform your employer since it's not a work-issued device.",
        options: {
          true: "True – personal property isn't the employer's concern.",
          false:
            'False – you must report it immediately so the team can protect any sensitive work data (e.g., revoke access, wipe data).',
        },
        correctAnswer: 'false',
        points: 1,
        order: 2,
        explanation:
          'Any device with work data must be reported if lost or stolen so IT can protect sensitive information through remote wipe or access revocation.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'Which of the following is not a good BYOD practice?',
        options: {
          a: "Enrolling your device in the company's device management program if required.",
          b: 'Keeping work documents in a secured app or container on your device.',
          c: "Regularly updating your device's OS and apps.",
          d: 'Forwarding work emails to your personal email to have easier access on your phone.',
        },
        correctAnswer: 'd',
        points: 1,
        order: 3,
        explanation:
          'Never forward work emails to personal accounts. This violates security policies and can expose sensitive information.',
      },
    ];
  }

  private getChapter8QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'Which of the following is considered personal information under POPIA and thus must be protected?',
        options: {
          a: "A person's ID number and contact details.",
          b: "A person's race or health information.",
          c: "A company's registration number (juristic person's info).",
          d: 'All of the above – personal info is broadly defined, including identifiers, sensitive info, and even info about companies.',
        },
        correctAnswer: 'd',
        points: 1,
        order: 1,
        explanation:
          'POPIA broadly defines personal information to include identifiers, sensitive data, and even information about juristic persons (companies).',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'POPIA requires organizations to take reasonable measures to secure personal data. In practice, what does this mean for you as an employee?',
        options: {
          a: 'Ensure you follow security protocols (like not emailing unencrypted personal data, using passwords, locking cabinets with files, etc.)',
          b: 'Only managers are responsible for data security, not regular staff.',
          c: "Personal data security isn't important as long as you mean well.",
          d: 'You personally must encrypt everything you do (even benign emails).',
        },
        correctAnswer: 'a',
        points: 1,
        order: 2,
        explanation:
          'POPIA Section 19 requires appropriate security measures. All employees must follow security protocols to protect personal information.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'The Cybercrimes Act makes which of the following a criminal offense?',
        options: {
          a: "Hacking into someone's account without permission.",
          b: 'Sharing your own work documents with a colleague for a project.',
          c: 'Reporting a phishing email to the police.',
          d: 'Having anti-virus software on your computer.',
        },
        correctAnswer: 'a',
        points: 1,
        order: 3,
        explanation:
          'The Cybercrimes Act criminalizes unauthorized access to systems, malware distribution, identity theft, and online impersonation.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'If a laptop containing personal information of citizens is stolen and you suspect the data might be compromised, what does POPIA mandate?',
        options: {
          a: 'Do nothing until someone complains.',
          b: 'The incident should be kept secret to avoid bad press.',
          c: 'The organization must notify the Information Regulator and affected individuals as soon as possible about the breach.',
          d: 'Pay a ransom to the thief to get the laptop back.',
        },
        correctAnswer: 'c',
        points: 1,
        order: 4,
        explanation:
          'POPIA requires immediate notification to the Information Regulator and affected individuals when a data breach occurs.',
      },
    ];
  }

  private getChapter9QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'What is the first thing you should do if you realize you may have accidentally downloaded malware or fallen for a phishing scam at work?',
        options: {
          a: 'Try to fix it yourself quietly.',
          b: 'Immediately report it to your IT/security team or supervisor so they can assist in containing the incident.',
          c: 'Turn off your computer and pretend nothing happened.',
          d: 'Post on social media asking for help.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 1,
        explanation:
          'Immediate reporting allows IT to contain the incident quickly by resetting credentials, scanning systems, and alerting others.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'Why is prompt reporting of security incidents so important?',
        options: {
          a: 'Because it allows quick action to limit damage (like changing passwords, isolating systems) and helps fulfill legal obligations to notify about breaches.',
          b: 'Because management wants to increase paperwork.',
          c: "It isn't important; most issues resolve on their own.",
          d: 'So that IT can blame someone quickly.',
        },
        correctAnswer: 'a',
        points: 1,
        order: 2,
        explanation:
          'Quick reporting minimizes damage, meets POPIA notification requirements, and allows proper incident response.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'You lost a USB drive that contained confidential data. What should you do?',
        options: {
          a: "Nothing, if no one knows, it's fine.",
          b: 'Search for it quietly for a few weeks.',
          c: 'Report the loss to security/IT immediately, so they can assess the risk and advise on further steps (and possibly notify authorities if it contains personal data).',
          d: 'Just buy a new USB and not tell anyone.',
        },
        correctAnswer: 'c',
        points: 1,
        order: 3,
        explanation:
          'Lost devices with data must be reported immediately for risk assessment and potential POPIA breach notification.',
      },
    ];
  }

  private getChapter10QuizQuestions() {
    return [
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'After completing this training, what is the best description of your role in cybersecurity as a government employee?',
        options: {
          a: "I'm only responsible for security if I work in IT.",
          b: 'I am a key part of our cybersecurity defense – my alertness and actions (like safe computing and reporting issues) help protect the organization.',
          c: "I just follow what my manager says; security isn't in my job description.",
          d: 'I should be scared to use email or the internet now.',
        },
        correctAnswer: 'b',
        points: 1,
        order: 1,
        explanation:
          'Every employee is part of the cybersecurity defense. Your actions and vigilance are crucial to protecting the organization.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question:
          "If you're unsure about whether an email is legitimate or how to handle a security situation, what should you do?",
        options: {
          a: 'Guess based on what you think is probably right.',
          b: "Ignore it; it's not important.",
          c: "Ask for guidance from IT/security or a supervisor – it's always okay to seek help or clarification.",
          d: 'Try a solution you read online that might not align with policy.',
        },
        correctAnswer: 'c',
        points: 1,
        order: 2,
        explanation:
          'Always ask when unsure. There are no "dumb questions" in security. It\'s better to clarify than to make a potentially dangerous assumption.',
      },
      {
        type: 'MULTIPLE_CHOICE',
        question:
          'How can you help build a culture of security awareness in your workplace after completing this training?',
        options: {
          a: 'By never talking about security again after this training.',
          b: 'By punishing anyone who makes a mistake.',
          c: 'By keeping security in mind daily, sharing tips or warnings with coworkers, staying updated on new threats, and supporting each other in following best practices.',
          d: "By assuming IT will handle everything and we don't need to think about it.",
        },
        correctAnswer: 'c',
        points: 1,
        order: 3,
        explanation:
          'Building a security culture involves daily awareness, sharing knowledge, and supporting colleagues in following best practices.',
      },
    ];
  }
}
