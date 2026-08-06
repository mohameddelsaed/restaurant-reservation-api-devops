import { parse, addMinutes, isBefore, addDays, format, isAfter } from 'date-fns';
import { SettingService } from '@/setting/setting.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '@/reservation/reservation.entity';

@Injectable()
export class TimeSlotService {
  constructor(
    private readonly settingService: SettingService,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async getTimeSlots(date?: string, guests: number = 1) {
    const settings = await this.settingService.getSettings();
    const { 
      opening_time, 
      closing_time, 
      slots_per_hour, 
      max_capacity, 
      max_stay_duration 
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

    const activeReservations = await this.reservationRepository.find({
      select: {
        seating_time: true,
        guest_count: true,
        status: true,
        category: true,
      },
      where: {
        date: targetDateStr,
        status: In([
          ReservationStatus.HOLDING,
          ReservationStatus.RESERVED,
          ReservationStatus.WAITING,
          ReservationStatus.ARRIVED,
        ]),
      },
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

    const slotStepMinutes = Math.floor(60 / slots_per_hour);
    const hours: { hour: string; isAvailable: boolean; status: 'AVAILABLE' | 'FULL' }[] = [];

    while (isBefore(current, endDate)) {
      const prospectiveStart = current;
      const prospectiveEnd = addMinutes(prospectiveStart, max_stay_duration);

      const currentCapacity = parsedReservations.reduce((total, reservation) => {
        const isOverlapping =
          isBefore(reservation.start, prospectiveEnd) &&
          isAfter(reservation.end, prospectiveStart);

        return isOverlapping ? total + reservation.guest_count : total;
      }, 0);

      const isAvailable = currentCapacity + guests <= max_capacity;

      hours.push({
        hour: format(current, 'HH:mm:ss'),
        isAvailable,
        status: isAvailable ? 'AVAILABLE' : 'FULL',
      });

      current = addMinutes(current, slotStepMinutes);
    }

    return hours;
  }
}