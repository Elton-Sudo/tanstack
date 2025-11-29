'use client';

import { Bot, MessageCircle, Send, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface SecurityChatbotProps {
  className?: string;
}

export function SecurityChatbot({ className = '' }: SecurityChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your AI Security Assistant. I can help you with phishing awareness, security best practices, POPIA compliance, and more. How can I help you today?",
      timestamp: new Date(),
      suggestions: [
        'What is phishing?',
        'How to spot a phishing email?',
        'POPIA compliance tips',
        'Password best practices',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const knowledgeBase = {
    phishing: {
      keywords: ['phishing', 'phish', 'suspicious email', 'fake email'],
      response:
        "Phishing is a cybercrime where attackers impersonate legitimate organizations to steal sensitive data. Key red flags include:\n\n1. Generic greetings ('Dear Customer')\n2. Urgent language creating panic\n3. Spelling/grammar errors\n4. Suspicious sender addresses\n5. Requests for passwords or personal info\n6. Unexpected attachments or links\n\nAlways verify sender identity before clicking links or downloading attachments. When in doubt, contact IT security.",
      suggestions: [
        'How to report phishing?',
        'Phishing training resources',
        'Recent phishing trends',
      ],
    },
    popia: {
      keywords: ['popia', 'data protection', 'privacy', 'personal information'],
      response:
        "POPIA (Protection of Personal Information Act) is South Africa's data privacy law. Key principles:\n\n1. Accountability: Take responsibility for data\n2. Processing limitation: Use data only for stated purposes\n3. Purpose specification: Be clear why you collect data\n4. Further processing: Don't use data for new purposes without consent\n5. Information quality: Keep data accurate and up-to-date\n6. Openness: Be transparent about data use\n7. Security safeguards: Protect data appropriately\n8. Data subject participation: Allow people to access their data\n\nNon-compliance can result in fines up to R10 million or imprisonment.",
      suggestions: ['Data subject rights', 'POPIA compliance checklist', 'Consent requirements'],
    },
    password: {
      keywords: ['password', 'authentication', 'login', 'credential'],
      response:
        "Strong password best practices:\n\n1. Use at least 12 characters\n2. Mix uppercase, lowercase, numbers, and symbols\n3. Avoid personal information (names, birthdays)\n4. Use unique passwords for each account\n5. Enable Multi-Factor Authentication (MFA)\n6. Use a password manager\n7. Change passwords if there's a breach\n8. Never share passwords via email or chat\n\nExample of a strong password: P@ssw0rd123! is weak (common pattern)\nBetter: Tr0p!c@l-S3cur!ty-2025",
      suggestions: ['How to use password managers?', 'MFA setup guide', 'Password reset policy'],
    },
    mfa: {
      keywords: ['mfa', 'multi-factor', '2fa', 'two-factor', 'authentication'],
      response:
        'Multi-Factor Authentication (MFA) adds extra security layers beyond just passwords:\n\n**Types of MFA:**\n1. Something you know (password)\n2. Something you have (phone, security key)\n3. Something you are (fingerprint, face)\n\n**Benefits:**\n- Blocks 99.9% of automated attacks\n- Protects even if password is compromised\n- Required for POPIA compliance\n\n**Setup:**\n1. Go to Account Settings > Security\n2. Enable MFA\n3. Choose method (authenticator app recommended)\n4. Scan QR code\n5. Save backup codes\n\nUse apps like Microsoft Authenticator or Google Authenticator.',
      suggestions: ['Best MFA apps?', 'Lost MFA device help', 'Backup codes'],
    },
    incident: {
      keywords: ['incident', 'breach', 'attack', 'compromised', 'hacked'],
      response:
        "If you suspect a security incident:\n\n**Immediate Actions:**\n1. DON'T panic or try to fix it yourself\n2. Disconnect device from network if safe to do so\n3. DON'T delete anything (evidence)\n4. Contact IT Security immediately: security@company.com\n5. Document what happened\n\n**What to Report:**\n- Suspicious emails or links clicked\n- Unexpected system behavior\n- Lost/stolen devices\n- Unauthorized access attempts\n- Data leaks\n\n**Remember:** Reporting quickly can prevent damage. You won't get in trouble for reporting - it helps protect everyone!",
      suggestions: ['How to report incidents?', 'What is ransomware?', 'Incident response team'],
    },
    training: {
      keywords: ['training', 'course', 'learn', 'certification'],
      response:
        'Available Security Training:\n\n**Core Courses:**\n1. Phishing Awareness Training (30 min)\n2. Password Security Fundamentals (20 min)\n3. POPIA Compliance for Employees (45 min)\n4. Social Engineering Defense (30 min)\n5. Secure Remote Work (25 min)\n\n**Advanced:**\n- Incident Response Procedures\n- Data Classification\n- Secure Development Practices\n\n**Certifications:**\nComplete all core courses + pass assessments to earn your Security Awareness Certificate.\n\nAccess courses at: /courses',
      suggestions: ['View my training progress', 'Upcoming courses', 'Certificate requirements'],
    },
  };

  const generateResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();

    // Check knowledge base
    for (const [key, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return {
          content: data.response,
          suggestions: data.suggestions,
        };
      }
    }

    // Default responses for common greetings
    if (['hi', 'hello', 'hey'].some((greeting) => lowerMessage.includes(greeting))) {
      return {
        content:
          "Hello! I'm here to help with security questions. What would you like to know about?",
        suggestions: [
          'Phishing awareness',
          'Password security',
          'POPIA compliance',
          'Report an incident',
        ],
      };
    }

    if (['thank', 'thanks'].some((word) => lowerMessage.includes(word))) {
      return {
        content: "You're welcome! Stay secure! Is there anything else I can help you with?",
        suggestions: ['View my risk score', 'Training recommendations', 'Security tips'],
      };
    }

    // Fallback response
    return {
      content:
        "I'm not sure about that specific topic, but I can help with:\n\n- Phishing and email security\n- Password best practices\n- POPIA compliance\n- Multi-factor authentication\n- Security incident reporting\n- Training courses\n\nWhat would you like to know more about?",
      suggestions: ['Contact human support', 'Browse help articles', 'Security FAQs'],
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(
      () => {
        const response = generateResponse(input);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
          suggestions: response.suggestions,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    ); // 1-2 second delay
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-brand-blue to-purple-600 p-4 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 group"
        aria-label="Open AI Security Assistant"
      >
        <div className="relative">
          <Bot className="h-6 w-6 text-white" />
          <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div className="absolute -top-12 right-0 bg-card border rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <p className="text-sm font-medium">Ask me anything about security!</p>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${
        isMinimized ? 'w-80' : 'w-96'
      } bg-card border rounded-2xl shadow-2xl flex flex-col ${
        isMinimized ? 'h-16' : 'h-[600px]'
      } transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-brand-blue to-purple-600 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="rounded-full bg-white/20 p-2">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Security Assistant</h3>
            <p className="text-xs text-white/80">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-2 hover:bg-white/10 transition-colors"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4 text-white" />
            ) : (
              <Minimize2 className="h-4 w-4 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user' ? 'bg-brand-blue text-white' : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-brand-blue/30 hover:bg-brand-blue/10 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-brand-blue animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-brand-blue animate-bounce delay-100" />
                    <div className="h-2 w-2 rounded-full bg-brand-blue animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about security..."
                className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="rounded-lg bg-brand-blue p-2 text-white hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by AI • For urgent issues, contact IT Security
            </p>
          </div>
        </>
      )}
    </div>
  );
}
