import { HydratedDocument } from 'mongoose';
export type CarDocument = HydratedDocument<Car>;
export declare class Car {
    brand: string;
    model: string;
    year: number;
    mileage: number;
}
export declare const CarSchema: import("mongoose").Schema<Car, import("mongoose").Model<Car, any, any, any, import("mongoose").Document<unknown, any, Car, any, {}> & Car & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Car, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Car>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Car> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
