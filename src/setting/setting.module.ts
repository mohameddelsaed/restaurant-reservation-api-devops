import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './setting.entity';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Setting])],
  controllers: [SettingController],
  providers: [SettingService]
})
export class SettingModule {}
