import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  sendCode(_phone: string) {
    return { success: true };
  }

  verifyCode(_phone: string, _code: string) {
    const token = 'mock-jwt-token-' + randomBytes(16).toString('hex');
    return { verified: true, token };
  }
}
