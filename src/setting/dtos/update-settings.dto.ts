import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateSettingsDto {
  @IsString({ message: 'Opening time must be a string' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'Opening time must be a valid time format (HH:mm or HH:mm:ss)',
  })
  @IsOptional()
  opening_time: string;

  @IsString({ message: 'Closing time must be a string' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'Closing time must be a valid time format (HH:mm or HH:mm:ss)',
  })
  @IsOptional()
  closing_time: string;

  @IsInt({ message: 'Max capacity must be an integer' })
  @Min(1, { message: 'Max capacity must be at least 1' })
  @IsOptional()
  max_capacity: number;

  @IsInt({ message: 'Booking window days must be an integer' })
  @Min(1, { message: 'Booking window days must be at least 1 day' })
  @IsOptional()
  booking_window_days: number;

  @IsInt({ message: 'Slot interval must be an integer' })
  @Min(15, { message: 'Slot interval must be at least 15 minutes' })
  @IsOptional()
  slots_per_hour: number;

  @IsInt({ message: 'Max stay duration must be an integer' })
  @Min(15, { message: 'Max stay duration must be at least 15 minutes' })
  @IsOptional()
  max_stay_duration: number;

  @IsInt({ message: 'Max guest count must be an integer' })
  @Min(1, { message: 'Max guest count must be at least 1' })
  @IsOptional()
  max_guest_count: number;
}
