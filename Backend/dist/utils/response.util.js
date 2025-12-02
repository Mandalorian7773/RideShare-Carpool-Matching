"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(data, message) {
        return {
            success: true,
            data,
            message
        };
    }
    static error(message, statusCode = 500) {
        return {
            success: false,
            error: message,
            statusCode
        };
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.util.js.map