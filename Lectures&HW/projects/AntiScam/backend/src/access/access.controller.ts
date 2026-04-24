import { Controller, Get, Headers } from '@nestjs/common';
import { AccessService } from './access.service';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get('me')
  me(@Headers('authorization') authorization: string | undefined) {
    return this.accessService.getCurrentStatus(authorization);
  }
}
