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
export declare class AnalysisService {
    analyze(jobs: string[], _brand: string, _model: string, _year: number, _mileage: number): {
        groups: AnalysisGroup[];
        summary: string;
    };
    getUploadResult(): {
        groups: {
            name: string;
            description: string;
            items: {
                name: string;
                chip: string;
                explanation: string;
            }[];
        }[];
        summary: string;
    };
    getExampleResult(): {
        groups: {
            name: string;
            description: string;
            items: {
                name: string;
                chip: string;
                explanation: string;
            }[];
        }[];
        summary: string;
    };
}
