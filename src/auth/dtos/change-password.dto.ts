import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Old password is required!' })
  @IsString({ message: 'Old password must be a string!' })
  @MinLength(8, { message: 'Old password should be at least 8 characters!' })
  @MaxLength(16, { message: 'Old password can be at most 16 characters!' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password is required!' })
  @IsString({ message: 'New password must be a string!' })
  @MinLength(8, { message: 'New password should be at least 8 characters!' })
  @MaxLength(16, { message: 'New password can be at most 16 characters!' })
  newPassword: string;

  @IsNotEmpty({ message: 'Password confirmation is required!' })
  @IsString({ message: 'Password confirmation must be a string!' })
  @MinLength(8, {
    message: 'Password confirmation should be at least 8 characters!',
  })
  @MaxLength(16, {
    message: 'Password confirmation can be at most 16 characters!',
  })
  newPasswordConfirm: string;
}
