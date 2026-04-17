import { AuthService } from '../auth/auth.service';
import { CreateEntryDto } from './dto/create-entry.dto';
export declare class EntriesService {
    private readonly authService;
    constructor(authService: AuthService);
    create(authorization: string | undefined, dto: CreateEntryDto): Promise<any>;
    listMine(authorization: string | undefined): Promise<any[]>;
}
