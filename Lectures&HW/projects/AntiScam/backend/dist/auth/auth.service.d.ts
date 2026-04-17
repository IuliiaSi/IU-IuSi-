import { SupabaseClient, User } from '@supabase/supabase-js';
export declare class AuthService {
    private readonly supabaseUrl;
    private readonly supabaseAnonKey;
    private readonly supabase;
    constructor();
    register(email: string, password: string, name?: string): Promise<{
        user: User;
        session: import("@supabase/supabase-js").AuthSession;
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        user: User;
        session: import("@supabase/supabase-js").AuthSession;
        accessToken: string;
        refreshToken: string;
    }>;
    extractBearerToken(authorizationHeader?: string): string;
    getAuthedClient(accessToken: string): SupabaseClient;
    getCurrentUser(accessToken: string): Promise<User>;
    logout(accessToken: string): Promise<{
        success: boolean;
    }>;
    sendCode(_phone: string): {
        success: boolean;
    };
    verifyCode(_phone: string, _code: string): {
        verified: boolean;
        token: string;
    };
}
