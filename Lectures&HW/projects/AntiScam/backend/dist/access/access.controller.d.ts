import { AccessService } from './access.service';
export declare class AccessController {
    private readonly accessService;
    constructor(accessService: AccessService);
    me(authorization: string | undefined): Promise<{
        paid: boolean;
        role: "user" | "admin";
        userId: string;
        email: string;
    }>;
}
