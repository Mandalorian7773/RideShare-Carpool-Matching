export class ResponseUtil {
  static success(data: any, message?: string) {
    return {
      success: true,
      data,
      message
    };
  }

  static error(message: string, statusCode: number = 500) {
    return {
      success: false,
      error: message,
      statusCode
    };
  }
}