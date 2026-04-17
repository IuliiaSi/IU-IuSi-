import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  create(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: CreateEntryDto,
  ) {
    return this.entriesService.create(authorization, dto);
  }

  @Get()
  listMine(@Headers('authorization') authorization: string | undefined) {
    return this.entriesService.listMine(authorization);
  }
}
