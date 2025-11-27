import { DiskHealthIndicator, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
export declare class HealthController {
    private health;
    private http;
    private disk;
    private memory;
    constructor(health: HealthCheckService, http: HttpHealthIndicator, disk: DiskHealthIndicator, memory: MemoryHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    ready(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    live(): {
        status: string;
        timestamp: string;
    };
}
