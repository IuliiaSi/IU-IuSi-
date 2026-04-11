import { IsArray, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ManualAnalysisDto {
  @IsArray()
  @IsString({ each: true })
  jobs: string[];

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  year: number;

  @IsNumber()
  mileage: number;
}
