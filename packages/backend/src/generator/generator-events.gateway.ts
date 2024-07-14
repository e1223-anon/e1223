import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GeneratorStateDao } from '@p1223/shared';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'generator-events',
  cors: {
    origin: '*',
  },
})
export class GeneratorEventsGateway {
  @WebSocketServer()
  server: Server;

  emit(genId: string, generator: GeneratorStateDao) {
    this.server.emit(genId, generator);
  }
}
