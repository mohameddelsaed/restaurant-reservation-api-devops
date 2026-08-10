import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';
import { SettingService } from '@/setting/setting.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly settingService: SettingService,
  ) {}

  async create(dto: CreateCategoryDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Category image is required');
    }

    const setting = await this.settingService.getSettings();
    const { max_stay_duration } = setting;

    if (dto.stay_duration > max_stay_duration) {
      throw new BadRequestException(
        `Stay duration cannot exceed the allowed max duration of ${max_stay_duration} minutes`,
      );
    }

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    const uploaded = await this.cloudinaryService.uploadImage(file, 'categories'); //Upload image to cloudinary
    imageUrl = uploaded.secure_url;
    imagePublicId = uploaded.public_id;

    try {
      const category = this.categoryRepository.create({
        ...dto,
        image: imageUrl,
        image_public_id: imagePublicId,
      });
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (imagePublicId) await this.cloudinaryService.deleteImage(imagePublicId);
      throw error;
    }
  }

  async findAll(query: Record<string, any>) {
    return await this.categoryRepository.find(query);
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('There is no category with that Id!');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.findOne(id);
    const oldPublicId = category.image_public_id;

    let newImageUrl: string | undefined;
    let newImagePublicId: string | undefined;

    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file, 'categories');
      newImageUrl = uploaded.secure_url;
      newImagePublicId = uploaded.public_id;
    }

    if (dto.stay_duration) {
      const setting = await this.settingService.getSettings();
      if (dto.stay_duration > setting.max_stay_duration) {
        throw new BadRequestException(
          `Stay duration cannot exceed the allowed max duration of ${setting.max_stay_duration} minutes`,
        );
      }
    }

    try {
      Object.assign(category, dto);
      if (newImageUrl) {
        category.image = newImageUrl;
        category.image_public_id = newImagePublicId!;
      }

      const updated = await this.categoryRepository.save(category);

      if (file && oldPublicId) {
        await this.cloudinaryService.deleteImage(oldPublicId);
      }

      return updated;
    } catch (error) {
      if (newImagePublicId) await this.cloudinaryService.deleteImage(newImagePublicId);
      throw error;
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    await this.categoryRepository.remove(category);

    if (category.image_public_id) {
      await this.cloudinaryService.deleteImage(category.image_public_id);
    }

    return { message: 'Category deleted successfully' };
  }
}
