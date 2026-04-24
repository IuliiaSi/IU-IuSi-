import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { AnalysisCooldownService } from './analysis-cooldown.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AnalysisController],
  providers: [AnalysisService, AnalysisCooldownService],
})
export class AnalysisModule {}
