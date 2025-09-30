import mysql from "mysql2/promise";
export declare const dbConfig: {
    host: string;
    port: number;
    user: string;
    password: string | undefined;
    database: string;
};
export declare const pool: mysql.Pool;
export declare function testDatabaseConnection(): Promise<boolean>;
//# sourceMappingURL=database.d.ts.map