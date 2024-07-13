import { Injectable } from "@angular/core";
import { io } from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  constructor() {
    const ws = io("http://localhost:4200");

    ws.on("connect", () => {
      console.log("ws connected");
      ws.emit("events", { test: "test" });
      ws.emit("identity", 42, (r: any) => console.log("identity response", r));
    });
    ws.on("events", (data) => {
      console.log("events", data);
    });
    ws.on("identity", (data) => {
      console.log("Got identity", data);
    });
    ws.on("disconnect", () => {
      console.log("ws disconnected");
    });
  }
}
