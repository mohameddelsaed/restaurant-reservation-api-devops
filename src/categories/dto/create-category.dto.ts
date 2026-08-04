import { IsString, IsNotEmpty, IsInt, IsOptional, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsInt({ message: 'Stay duration must be an integer in minutes' })
  @Min(15, { message: 'Minimum stay duration is 15 minutes' })
  stayDuration!: number;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Shift start time must be in HH:mm format (e.g. 12:00)',
  })
  shiftStart?: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Shift end time must be in HH:mm format (e.g. 23:00)',
  })
  shiftEnd?: string;
}
