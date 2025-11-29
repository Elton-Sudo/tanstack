'use client';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isPending?: boolean;
}

export function LoginForm({ onSubmit, isPending = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements with SWIIF colors */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#F5C242' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#3B8EDE' }} />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#8CB841' }} />

      {/* Theme Toggle - Top Right */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
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

        {/* Login Card */}
        <Card className="shadow-xl border-t-4" style={{ borderTopColor: '#3B8EDE' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register('email')}
                  disabled={isPending}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    disabled={isPending}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isPending}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    )}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                  tabIndex={isPending ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-primary hover:underline"
                tabIndex={isPending ? -1 : 0}
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="relative h-6 w-6">
              <Image
                src="/images/swiiff-icon.png"
                alt="SWIIFF"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-sm font-medium">CyberSecurity Platform</span>
          </div>

          {/* Brand dots and info */}
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#F5C242' }} />
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#E86A33' }} />
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#3B8EDE' }} />
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#8CB841' }} />
            </div>
            <span>Enterprise-grade security training</span>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} SWIIFF Security. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
