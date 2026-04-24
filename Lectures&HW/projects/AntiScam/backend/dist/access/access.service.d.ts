import { AuthService } from '../auth/auth.service';
export interface UserAccessStatus {
    paid: boolean;
    role: 'user' | 'admin';
}
export declare class AccessService {
    private readonly authService;
    constructor(authService: AuthService);
    private normalizeRole;
    private getStatusForUser;
    getCurrentStatus(authorization: string | undefined): Promise<{
        paid: boolean;
        role: "user" | "admin";
        userId: string;
        email: string;
    }>;
    requirePaidAccess(authorization: string | undefined): Promise<{
        paid: boolean;
        role: "user" | "admin";
        userId: string;
        email: string;
    }>;
}
