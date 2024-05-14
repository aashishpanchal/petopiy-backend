import httpStatus from 'http-status';
import { HttpRes } from './http.response';

/**
 * API Response Class
 */
export class ApiRes {
  /**
   * OK Response function.
   */
  static ok(result: any, message?: string) {
    return new HttpRes(result, httpStatus.OK, message || 'Success');
  }

  /**
   * Created Response function.
   */
  static created(result: any, message?: string) {
    return new HttpRes(
      result,
      httpStatus.CREATED,
      message || 'Resource created successfully',
    );
  }
}
