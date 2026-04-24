import { AnalysisService } from './analysis.service';
import { ManualAnalysisDto } from './dto/manual-analysis.dto';
import { AuthService } from '../auth/auth.service';
import { AnalysisCooldownService } from './analysis-cooldown.service';
export declare class AnalysisController {
    private readonly analysisService;
    private readonly authService;
    private readonly analysisCooldownService;
    constructor(analysisService: AnalysisService, authService: AuthService, analysisCooldownService: AnalysisCooldownService);
    analyzeManual(authorization: string | undefined, dto: ManualAnalysisDto): Promise<{
        groups: import("./analysis.service").AnalysisGroup[];
        summary: string;
    }>;
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
