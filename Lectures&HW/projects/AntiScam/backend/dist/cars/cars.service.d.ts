import { Car } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { AuthService } from '../auth/auth.service';
export declare class CarsService {
    private readonly authService;
    constructor(authService: AuthService);
    private throwSupabaseError;
    create(authorization: string | undefined, dto: CreateCarDto): Promise<Car>;
    findById(authorization: string | undefined, id: string): Promise<Car>;
}
