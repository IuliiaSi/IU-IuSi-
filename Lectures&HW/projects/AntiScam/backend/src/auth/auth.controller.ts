import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    const token = this.authService.extractBearerToken(authorization);
    const user = await this.authService.getCurrentUser(token);
    return {
      id: user.id,
      email: user.email,
    };
  }

  @Post('logout')
  logout(@Headers('authorization') authorization?: string) {
    const token = this.authService.extractBearerToken(authorization);
    return this.authService.logout(token);
  }

  @Post('send-code')
  sendCode(@Body() dto: SendCodeDto) {
    this.authService.sendCode(dto.phone);
    return { success: true, message: 'Код отправлен' };
  }

  @Post('verify-code')
  verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto.phone, dto.code);
  }
}
