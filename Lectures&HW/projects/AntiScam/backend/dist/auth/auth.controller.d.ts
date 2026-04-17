import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: import("@supabase/auth-js").User;
        session: import("@supabase/auth-js").Session;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: import("@supabase/auth-js").User;
        session: import("@supabase/auth-js").Session;
        accessToken: string;
        refreshToken: string;
    }>;
    me(authorization?: string): Promise<{
        id: string;
        email: string;
    }>;
    logout(authorization?: string): Promise<{
        success: boolean;
    }>;
    sendCode(dto: SendCodeDto): {
        success: boolean;
        message: string;
    };
    verifyCode(dto: VerifyCodeDto): {
        verified: boolean;
        token: string;
    };
}
