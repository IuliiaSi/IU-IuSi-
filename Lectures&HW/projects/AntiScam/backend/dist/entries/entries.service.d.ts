import { AuthService } from '../auth/auth.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { AccessService } from '../access/access.service';
export declare class EntriesService {
    private readonly authService;
    private readonly accessService;
    constructor(authService: AuthService, accessService: AccessService);
    create(authorization: string | undefined, dto: CreateEntryDto): Promise<any>;
    listMine(authorization: string | undefined): Promise<any[]>;
}
