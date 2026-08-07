import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  @IsNotEmpty({ message: '' })
  phone_number: string;
}
