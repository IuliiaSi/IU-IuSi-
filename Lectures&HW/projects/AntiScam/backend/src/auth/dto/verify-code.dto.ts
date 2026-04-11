import { IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @Length(4, 4)
  code: string;
}
