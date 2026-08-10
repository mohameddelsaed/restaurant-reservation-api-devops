import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { UserModule } from '@/user/user.module';
import { SettingModule } from '@/setting/setting.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [
    SettingModule,
    UserModule,
    CloudinaryModule,
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
