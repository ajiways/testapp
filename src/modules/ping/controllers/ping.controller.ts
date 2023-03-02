import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Ping')
@Controller('/ping')
export class PingController {
  @ApiOperation({ description: 'Просто пинг (:' })
  @ApiResponse({
    type: String,
    description: 'Понг',
    status: HttpStatus.OK,
  })
  @Get()
  public ping() {
    return 'pong';
  }
}
