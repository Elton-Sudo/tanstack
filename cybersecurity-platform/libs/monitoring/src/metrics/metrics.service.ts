import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private metrics: Map<string, number> = new Map();

  incrementCounter(name: string, value: number = 1) {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + value);
  }

  setGauge(name: string, value: number) {
    this.metrics.set(name, value);
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  resetMetrics() {
    this.metrics.clear();
  }
}
