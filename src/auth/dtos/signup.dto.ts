import { UserRole } from '@/user/user.entity';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString({ message: 'Name must be a string!' })
  @IsNotEmpty({ message: 'Name is required!' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address!' })
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @IsString({ message: 'Password must be a string!' })
  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password should be at least 8 characters!' })
  @MaxLength(16, { message: 'Password can be at most 16 characters!' })
  password: string;

  @IsString({ message: 'Password confirmation must be a string!' })
  @IsNotEmpty({ message: 'Password confirmation is required!' })
  passwordConfirm: string;

  @IsString({ message: 'Phone number should be a string' })
  @IsOptional()
  phone_number: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be a valid UserRole (manager or receptionist)',
  })
  role: UserRole;
}
