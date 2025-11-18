import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventBusService {
  constructor(private eventEmitter: EventEmitter2) {}

  async publish(event: string, payload: any): Promise<void> {
    this.eventEmitter.emit(event, payload);
  }

  async publishAsync(event: string, payload: any): Promise<any[]> {
    return this.eventEmitter.emitAsync(event, payload);
  }
}
