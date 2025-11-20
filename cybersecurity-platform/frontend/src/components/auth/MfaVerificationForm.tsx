'use client';

import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyMfa } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const mfaSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^[0-9]+$/, 'Code must contain only numbers'),
});

type MfaFormData = z.infer<typeof mfaSchema>;

interface MfaVerificationFormProps {
  sessionId: string;
  onSuccess?: () => void;
}

export function MfaVerificationForm({ sessionId, onSuccess }: MfaVerificationFormProps) {
  const router = useRouter();
  const { mutate: verifyMfa, isPending, isSuccess } = useVerifyMfa();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MfaFormData>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: '',
    },
  });

  const code = watch('code');

  const onSubmit = (data: MfaFormData) => {
    verifyMfa(
      { sessionId, code: data.code },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            // Default behavior: redirect to dashboard
            router.push('/dashboard');
          }
        },
      },
    );
  };

  // Handle individual digit input
  const handleDigitInput = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.slice(-1);
    if (digit && /^[0-9]$/.test(digit)) {
      const newCode = code.split('');
      newCode[index] = digit;
      setValue('code', newCode.join(''));

      // Move to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === '') {
      // Handle backspace
      const newCode = code.split('');
      newCode[index] = '';
      setValue('code', newCode.join(''));
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setValue('code', pastedData);
      inputRefs.current[5]?.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (code.length === 6 && /^[0-9]{6}$/.test(code)) {
      handleSubmit(onSubmit)();
    }
  }, [code]);

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
        {/* Theme Toggle */}
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo width={180} height={48} href="/" />
          </div>

          {/* Success Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Verification successful!</CardTitle>
              <CardDescription>You have been successfully authenticated.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo width={180} height={48} href="/" />
        </div>

        {/* MFA Verification Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              Two-factor authentication
            </CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 6-Digit Code Input */}
              <div className="space-y-2">
                <Label className="sr-only">Verification Code</Label>
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={code[index] || ''}
                      onChange={(e) => handleDigitInput(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isPending}
                      autoFocus={index === 0}
                      className="h-14 w-12 text-center text-lg font-semibold"
                    />
                  ))}
                </div>
                {errors.code && (
                  <p className="text-center text-sm text-destructive">{errors.code.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isPending || code.length !== 6}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify code
              </Button>

              {/* Help Text */}
              <div className="space-y-2 text-center text-sm">
                <p className="text-muted-foreground">Can't access your authenticator app?</p>
                <Button type="button" variant="ghost" className="h-auto p-0" disabled={isPending}>
                  Use recovery code
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Having trouble?{' '}
          <a href="/support" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
