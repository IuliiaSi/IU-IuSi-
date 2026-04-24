import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { AccessService } from '../access/access.service';

@Injectable()
export class EntriesService {
  constructor(
    private readonly authService: AuthService,
    private readonly accessService: AccessService,
  ) {}

  async create(authorization: string | undefined, dto: CreateEntryDto) {
    const token = this.authService.extractBearerToken(authorization);
    const user = await this.authService.getCurrentUser(token);
    await this.accessService.requirePaidAccess(authorization);
    const supabase = this.authService.getAuthedClient(token);

    const { data: latestEntry, error: latestEntryError } = await supabase
      .from('entries')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestEntryError && latestEntryError.code !== 'PGRST116') {
      throw new BadRequestException(latestEntryError.message);
    }

    if (latestEntry?.created_at) {
      const createdAtMs = new Date(latestEntry.created_at).getTime();
      if (Number.isFinite(createdAtMs) && Date.now() - createdAtMs < 3000) {
        throw new HttpException('Подождите немного', HttpStatus.TOO_MANY_REQUESTS);
      }
    }

    const { data, error } = await supabase
      .from('entries')
      .insert([
        {
          user_id: user.id,
          user_input: dto.userInput,
          ai_response: dto.aiResponse,
        },
      ])
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async listMine(authorization: string | undefined) {
    const token = this.authService.extractBearerToken(authorization);
    const user = await this.authService.getCurrentUser(token);
    await this.accessService.requirePaidAccess(authorization);
    const supabase = this.authService.getAuthedClient(token);

    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data ?? [];
  }
}
