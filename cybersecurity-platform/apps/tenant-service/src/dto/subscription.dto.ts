import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum SubscriptionPlan {
  TRIAL = 'TRIAL',
  FREE = 'FREE',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAST_DUE = 'PAST_DUE',
  TRIAL = 'TRIAL',
}

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  tenantId: string;

  @IsNotEmpty()
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}

export class UpgradeSubscriptionDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionPlan)
  newPlan: SubscriptionPlan;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}

export class DowngradeSubscriptionDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionPlan)
  newPlan: SubscriptionPlan;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CalculateOverageDto {
  @IsNotEmpty()
  @IsString()
  tenantId: string;

  @IsNotEmpty()
  @IsString()
  month: string; // Format: YYYY-MM
}

export class UsageDto {
  @IsNumber()
  @Min(0)
  activeUsers: number;

  @IsNumber()
  @Min(0)
  storageGB: number;

  @IsNumber()
  @Min(0)
  apiCalls: number;
}

export interface PlanLimits {
  users: number; // -1 = unlimited
  storage: number; // GB
  apiCalls: number; // per month, -1 = unlimited
}

export interface PlanPricing {
  basePrice: number;
  currency: string;
  overageRates: {
    perUser: number;
    perGB: number;
    perApiCall: number;
  };
}

export interface OverageCalculation {
  usersOverage: number;
  storageOverage: number;
  apiCallsOverage: number;
  totalOverageCost: number;
  breakdown: {
    users: { overage: number; cost: number };
    storage: { overage: number; cost: number };
    apiCalls: { overage: number; cost: number };
  };
}
