import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class EventBusService {
    private eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    publish(event: string, payload: any): Promise<void>;
    publishAsync(event: string, payload: any): Promise<any[]>;
}
