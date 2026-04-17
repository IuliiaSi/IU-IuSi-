import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
export declare class CarsService {
    private carModel;
    constructor(carModel: Model<CarDocument>);
    create(dto: CreateCarDto): Promise<Car>;
    findById(id: string): Promise<Car>;
}
