import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { UserModule } from '@/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports:[UserModule,RedisModule,TypeOrmModule.forFeature([Reservation])],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
