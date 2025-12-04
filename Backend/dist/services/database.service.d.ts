import { PoolClient } from 'pg';
declare class DatabaseService {
    private pool;
    constructor();
    initialize(): Promise<void>;
    getClient(): Promise<PoolClient>;
    close(): Promise<void>;
}
export declare const dbService: DatabaseService;
export {};
//# sourceMappingURL=database.service.d.ts.map