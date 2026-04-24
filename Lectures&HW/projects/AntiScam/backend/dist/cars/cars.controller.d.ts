import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
export declare class CarsController {
    private readonly carsService;
    constructor(carsService: CarsService);
    create(authorization: string | undefined, dto: CreateCarDto): Promise<import("./schemas/car.schema").Car>;
    findById(authorization: string | undefined, id: string): Promise<import("./schemas/car.schema").Car>;
}
