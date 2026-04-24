import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

export interface UserAccessStatus {
  paid: boolean;
  role: 'user' | 'admin';
}

@Injectable()
export class AccessService {
  constructor(private readonly authService: AuthService) {}

  private normalizeRole(value: unknown): 'user' | 'admin' {
    return value === 'admin' ? 'admin' : 'user';
  }

  private async getStatusForUser(token: string, userId: string): Promise<UserAccessStatus> {
    const supabase = this.authService.getAuthedClient(token);
    const { data, error } = await supabase
      .from('user_access')
      .select('paid, role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return { paid: false, role: 'user' };
      }
      throw new ForbiddenException('Не удалось проверить права доступа');
    }

    return {
      paid: Boolean(data?.paid),
      role: this.normalizeRole(data?.role),
    };
  }

  async getCurrentStatus(authorization: string | undefined) {
    const token = this.authService.extractBearerToken(authorization);
    const user = await this.authService.getCurrentUser(token);
    const access = await this.getStatusForUser(token, user.id);

    return {
      userId: user.id,
      email: user.email ?? null,
      ...access,
    };
  }

  async requirePaidAccess(authorization: string | undefined) {
    const status = await this.getCurrentStatus(authorization);
    if (!status.paid) {
      throw new ForbiddenException('Требуется подтвержденная оплата');
    }
    return status;
  }
}
