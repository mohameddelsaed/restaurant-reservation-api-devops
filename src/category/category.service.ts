import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, file?: Express.Multer.File) {
    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (file) {
      const uploaded = await this.cloudinary.uploadImage(file, 'categories');
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    try {
      const category = this.categoryRepo.create({
        ...createCategoryDto,
        image: imageUrl ?? undefined,
        imagePublicId: imagePublicId ?? undefined,
      });
      return await this.categoryRepo.save(category);
    } catch (error) {
      if (imagePublicId) await this.cloudinary.deleteImage(imagePublicId);
      if (this.isUniqueViolation(error)) {
        throw new BadRequestException('Category name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.categoryRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.findOne(id);
    const oldPublicId = category.imagePublicId;

    let newImageUrl: string | undefined;
    let newImagePublicId: string | undefined;

    if (file) {
      const uploaded = await this.cloudinary.uploadImage(file, 'categories');
      newImageUrl = uploaded.secure_url;
      newImagePublicId = uploaded.public_id;
    }

    try {
      Object.assign(category, updateCategoryDto);
      if (newImageUrl) {
        category.image = newImageUrl;
        category.imagePublicId = newImagePublicId;
      }

      const updated = await this.categoryRepo.save(category);

      if (file && oldPublicId) {
        await this.cloudinary.deleteImage(oldPublicId);
      }

      return updated;
    } catch (error) {
      if (newImagePublicId) await this.cloudinary.deleteImage(newImagePublicId);
      if (this.isUniqueViolation(error)) {
        throw new BadRequestException('Category name is already in use by another category');
      }
      throw error;
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    await this.categoryRepo.remove(category);

    if (category.imagePublicId) {
      await this.cloudinary.deleteImage(category.imagePublicId);
    }

    return category;
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as unknown as { code?: string }).code === '23505'
    );
  }
}
