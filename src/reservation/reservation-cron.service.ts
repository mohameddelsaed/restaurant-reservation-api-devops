import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationService } from './reservation.service';
import { SettingService } from '@/setting/setting.service';

@Injectable()
export class ReservationCronService {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly settingService: SettingService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleWaitingStatus() {
    await this.reservationService.markOverdueAsWaiting();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleDailyCleanup() {
    const { booking_window_days } = await this.settingService.getSettings();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - booking_window_days);

    await this.reservationService.deleteReservationsOlderThan(cutoffDate);
  }
}
