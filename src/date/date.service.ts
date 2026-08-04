import { SettingService } from '@/setting/setting.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  constructor(private readonly settingService: SettingService) {}

  async getDates() {
    const settings = await this.settingService.getSettings();
    const numOfDays = settings?.booking_window_days;

    const days: { date: string; isAvailable: boolean }[] = [];

    if (numOfDays > 0) {
      const today = new Date();

      for (let i = 0; i < numOfDays; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);

        days.push({
          date: nextDay.toISOString().split('T')[0],
          isAvailable: true,
        });

      } 
    }

    return days;
  }
}
