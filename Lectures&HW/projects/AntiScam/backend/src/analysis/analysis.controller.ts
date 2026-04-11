import { Controller, Post, Get, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { ManualAnalysisDto } from './dto/manual-analysis.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('manual')
  analyzeManual(@Body() dto: ManualAnalysisDto) {
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
