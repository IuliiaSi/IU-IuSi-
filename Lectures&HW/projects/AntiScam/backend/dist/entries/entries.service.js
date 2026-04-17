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
exports.EntriesService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
let EntriesService = class EntriesService {
    constructor(authService) {
        this.authService = authService;
    }
    async create(authorization, dto) {
        const token = this.authService.extractBearerToken(authorization);
        const user = await this.authService.getCurrentUser(token);
        const supabase = this.authService.getAuthedClient(token);
        const { data, error } = await supabase
            .from('entries')
            .insert([
            {
                user_id: user.id,
                user_input: dto.userInput,
                ai_response: dto.aiResponse,
            },
        ])
            .select('*')
            .single();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return data;
    }
    async listMine(authorization) {
        const token = this.authService.extractBearerToken(authorization);
        const user = await this.authService.getCurrentUser(token);
        const supabase = this.authService.getAuthedClient(token);
        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return data ?? [];
    }
};
exports.EntriesService = EntriesService;
exports.EntriesService = EntriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], EntriesService);
//# sourceMappingURL=entries.service.js.map