import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { User } from '@/user/user.entity';
import { GetUser } from '@/decorators/get-user.decorator';
import { AuthGuard } from '@/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  ChangePassword(@Body() data: ChangePasswordDto, @GetUser() user: User) {
    return this.authService.changePassword(data, user);
  }
}
