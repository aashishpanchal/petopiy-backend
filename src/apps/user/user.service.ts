import { User, UserModel } from '@/models';
import { checkPassword } from '@/lib/utils';
import { inject, singleton } from 'tsyringe';
import { CreateUserDto, UpdateUserDto } from './user.dtos';
import { ConflictError, NotFoundError, UnauthorizedError } from '@/lib/errors';

@singleton()
export class UserService {
  constructor(@inject(User) private userModel: UserModel) {}

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({
      $or: [{ email: username }, { username }],
    });
    // if user not found throw error
    if (!user) throw new NotFoundError('User account is not registered');

    // if user password not match throw error
    if (!checkPassword(password, user.password))
      throw new UnauthorizedError('Invalid credentials');

    return user;
  }

  async create(createDto: CreateUserDto) {
    const { username, email } = createDto;
    // find user using phone and email
    const user = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    // if user account already exit
    if (user) throw new ConflictError('User account already registered');

    // now create new user
    return await this.userModel.create(createDto);
  }

  async findAll(query: string, size: number, page: number) {
    const users = await this.userModel
      .find({
        $or: [{ username: query }, { email: query }],
      })
      .limit(size)
      .skip((page - 1) * size);
    // return users
    return users;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    // check user account exit or not
    if (!user) throw new NotFoundError('User account not found');
    // return user account
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    // check user account exit or not
    if (!user) throw new NotFoundError('User account not found');
    // return user account
    return user;
  }

  async update(id: string, updateDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    // check user account exit or not
    if (!user) throw new NotFoundError('User account not found');
    // update user account
    return user;
  }
}
