import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { ReservationStatus } from "../reservation.entity";

export interface CategorySnapshot {
  id: string; 
  name: string;
  stay_duration: number;
}

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^01[0125][0-9]{8}$/, {
    message: 'phone_number must be a valid Egyptian mobile number',
  })
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'seating_time must be in HH:mm or HH:mm:ss format',
  })
  seating_time: string;

  @IsInt()
  @Min(1)
  guest_count: number;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;
}