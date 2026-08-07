import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { UserRole } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  createReceptionist(@Body() dto:CreateUserDto) {
    return this.userService.createReceptionist(dto);
  }

}
