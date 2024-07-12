import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';

describe('AppController', () => {
  let controller: GeneratorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GeneratorController],
      providers: [GeneratorService],
    }).compile();

    controller = app.get<GeneratorController>(GeneratorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getGenerator()).toBe('Hello World!');
    });
  });
});
