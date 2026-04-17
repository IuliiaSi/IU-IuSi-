import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
export declare class EntriesController {
    private readonly entriesService;
    constructor(entriesService: EntriesService);
    create(authorization: string | undefined, dto: CreateEntryDto): Promise<any>;
    listMine(authorization: string | undefined): Promise<any[]>;
}
