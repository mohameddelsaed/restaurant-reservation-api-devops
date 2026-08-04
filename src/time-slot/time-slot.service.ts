import { parse, addMinutes, isBefore, addDays, format } from 'date-fns';
import { SettingService } from '@/setting/setting.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeSlotService {
  constructor(private readonly settingService: SettingService) {}

  async getTimeSlots() {
    const settings = await this.settingService.getSettings();
    const { opening_time, closing_time, slots_per_hour } = settings;

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    let current = parse(
      `${todayStr} ${opening_time}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date(),
    );
    let endDate = parse(
      `${todayStr} ${closing_time}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date(),
    );
    
    if (!isBefore(current, endDate)) {
      endDate = addDays(endDate, 1);
    }

    const hours: { hour: string; isAvailable: boolean }[] = [];

    while (isBefore(current, endDate)) {
      hours.push({ hour: format(current, 'HH:mm:ss'), isAvailable: true });
      current = addMinutes(current, slots_per_hour);
    }

    return hours;
  }
}
