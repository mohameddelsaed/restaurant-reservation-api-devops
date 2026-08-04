import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString({ message: 'Opening time must be a string' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'Opening time must be a valid time format (HH:mm or HH:mm:ss)',
  })
  opening_time: string;

  @IsOptional()
  @IsString({ message: 'Closing time must be a string' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'Closing time must be a valid time format (HH:mm or HH:mm:ss)',
  })
  closing_time: string;

  @IsOptional()
  @IsInt({ message: 'Max capacity must be an integer' })
  @Min(1, { message: 'Max capacity must be at least 1' })
  max_capacity: number;

  @IsOptional()
  @IsInt({ message: 'Booking window days must be an integer' })
  @Min(1, { message: 'Booking window days must be at least 1 day' })
  booking_window_days: number;

  @IsOptional()
  @IsInt({ message: 'Slot interval must be an integer' })
  @Min(15, { message: 'Slot interval must be at least 15 minutes' })
  slots_per_hour: number;

  @IsOptional()
  @IsInt({ message: 'Max stay duration must be an integer' })
  @Min(15, { message: 'Max stay duration must be at least 15 minutes' })
  max_stay_duration: number;

  @IsOptional()
  @IsInt({ message: 'Max guest count must be an integer' })
  @Min(1, { message: 'Max guest count must be at least 1' })
  max_guest_count: number;
}