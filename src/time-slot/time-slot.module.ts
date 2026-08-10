import { Module } from '@nestjs/common';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { SettingModule } from '@/setting/setting.module';
import { ReservationModule } from '@/reservation/reservation.module';

@Module({
  imports: [SettingModule, ReservationModule],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}
