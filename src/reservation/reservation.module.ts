import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationGateway } from './reservation.gateway';
import { UserModule } from '@/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { RedisModule } from '@/redis/redis.module';
import { SettingModule } from '@/setting/setting.module';
import { CategoryModule } from '@/category/category.module';
import { NotificationModule } from '@/notification/notification.module';
import { ReservationCronService } from './reservation-cron.service';

@Module({
  imports: [
    UserModule,
    RedisModule,
    SettingModule,
    CategoryModule,
    NotificationModule,
    TypeOrmModule.forFeature([Reservation]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationGateway,ReservationCronService],
  exports: [ReservationService],
})
export class ReservationModule {}
