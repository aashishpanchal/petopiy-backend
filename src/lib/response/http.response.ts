import httpStatus from 'http-status';

/**
 * HTTP JSON Response Class
 */
export class HttpRes {
  declare result: any;
  declare message: string;
  declare statusCode: number;

  /**
   * Creates an HTTP JSON response.
   * @param data - The data to be sent in the response.
   * @param statusCode - The HTTP status code (default: 200 OK).
   * @param message - The message associated with the response (default: "Success").
   */
  constructor(
    result: any = {},
    status: number = httpStatus.OK,
    message: string = 'Success',
  ) {
    this.statusCode = status;
    this.message = message;
    this.result = result;
  }

  static isHttpRes(obj: unknown): obj is HttpRes {
    return obj instanceof HttpRes;
  }
}
