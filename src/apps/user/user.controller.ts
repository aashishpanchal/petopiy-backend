import { Request } from 'express';
import { singleton } from 'tsyringe';
import { ApiRes } from '@/lib/response';
import { UpdateMeDto } from './user.dtos';

@singleton()
export class UserController {
  async getMe(req: Request) {
    // get user from request
    const user = req.user;
    // send user data
    return ApiRes.ok(user, 'User data');
  }

  async updateMe(req: Request<any, any, UpdateMeDto>) {
    // get user from req
    let user = req.user;
    // assign data to user
    Object.assign(req.user, req.body || {});
    // update save
    user = await user.save();
    // send user data
    return ApiRes.ok(user.toJSON(), 'Update me successfully');
  }
}
