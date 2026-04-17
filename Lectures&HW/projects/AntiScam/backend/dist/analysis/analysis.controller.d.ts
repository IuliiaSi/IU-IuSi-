import { AnalysisService } from './analysis.service';
import { ManualAnalysisDto } from './dto/manual-analysis.dto';
export declare class AnalysisController {
    private readonly analysisService;
    constructor(analysisService: AnalysisService);
    analyzeManual(dto: ManualAnalysisDto): {
        groups: import("./analysis.service").AnalysisGroup[];
        summary: string;
    };
    analyzeUpload(): Promise<{
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
    }>;
    getExample(): {
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
