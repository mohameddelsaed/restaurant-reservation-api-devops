import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './setting.entity';
import { UserModule } from '@/user/user.module';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports: [UserModule,RedisModule, TypeOrmModule.forFeature([Setting])],
  controllers: [SettingController],
  providers: [SettingService],
  exports:[SettingService]
})
export class SettingModule {}
