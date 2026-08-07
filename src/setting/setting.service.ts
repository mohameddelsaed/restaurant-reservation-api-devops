import {
  BadRequestException,
  Inject,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { UpdateSettingsDto } from './dtos/update-settings.dto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/redis/redis.provider';
import { removeUndefined } from '@/common/utils/remove-undefined.util';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async getSettings(): Promise<Setting> {
    const cachedSettings = await this.redis.get('settings');
    let settings: Setting;

    if (!cachedSettings) {
      settings = (await this.settingRepository.findOneBy({ id: 1 })) as Setting;

      if (!settings) {
        throw new NotFoundException('Settings not found');
      }

      // Store settings data into Redis
      await this.redis.set('settings', JSON.stringify(settings), 'EX', 3600);
    } else {
      settings = JSON.parse(cachedSettings); //Parsing cached settings that was stored into Redis
    }

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<Setting> {
    const settings = await this.settingRepository.findOneBy({ id: 1 });

    if (!settings) {
      throw new NotFoundException('There is no settings found !');
    }

    const finalOpening = dto.opening_time ?? settings?.opening_time;
    const finalClosing = dto.closing_time ?? settings?.closing_time;

    if (finalOpening === finalClosing) {
      throw new BadRequestException(
        'Opening time and closing time cannot be the same',
      );
    }

    const cleanDto = removeUndefined(dto); // Remove undefined key from Dto 

    Object.assign(settings, cleanDto);

    await this.settingRepository.save(settings);

    await this.redis.set('settings', JSON.stringify(settings), 'EX', 3600); // Update cached settings

    return settings;
  }
}
