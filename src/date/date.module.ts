import { Module } from '@nestjs/common';
import { DateController } from './date.controller';
import { DateService } from './date.service';
import { SettingModule } from '@/setting/setting.module';
import { TimeSlotModule } from '@/time-slot/time-slot.module';

@Module({
  imports:[SettingModule,TimeSlotModule],
  controllers: [DateController],
  providers: [DateService]
})
export class DateModule {}
