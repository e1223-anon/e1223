import { Signal, signal } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { io } from "socket.io-client";

export interface Events<Dao = any> {
  connected: Signal<boolean>;
  eventStream: Observable<{ event: string; data: Dao }>;
}

export function createEventsSocket<Dao = any>(namespace: string): Events<Dao> {
  const eventSocket = io(`http://localhost:4200/${namespace}`);
  const connectedSignal = signal(false);
  const eventsSubject = new Subject<{ event: string; data: Dao }>();
  eventSocket.onAny((event, ...args) => {
    eventsSubject.next({ event, data: args[0] });
  });

  eventSocket.on("connect", () => {
    connectedSignal.set(true);
  });

  eventSocket.on("disconnect", () => {
    connectedSignal.set(false);
  });

  return {
    connected: connectedSignal,
    eventStream: eventsSubject.asObservable(),
  };
}
