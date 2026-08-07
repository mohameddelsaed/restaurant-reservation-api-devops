import { SettingService } from '@/setting/setting.service';
import { TimeSlotService } from '@/time-slot/time-slot.service';
import { Injectable } from '@nestjs/common';
import { addDays, format } from 'date-fns';

@Injectable()
export class DateService {
  constructor(
    private readonly settingService: SettingService,
    private readonly timeSlotService: TimeSlotService,
  ) {}

  async getDates() {
    const settings = await this.settingService.getSettings();
    const numOfDays = settings?.booking_window_days ?? 0;

    const today = new Date();

    const datesToFetch = Array.from({ length: numOfDays }, (_, i) => { 
      const nextDate = addDays(today, i);
      return format(nextDate, 'yyyy-MM-dd');
    });

    const days = await Promise.all(
      datesToFetch.map(async (date) => {
        const times = await this.timeSlotService.getTimeSlots(date);
        return {
          date,
          isAvailable: times.some((cur) => cur.isAvailable),
        };
      }),
    );
    return days;
  }
}
