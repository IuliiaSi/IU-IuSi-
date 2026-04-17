"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let AuthService = class AuthService {
    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new common_1.InternalServerErrorException('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
        }
        this.supabaseUrl = supabaseUrl;
        this.supabaseAnonKey = supabaseAnonKey;
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
    }
    async register(email, password, name) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: name ? { name } : undefined,
            },
        });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            user: data.user,
            session: data.session,
            message: 'Регистрация выполнена. Если включено подтверждение email, проверьте почту.',
        };
    }
    async login(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
        return {
            user: data.user,
            session: data.session,
            accessToken: data.session?.access_token ?? null,
            refreshToken: data.session?.refresh_token ?? null,
        };
    }
    extractBearerToken(authorizationHeader) {
        if (!authorizationHeader) {
            throw new common_1.UnauthorizedException('Authorization header is missing');
        }
        const [scheme, token] = authorizationHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw new common_1.UnauthorizedException('Invalid authorization format');
        }
        return token;
    }
    getAuthedClient(accessToken) {
        return (0, supabase_js_1.createClient)(this.supabaseUrl, this.supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        });
    }
    async getCurrentUser(accessToken) {
        const authedClient = this.getAuthedClient(accessToken);
        const { data, error } = await authedClient.auth.getUser(accessToken);
        if (error || !data.user) {
            throw new common_1.UnauthorizedException(error?.message || 'Invalid session');
        }
        return data.user;
    }
    async logout(accessToken) {
        const authedClient = this.getAuthedClient(accessToken);
        const { error } = await authedClient.auth.signOut();
        if (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
        return { success: true };
    }
    sendCode(_phone) {
        return { success: true };
    }
    verifyCode(_phone, _code) {
        const token = 'legacy-phone-auth-not-used';
        return { verified: true, token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthService);
//# sourceMappingURL=auth.service.js.map