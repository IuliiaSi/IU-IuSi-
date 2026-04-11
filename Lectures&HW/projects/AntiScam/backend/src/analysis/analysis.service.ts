import { Injectable } from '@nestjs/common';
import { ruleMapping, fallbackRule } from './data/rule-mapping';
import { mockUploadResult } from './data/mock-upload-result';
import { exampleResult } from './data/example-result';

export interface AnalyzedItem {
  name: string;
  chip: string;
  explanation: string;
}

export interface AnalysisGroup {
  name: string;
  description: string;
  items: AnalyzedItem[];
}

const GROUP_ORDER = [
  'Обеспечение безопасности',
  'Критические неисправности',
  'Профилактическое обслуживание',
  'Несрочно',
];

const GROUP_DESCRIPTIONS: Record<string, string> = {
  'Обеспечение безопасности': 'Лучше не откладывать',
  'Критические неисправности': 'Важно проверить и решить в ближайшее время',
  'Профилактическое обслуживание': 'Плановые работы',
  'Несрочно': 'Можно обсудить и не делать сразу',
};

@Injectable()
export class AnalysisService {
  analyze(jobs: string[], _brand: string, _model: string, _year: number, _mileage: number) {
    const buckets: Record<string, AnalyzedItem[]> = {};
    for (const group of GROUP_ORDER) {
      buckets[group] = [];
    }

    for (const job of jobs) {
      const rule = ruleMapping[job] || fallbackRule;
      buckets[rule.group].push({
        name: job,
        chip: rule.chip,
        explanation: rule.explanation,
      });
    }

    const groups: AnalysisGroup[] = GROUP_ORDER
      .filter((g) => buckets[g].length > 0)
      .map((g) => ({
        name: g,
        description: GROUP_DESCRIPTIONS[g],
        items: buckets[g],
      }));

    const counts = groups.map((g) => {
      const label =
        g.name === 'Обеспечение безопасности' ? 'лучше не откладывать' :
        g.name === 'Критические неисправности' ? 'стоит проверить' :
        g.name === 'Профилактическое обслуживание' ? 'плановые' :
        'можно обсудить';
      return `${g.items.length} ${label}`;
    });

    const summary = `Разобрали ${jobs.length} пунктов. ${counts.join(', ')}.`;

    return { groups, summary };
  }

  getUploadResult() {
    return mockUploadResult;
  }

  getExampleResult() {
    return exampleResult;
  }
}
