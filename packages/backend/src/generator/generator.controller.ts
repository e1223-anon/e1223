import { Body, Controller, Get, HttpException, Put } from '@nestjs/common';
import { GeneratorGet, GeneratorPut } from '@p1223/shared';
import { GeneratorService } from './generator.service';

@Controller('/api/generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Put('/default')
  async putGenerator(@Body() config: GeneratorPut): Promise<GeneratorGet> {
    const grid = await this.generatorService.setConfig('default', config.bias);
    return {
      code: '42',
      grid,
    };
  }

  @Get('/default')
  async getGenerator(): Promise<GeneratorGet> {
    const grid = await this.generatorService.get('default');
    if (!grid) {
      throw new HttpException('Generator not found', 404);
    }
    return {
      code: '42',
      grid,
    };
  }
}
