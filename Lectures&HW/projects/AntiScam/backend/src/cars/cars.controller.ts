import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  create(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: CreateCarDto,
  ) {
    return this.carsService.create(authorization, dto);
  }

  @Get(':id')
  findById(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') id: string,
  ) {
    return this.carsService.findById(authorization, id);
  }
}
