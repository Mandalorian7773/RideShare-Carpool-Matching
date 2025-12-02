export declare class ResponseUtil {
    static success(data: any, message?: string): {
        success: boolean;
        data: any;
        message: string | undefined;
    };
    static error(message: string, statusCode?: number): {
        success: boolean;
        error: string;
        statusCode: number;
    };
}
//# sourceMappingURL=response.util.d.ts.map