import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class EntriesService {
  constructor(private readonly authService: AuthService) {}

  async create(authorization: string | undefined, dto: CreateEntryDto) {
    const token = this.authService.extractBearerToken(authorization);
    const user = await this.authService.getCurrentUser(token);
    const supabase = this.authService.getAuthedClient(token);

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
