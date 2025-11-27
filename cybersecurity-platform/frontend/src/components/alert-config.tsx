'use client';

import { Bell, Check, Mail, Save, Settings, Smartphone, Users, X } from 'lucide-react';
import { useState } from 'react';

interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: 'risk_score' | 'phishing_click' | 'training_overdue' | 'critical_user' | 'multiple_failures';
  threshold?: number;
  recipients: string[];
  channels: ('email' | 'sms' | 'push')[];
}

interface AlertConfigProps {
  onSave?: (rules: AlertRule[]) => void;
  className?: string;
}

export function AlertConfig({ onSave, className = '' }: AlertConfigProps) {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'Critical Risk User Alert',
      description: 'Notify when a user reaches critical risk level (score < 40)',
      enabled: true,
      trigger: 'critical_user',
      threshold: 40,
      recipients: ['security@company.com', 'manager@company.com'],
      channels: ['email', 'push'],
    },
    {
      id: '2',
      name: 'Phishing Simulation Failed',
      description: 'Alert when user clicks phishing simulation link',
      enabled: true,
      trigger: 'phishing_click',
      recipients: ['security@company.com'],
      channels: ['email'],
    },
    {
      id: '3',
      name: 'Training Overdue',
      description: 'Remind users when mandatory training is overdue by 7 days',
      enabled: true,
      trigger: 'training_overdue',
      threshold: 7,
      recipients: ['user@company.com', 'manager@company.com'],
      channels: ['email', 'sms'],
    },
    {
      id: '4',
      name: 'Multiple Login Failures',
      description: 'Alert on 5+ failed login attempts within 1 hour',
      enabled: false,
      trigger: 'multiple_failures',
      threshold: 5,
      recipients: ['security@company.com'],
      channels: ['email', 'sms', 'push'],
    },
  ]);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newRecipient, setNewRecipient] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleRule = (id: string) => {
    setAlertRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)),
    );
  };

  const toggleChannel = (ruleId: string, channel: 'email' | 'sms' | 'push') => {
    setAlertRules((prev) =>
      prev.map((rule) => {
        if (rule.id === ruleId) {
          const hasChannel = rule.channels.includes(channel);
          return {
            ...rule,
            channels: hasChannel
              ? rule.channels.filter((c) => c !== channel)
              : [...rule.channels, channel],
          };
        }
        return rule;
      }),
    );
  };

  const addRecipient = (ruleId: string) => {
    if (!newRecipient.trim() || !newRecipient.includes('@')) return;

    setAlertRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, recipients: [...rule.recipients, newRecipient.trim()] } : rule,
      ),
    );
    setNewRecipient('');
  };

  const removeRecipient = (ruleId: string, email: string) => {
    setAlertRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? { ...rule, recipients: rule.recipients.filter((r) => r !== email) }
          : rule,
      ),
    );
  };

  const updateThreshold = (ruleId: string, value: number) => {
    setAlertRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? { ...rule, threshold: value } : rule)),
    );
  };

  const handleSave = () => {
    onSave?.(alertRules);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getChannelIcon = (channel: 'email' | 'sms' | 'push') => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className={`rounded-lg border bg-card ${className}`}>
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-brand-orange/10 p-3">
              <Settings className="h-6 w-6 text-brand-orange" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Automated Alert Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Configure real-time notifications for critical security events
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-white hover:bg-brand-blue/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span className="text-sm font-medium">Save Changes</span>
          </button>
        </div>

        {showSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-green/10 border border-brand-green/20 px-4 py-3">
            <Check className="h-5 w-5 text-brand-green" />
            <p className="text-sm font-medium text-brand-green">Alert rules saved successfully!</p>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {alertRules.map((rule) => (
          <div
            key={rule.id}
            className={`rounded-lg border p-6 transition-all ${
              rule.enabled ? 'bg-card' : 'bg-muted/30 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold">{rule.name}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      rule.enabled
                        ? 'bg-brand-green/10 text-brand-green'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </div>
              <button
                onClick={() => toggleRule(rule.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  rule.enabled ? 'bg-brand-green' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    rule.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {rule.enabled && (
              <>
                {/* Threshold */}
                {rule.threshold !== undefined && (
                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-2">Threshold</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={rule.trigger === 'critical_user' ? 0 : 1}
                        max={rule.trigger === 'critical_user' ? 100 : 10}
                        value={rule.threshold}
                        onChange={(e) => updateThreshold(rule.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="font-semibold text-brand-blue min-w-[3rem] text-right">
                        {rule.threshold}
                        {rule.trigger === 'critical_user' ? '' : ' days'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notification Channels */}
                <div className="mb-4">
                  <label className="text-sm font-medium block mb-2">Notification Channels</label>
                  <div className="flex gap-2">
                    {(['email', 'sms', 'push'] as const).map((channel) => (
                      <button
                        key={channel}
                        onClick={() => toggleChannel(rule.id, channel)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          rule.channels.includes(channel)
                            ? 'bg-brand-blue text-white border-brand-blue'
                            : 'bg-card hover:bg-muted border-muted'
                        }`}
                      >
                        {getChannelIcon(channel)}
                        <span className="text-sm font-medium capitalize">{channel}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <label className="text-sm font-medium block mb-2">Alert Recipients</label>
                  <div className="space-y-2">
                    {rule.recipients.map((recipient) => (
                      <div
                        key={recipient}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{recipient}</span>
                        </div>
                        <button
                          onClick={() => removeRecipient(rule.id, recipient)}
                          className="rounded p-1 hover:bg-background transition-colors"
                          aria-label={`Remove ${recipient}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {isEditing === rule.id && (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={newRecipient}
                          onChange={(e) => setNewRecipient(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addRecipient(rule.id)}
                          placeholder="email@company.com"
                          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                        <button
                          onClick={() => addRecipient(rule.id)}
                          className="rounded-lg bg-brand-blue px-4 py-2 text-white hover:bg-brand-blue/90 transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(null);
                            setNewRecipient('');
                          }}
                          className="rounded-lg border px-4 py-2 hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {isEditing !== rule.id && (
                      <button
                        onClick={() => setIsEditing(rule.id)}
                        className="w-full px-3 py-2 rounded-lg border border-dashed hover:bg-muted transition-colors text-sm font-medium"
                      >
                        + Add Recipient
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="border-t p-6 bg-muted/30">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-brand-blue mt-0.5" />
          <div>
            <p className="text-sm font-medium">Real-Time Alert Delivery</p>
            <p className="text-xs text-muted-foreground mt-1">
              Alerts are sent instantly when triggers are met. Email delivery typically takes 1-2
              minutes. SMS and push notifications are delivered within seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
