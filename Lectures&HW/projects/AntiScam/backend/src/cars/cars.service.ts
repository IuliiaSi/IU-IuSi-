import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Car } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CarsService {
  constructor(private readonly authService: AuthService) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new InternalServerErrorException(
        'SUPABASE_URL and SUPABASE_ANON_KEY must be set',
      );
    }
  }

  private throwSupabaseError(error: { message: string; code?: string } | null) {
    if (!error) {
      return;
    }

    const validationCodes = new Set(['23505', '23514', 'PGRST116']);
    if (validationCodes.has(error.code || '') || (error.code || '').startsWith('22')) {
      throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException(error.message);
  }

  async create(authorization: string | undefined, dto: CreateCarDto): Promise<Car> {
    const token = this.authService.extractBearerToken(authorization);
    const user = await this.authService.getCurrentUser(token);
    const supabase = this.authService.getAuthedClient(token);

    const { data, error } = await supabase
      .from('cars')
      .insert([
        {
          user_id: user.id,
          brand: dto.brand,
          model: dto.model,
          year: dto.year,
          mileage: dto.mileage,
        },
      ])
      .select('*')
      .single();

    this.throwSupabaseError(error);

    if (!data) {
      throw new BadRequestException('Не удалось сохранить автомобиль');
    }

    return data as Car;
  }

  async findById(authorization: string | undefined, id: string): Promise<Car> {
    const token = this.authService.extractBearerToken(authorization);
    const user = await this.authService.getCurrentUser(token);
    const supabase = this.authService.getAuthedClient(token);

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    this.throwSupabaseError(error);

    if (!data) {
      throw new NotFoundException('Автомобиль не найден');
    }

    return data as Car;
  }
}
