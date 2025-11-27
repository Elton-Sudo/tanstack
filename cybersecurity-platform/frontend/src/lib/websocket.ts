/**
 * WebSocket Service for Real-Time Security Event Updates
 * Handles live data streaming for risk scores, phishing events, and alerts
 */

type EventType = 'risk_update' | 'phishing_event' | 'critical_alert' | 'user_login' | 'training_complete';

interface SecurityEvent {
  type: EventType;
  data: any;
  timestamp: Date;
  userId?: string;
  tenantId?: string;
}

type EventCallback = (event: SecurityEvent) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private eventCallbacks: Map<EventType, Set<EventCallback>> = new Map();
  private isConnecting = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  /**
   * Establish WebSocket connection
   */
  private connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3006/ws';

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected to security event stream');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startHeartbeat();

        // Subscribe to events
        this.send({
          type: 'subscribe',
          events: ['risk_update', 'phishing_event', 'critical_alert', 'user_login', 'training_complete'],
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const securityEvent: SecurityEvent = JSON.parse(event.data);
          securityEvent.timestamp = new Date(securityEvent.timestamp);
          this.handleEvent(securityEvent);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Connection closed');
        this.isConnecting = false;
        this.stopHeartbeat();
        this.handleReconnect();
      };
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  /**
   * Handle event distribution to subscribers
   */
  private handleEvent(event: SecurityEvent) {
    const callbacks = this.eventCallbacks.get(event.type);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error('[WebSocket] Callback error:', error);
        }
      });
    }
  }

  /**
   * Send data through WebSocket
   */
  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Heartbeat to keep connection alive
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `[WebSocket] Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
      );
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('[WebSocket] Max reconnection attempts reached');
    }
  }

  /**
   * Subscribe to specific event type
   */
  public on(eventType: EventType, callback: EventCallback) {
    if (!this.eventCallbacks.has(eventType)) {
      this.eventCallbacks.set(eventType, new Set());
    }
    this.eventCallbacks.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => this.off(eventType, callback);
  }

  /**
   * Unsubscribe from event type
   */
  public off(eventType: EventType, callback: EventCallback) {
    const callbacks = this.eventCallbacks.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Get connection status
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Manually disconnect
   */
  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
  }

  /**
   * Manually reconnect
   */
  public reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Singleton instance
export const websocketService = new WebSocketService();

// React Hook for easy WebSocket usage
export function useWebSocket(eventType: EventType, callback: EventCallback) {
  if (typeof window === 'undefined') return;

  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  React.useEffect(() => {
    const unsubscribe = websocketService.on(eventType, (event) => {
      callbackRef.current(event);
    });

    return unsubscribe;
  }, [eventType]);
}

// For non-React usage
export { WebSocketService };
export type { SecurityEvent, EventType, EventCallback };
