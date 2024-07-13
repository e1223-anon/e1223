import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { GeneratorPut, GeneratorStateDao } from '@p1223/shared';
import { GeneratorService } from './generator.service';

@Controller('/api/generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Put('/default')
  async putGenerator(@Body() config: GeneratorPut): Promise<GeneratorStateDao> {
    const configResult = await this.generatorService.setConfig(
      'default',
      config.bias,
    );
    if (configResult.result === 'error') {
      throw new HttpException('Config throttle', HttpStatus.FORBIDDEN);
    }
    return configResult.dao;
  }

  @Get('/default')
  async getGenerator(): Promise<GeneratorStateDao> {
    const grid = await this.generatorService.get('default');
    if (!grid) {
      throw new HttpException('Generator not found', 404);
    }
    return grid;
  }
}
