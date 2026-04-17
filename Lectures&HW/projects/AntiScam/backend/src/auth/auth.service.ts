import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private readonly supabaseUrl: string;
  private readonly supabaseAnonKey: string;
  private readonly supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new InternalServerErrorException(
        'SUPABASE_URL and SUPABASE_ANON_KEY must be set',
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async register(email: string, password: string, name?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : undefined,
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      user: data.user,
      session: data.session,
      message:
        'Регистрация выполнена. Если включено подтверждение email, проверьте почту.',
    };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      user: data.user,
      session: data.session,
      accessToken: data.session?.access_token ?? null,
      refreshToken: data.session?.refresh_token ?? null,
    };
  }

  extractBearerToken(authorizationHeader?: string): string {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    return token;
  }

  getAuthedClient(accessToken: string): SupabaseClient {
    return createClient(this.supabaseUrl, this.supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const authedClient = this.getAuthedClient(accessToken);
    const { data, error } = await authedClient.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException(error?.message || 'Invalid session');
    }

    return data.user;
  }

  async logout(accessToken: string) {
    const authedClient = this.getAuthedClient(accessToken);
    const { error } = await authedClient.auth.signOut();

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { success: true };
  }

  sendCode(_phone: string) {
    return { success: true };
  }

  verifyCode(_phone: string, _code: string) {
    const token = 'legacy-phone-auth-not-used';
    return { verified: true, token };
  }
}
