import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { AnalysisModule } from './analysis/analysis.module';
import { EntriesModule } from './entries/entries.module';
import { AccessModule } from './access/access.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      exclude: ['/api*'],
    }),
    AuthModule,
    AccessModule,
    CarsModule,
    AnalysisModule,
    EntriesModule,
  ],
})
export class AppModule {}
