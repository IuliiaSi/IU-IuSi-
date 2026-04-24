import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { ManualAnalysisDto } from './dto/manual-analysis.dto';
import { AuthService } from '../auth/auth.service';
import { AnalysisCooldownService } from './analysis-cooldown.service';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly authService: AuthService,
    private readonly analysisCooldownService: AnalysisCooldownService,
  ) {}

  @Post('manual')
  async analyzeManual(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: ManualAnalysisDto,
  ) {
    const token = this.authService.extractBearerToken(authorization);
    const user = await this.authService.getCurrentUser(token);
    const actorKey = `user:${user.id}`;
    this.analysisCooldownService.enforceCooldown(actorKey);
    return this.analysisService.analyze(dto.jobs, dto.brand, dto.model, dto.year, dto.mileage);
  }

  @Post('upload')
  async analyzeUpload() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return this.analysisService.getUploadResult();
  }

  @Get('example')
  getExample() {
    return this.analysisService.getExampleResult();
  }
}
