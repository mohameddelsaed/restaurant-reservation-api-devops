import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SettingModule } from './setting/setting.module';
import { DateModule } from './date/date.module';
import { TimeSlotModule } from './time-slot/time-slot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
