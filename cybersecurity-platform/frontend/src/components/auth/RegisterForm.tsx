'use client';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    tenantName: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const requirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const metRequirements = requirements.filter((req) => req.test(password)).length;
  const strength = (metRequirements / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strength < 40) return 'bg-destructive';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength < 40) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span className={`font-medium ${strength >= 80 ? 'text-green-600' : ''}`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: register, isPending, isSuccess } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const password = watch('password', '');

  const onSubmit = (data: RegisterFormData) => {
    register(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        tenantName: data.tenantName,
      },
      {
        onSuccess: () => {
          // The useRegister hook will show a success toast
          // After a brief delay, redirect to email verification page
          setTimeout(() => {
            router.push('/auth/verify-email?email=' + encodeURIComponent(data.email));
          }, 1500);
        },
      },
    );
  };

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
            <div className="relative h-12 w-[180px]">
              <Image
                src="/images/swiiff-logo.png"
                alt="SWIIFF Security"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Success Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Account created successfully!</CardTitle>
              <CardDescription>
                Please check your email to verify your account before logging in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to login
                </Button>
              </Link>
            </CardContent>
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
          <div className="relative h-12 w-[180px]">
            <Image
              src="/images/swiiff-logo.png"
              alt="SWIIFF Security"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Register Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your information to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    autoComplete="given-name"
                    {...formRegister('firstName')}
                    disabled={isPending}
                    autoFocus
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    {...formRegister('lastName')}
                    disabled={isPending}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...formRegister('email')}
                  disabled={isPending}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              {/* Tenant Name Field (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="tenantName">
                  Organization Name <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="tenantName"
                  type="text"
                  placeholder="Acme Corporation"
                  autoComplete="organization"
                  {...formRegister('tenantName')}
                  disabled={isPending}
                />
                {errors.tenantName && (
                  <p className="text-sm text-destructive">{errors.tenantName.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    {...formRegister('password')}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isPending}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              <PasswordStrength password={password} />

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    {...formRegister('confirmPassword')}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isPending}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  {...formRegister('acceptTerms')}
                  disabled={isPending}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="acceptTerms" className="text-sm font-normal leading-tight">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline" target="_blank">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                  </Label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-destructive">{errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>

              {/* Already have an account */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Already have an account? </span>
                <Link
                  href="/auth/login"
                  className="text-sm text-primary hover:underline"
                  tabIndex={isPending ? -1 : 0}
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
