import { Module } from '@nestjs/common';
import { DateController } from './date.controller';
import { DateService } from './date.service';
import { SettingModule } from '@/setting/setting.module';

@Module({
  imports:[SettingModule],
  controllers: [DateController],
  providers: [DateService]
})
export class DateModule {}
