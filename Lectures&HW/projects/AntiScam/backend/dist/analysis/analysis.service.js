"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const rule_mapping_1 = require("./data/rule-mapping");
const mock_upload_result_1 = require("./data/mock-upload-result");
const example_result_1 = require("./data/example-result");
const GROUP_ORDER = [
    'Обеспечение безопасности',
    'Критические неисправности',
    'Профилактическое обслуживание',
    'Несрочно',
];
const GROUP_DESCRIPTIONS = {
    'Обеспечение безопасности': 'Лучше не откладывать',
    'Критические неисправности': 'Важно проверить и решить в ближайшее время',
    'Профилактическое обслуживание': 'Плановые работы',
    'Несрочно': 'Можно обсудить и не делать сразу',
};
let AnalysisService = class AnalysisService {
    analyze(jobs, _brand, _model, _year, _mileage) {
        const buckets = {};
        for (const group of GROUP_ORDER) {
            buckets[group] = [];
        }
        for (const job of jobs) {
            const rule = rule_mapping_1.ruleMapping[job] || rule_mapping_1.fallbackRule;
            buckets[rule.group].push({
                name: job,
                chip: rule.chip,
                explanation: rule.explanation,
            });
        }
        const groups = GROUP_ORDER
            .filter((g) => buckets[g].length > 0)
            .map((g) => ({
            name: g,
            description: GROUP_DESCRIPTIONS[g],
            items: buckets[g],
        }));
        const counts = groups.map((g) => {
            const label = g.name === 'Обеспечение безопасности' ? 'лучше не откладывать' :
                g.name === 'Критические неисправности' ? 'стоит проверить' :
                    g.name === 'Профилактическое обслуживание' ? 'плановые' :
                        'можно обсудить';
            return `${g.items.length} ${label}`;
        });
        const summary = `Разобрали ${jobs.length} пунктов. ${counts.join(', ')}.`;
        return { groups, summary };
    }
    getUploadResult() {
        return mock_upload_result_1.mockUploadResult;
    }
    getExampleResult() {
        return example_result_1.exampleResult;
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = __decorate([
    (0, common_1.Injectable)()
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map