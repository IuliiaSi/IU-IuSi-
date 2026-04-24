import { Equals, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsBoolean()
  @Equals(true, { message: 'Подтвердите, что вы не робот' })
  humanConfirmed: boolean;
}
