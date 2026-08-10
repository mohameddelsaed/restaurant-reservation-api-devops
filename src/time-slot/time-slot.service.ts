import {
  parse,
  addMinutes,
  isBefore,
  addDays,
  format,
  isAfter,
} from 'date-fns';
import { SettingService } from '@/setting/setting.service';
import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { ReservationStatus } from '@/reservation/reservation.entity';
import { ReservationService } from '@/reservation/reservation.service';

@Injectable()
export class TimeSlotService {
  constructor(
    private readonly settingService: SettingService,
    private readonly reservationService: ReservationService,
  ) {}

  async getTimeSlots(date?: string, guests: number = 1) {
    const settings = await this.settingService.getSettings();
    const {
      opening_time,
      closing_time,
      slots_per_hour,
      max_capacity,
      max_stay_duration,
    } = settings;

    const targetDateStr = date || format(new Date(), 'yyyy-MM-dd');

    let current = parse(
      `${targetDateStr} ${opening_time}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date(),
    );
    let endDate = parse(
      `${targetDateStr} ${closing_time}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date(),
    );

    if (!isBefore(current, endDate)) {
      endDate = addDays(endDate, 1);
    }

    const activeReservations = await this.reservationService.getReservations({
      fields: 'seating_time,guest_count,status,category',
      date: targetDateStr,
      status: Not(ReservationStatus.CANCELED),
    });

    const parsedReservations = activeReservations.map((res) => {
      const start = parse(
        `${targetDateStr} ${res.seating_time}`,
        'yyyy-MM-dd HH:mm:ss',
        new Date(),
      );

      const duration = res.category?.stay_duration || max_stay_duration;
      const end = addMinutes(start, duration);

      return { start, end, guest_count: res.guest_count };
    });

    const hours: {
      hour: string;
      isAvailable: boolean;
      status: 'available' | 'unAvailable';
    }[] = [];

    while (isBefore(current, endDate)) {
      const prospectiveStart = current;
      const prospectiveEnd = addMinutes(prospectiveStart, max_stay_duration);

      const currentCapacity = parsedReservations.reduce(
        (total, reservation) => {
          const isOverlapping =
            isBefore(reservation.start, prospectiveEnd) &&
            isAfter(reservation.end, prospectiveStart);

          return isOverlapping ? total + reservation.guest_count : total;
        },
        0,
      );

      const isAvailable = currentCapacity + guests <= max_capacity;

      hours.push({
        hour: format(current, 'HH:mm:ss'),
        isAvailable,
        status: isAvailable ? 'available' : 'unAvailable',
      });

      current = addMinutes(current, slots_per_hour);
    }

    return hours;
  }
}
