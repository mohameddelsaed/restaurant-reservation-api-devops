import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationGateway } from './reservation.gateway';
import { UserModule } from '@/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { RedisModule } from '@/redis/redis.module';
import { SettingModule } from '@/setting/setting.module';

@Module({
  imports: [UserModule, RedisModule,SettingModule, TypeOrmModule.forFeature([Reservation])],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationGateway],
  exports: [ReservationService],
})
export class ReservationModule {}