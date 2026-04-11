import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/chestnaya-otsenka',
    ),
    AuthModule,
    CarsModule,
    AnalysisModule,
  ],
})
export class AppModule {}
