import { SetMetadata } from '@nestjs/common';

/**
 * Requires Feature Decorator
 * Marks an endpoint as requiring a specific subscription feature
 *
 * Usage:
 * @RequiresFeature('gamification')
 * @Get('/leaderboard')
 * getLeaderboard() { ... }
 */
export const RequiresFeature = (feature: string) => SetMetadata('feature', feature);
