import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Category description is required' })
  description: string;

  @Type(() => Number)
  @IsInt({ message: 'Stay duration must be an integer in minutes' })
  @Min(15, { message: 'Minimum stay duration is 15 minutes' })
  stay_duration: number;
}
