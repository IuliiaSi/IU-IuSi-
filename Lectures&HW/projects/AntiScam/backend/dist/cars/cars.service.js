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
exports.CarsService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
let CarsService = class CarsService {
    constructor(authService) {
        this.authService = authService;
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
            throw new common_1.InternalServerErrorException('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
        }
    }
    throwSupabaseError(error) {
        if (!error) {
            return;
        }
        const validationCodes = new Set(['23505', '23514', 'PGRST116']);
        if (validationCodes.has(error.code || '') || (error.code || '').startsWith('22')) {
            throw new common_1.BadRequestException(error.message);
        }
        throw new common_1.InternalServerErrorException(error.message);
    }
    async create(authorization, dto) {
        const token = this.authService.extractBearerToken(authorization);
        const user = await this.authService.getCurrentUser(token);
        const supabase = this.authService.getAuthedClient(token);
        const { data, error } = await supabase
            .from('cars')
            .insert([
            {
                user_id: user.id,
                brand: dto.brand,
                model: dto.model,
                year: dto.year,
                mileage: dto.mileage,
            },
        ])
            .select('*')
            .single();
        this.throwSupabaseError(error);
        if (!data) {
            throw new common_1.BadRequestException('Не удалось сохранить автомобиль');
        }
        return data;
    }
    async findById(authorization, id) {
        const token = this.authService.extractBearerToken(authorization);
        const user = await this.authService.getCurrentUser(token);
        const supabase = this.authService.getAuthedClient(token);
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .maybeSingle();
        this.throwSupabaseError(error);
        if (!data) {
            throw new common_1.NotFoundException('Автомобиль не найден');
        }
        return data;
    }
};
exports.CarsService = CarsService;
exports.CarsService = CarsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], CarsService);
//# sourceMappingURL=cars.service.js.map