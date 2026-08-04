import { UserService } from '@/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Please login to access this resource');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.userService.findOne(payload.id);

      request.user = user;        
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
