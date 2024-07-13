import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { GeneratorModule } from './generator/generator.module';

@Module({
  imports: [GeneratorModule, EventsModule],
})
export class AppModule {}
