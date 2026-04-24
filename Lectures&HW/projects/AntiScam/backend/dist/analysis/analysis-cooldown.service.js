"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisCooldownService = void 0;
const common_1 = require("@nestjs/common");
const COOLDOWN_MS = 3000;
let AnalysisCooldownService = class AnalysisCooldownService {
    constructor() {
        this.lastActionAt = new Map();
    }
    enforceCooldown(actorKey) {
        const now = Date.now();
        const previous = this.lastActionAt.get(actorKey);
        if (typeof previous === 'number' && now - previous < COOLDOWN_MS) {
            throw new common_1.HttpException('Подождите немного', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        this.lastActionAt.set(actorKey, now);
    }
};
exports.AnalysisCooldownService = AnalysisCooldownService;
exports.AnalysisCooldownService = AnalysisCooldownService = __decorate([
    (0, common_1.Injectable)()
], AnalysisCooldownService);
//# sourceMappingURL=analysis-cooldown.service.js.map