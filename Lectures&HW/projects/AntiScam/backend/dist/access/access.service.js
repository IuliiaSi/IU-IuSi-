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
exports.AccessService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
let AccessService = class AccessService {
    constructor(authService) {
        this.authService = authService;
    }
    normalizeRole(value) {
        return value === 'admin' ? 'admin' : 'user';
    }
    async getStatusForUser(token, userId) {
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
            throw new common_1.ForbiddenException('Не удалось проверить права доступа');
        }
        return {
            paid: Boolean(data?.paid),
            role: this.normalizeRole(data?.role),
        };
    }
    async getCurrentStatus(authorization) {
        const token = this.authService.extractBearerToken(authorization);
        const user = await this.authService.getCurrentUser(token);
        const access = await this.getStatusForUser(token, user.id);
        return {
            userId: user.id,
            email: user.email ?? null,
            ...access,
        };
    }
    async requirePaidAccess(authorization) {
        const status = await this.getCurrentStatus(authorization);
        if (!status.paid) {
            throw new common_1.ForbiddenException('Требуется подтвержденная оплата');
        }
        return status;
    }
};
exports.AccessService = AccessService;
exports.AccessService = AccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AccessService);
//# sourceMappingURL=access.service.js.map