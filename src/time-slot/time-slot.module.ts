import { Module } from '@nestjs/common';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { SettingModule } from '@/setting/setting.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@/reservation/reservation.entity';

@Module({
  imports: [
    SettingModule,
    TypeOrmModule.forFeature([Reservation]),
  ],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}