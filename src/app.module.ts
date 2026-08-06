import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SettingModule } from './setting/setting.module';
import { DateModule } from './date/date.module';
import { TimeSlotModule } from './time-slot/time-slot.module';
import { ReservationModule } from './reservation/reservation.module';
import { RedisModule } from './redis/redis.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: true,
      },
    }),
    UserModule,
    AuthModule,
    SettingModule,
    DateModule,
    TimeSlotModule,
    ReservationModule,
    RedisModule,
    CloudinaryModule,
    CategoryModule,
  ],
})
export class AppModule {}
