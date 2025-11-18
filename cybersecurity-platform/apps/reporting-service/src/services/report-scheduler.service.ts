import { LoggerService } from '@app/logging';
import { Injectable } from '@nestjs/common';
import { ReportFrequency } from '@prisma/client';
import { DayOfWeek, ReportScheduleDto } from '../dto/report.dto';

@Injectable()
export class ReportSchedulerService {
  constructor(private readonly logger: LoggerService) {}

  calculateNextRun(dto: ReportScheduleDto | any): Date {
    const now = new Date();
    const [hours, minutes] = dto.time.split(':').map(Number);

    const nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    // If the time has passed today, start from tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    switch (dto.frequency) {
      case ReportFrequency.DAILY:
        // Already set to tomorrow if needed
        break;

      case ReportFrequency.WEEKLY:
        if (dto.dayOfWeek) {
          const targetDay = this.getDayNumber(dto.dayOfWeek);
          const currentDay = nextRun.getDay();
          const daysUntilTarget = (targetDay - currentDay + 7) % 7;

          if (daysUntilTarget === 0 && nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 7);
          } else {
            nextRun.setDate(nextRun.getDate() + daysUntilTarget);
          }
        }
        break;

      case ReportFrequency.MONTHLY:
        if (dto.dayOfMonth) {
          nextRun.setDate(dto.dayOfMonth);

          // If the date has passed this month, move to next month
          if (nextRun <= now) {
            nextRun.setMonth(nextRun.getMonth() + 1);
          }

          // Handle months with fewer days
          const daysInMonth = new Date(nextRun.getFullYear(), nextRun.getMonth() + 1, 0).getDate();

          if (dto.dayOfMonth > daysInMonth) {
            nextRun.setDate(daysInMonth);
          }
        }
        break;

      case ReportFrequency.QUARTERLY:
        // Set to first day of next quarter
        const currentQuarter = Math.floor(nextRun.getMonth() / 3);
        const nextQuarterMonth = (currentQuarter + 1) * 3;

        nextRun.setMonth(nextQuarterMonth, 1);

        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 3);
        }
        break;

      case ReportFrequency.YEARLY:
        // Set to January 1st of next year
        nextRun.setMonth(0, 1);

        if (nextRun <= now) {
          nextRun.setFullYear(nextRun.getFullYear() + 1);
        }
        break;

      default:
        this.logger.warn(`Unknown frequency: ${dto.frequency}`);
    }

    return nextRun;
  }

  private getDayNumber(day: DayOfWeek): number {
    const dayMap: Record<DayOfWeek, number> = {
      [DayOfWeek.SUNDAY]: 0,
      [DayOfWeek.MONDAY]: 1,
      [DayOfWeek.TUESDAY]: 2,
      [DayOfWeek.WEDNESDAY]: 3,
      [DayOfWeek.THURSDAY]: 4,
      [DayOfWeek.FRIDAY]: 5,
      [DayOfWeek.SATURDAY]: 6,
    };

    return dayMap[day];
  }

  async processScheduledReports(): Promise<void> {
    this.logger.log('Processing scheduled reports...');
    // In production, this would be called by a cron job
    // to generate and send scheduled reports
  }
}
