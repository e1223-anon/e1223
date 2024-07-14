import { Module } from '@nestjs/common';
import { GeneratorEventsGateway } from './generator-events.gateway';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';

@Module({
  imports: [],
  controllers: [GeneratorController],
  providers: [GeneratorService, GeneratorEventsGateway],
})
export class GeneratorModule {}
