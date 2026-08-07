import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email or password is an incorrect !');
    }

    const token = await this.jwtService.signAsync({ id: user?.id });

    return { user, token };
  }

  async changePassword(data: ChangePasswordDto, user: User) {
    const { oldPassword, newPassword, newPasswordConfirm } = data;

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('Password is an incorrect !');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password!',
      );
    }

    if (newPassword !== newPasswordConfirm) {
      throw new BadRequestException("Passwords don't match");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userService.updatePassword(user.id, hashedPassword);

    const token = await this.jwtService.signAsync({ id: user?.id });

    return { user, token };
  }
}
