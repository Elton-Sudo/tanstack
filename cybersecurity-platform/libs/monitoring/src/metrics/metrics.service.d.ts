export declare class MetricsService {
    private metrics;
    incrementCounter(name: string, value?: number): void;
    setGauge(name: string, value: number): void;
    getMetrics(): Record<string, number>;
    resetMetrics(): void;
}
