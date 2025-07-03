import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get API welcome message' })
  @ApiResponse({ status: 200, description: 'Welcome message' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
