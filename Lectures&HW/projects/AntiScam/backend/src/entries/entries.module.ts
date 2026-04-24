import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccessModule } from '../access/access.module';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';

@Module({
  imports: [AuthModule, AccessModule],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
