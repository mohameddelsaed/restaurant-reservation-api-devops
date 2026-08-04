import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { UpdateSettingsDto } from './dtos/update-settings.dto';

@Injectable()
export class SettingService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async onModuleInit() {
    const count = await this.settingRepository.count();

    if (count === 0) {
      const defaultSettings = this.settingRepository.create({
        id: 1,
        opening_time: '09:00',
        closing_time: '23:00',
        max_capacity: 50,
        booking_window_days: 10,
        slots_per_hour: 30,
        max_stay_duration: 120,
        max_guest_count: 8,
      });

      await this.settingRepository.save(defaultSettings);
      console.log(
        '✅ Default settings record (ID: 1) initialized successfully.',
      );
    }
  }

  async getSettings(): Promise<Setting> {
    const settings = await this.settingRepository.findOneBy({ id: 1 });

    if (!settings) {
      throw new NotFoundException('Settings not initialized yet');
    }

    return settings;
  }

  async updateSettings(data: UpdateSettingsDto): Promise<Setting> {
    const existing = await this.getSettings();

    const finalOpening = data.opening_time ?? existing.opening_time;
    const finalClosing = data.closing_time ?? existing.closing_time;

    if (finalOpening === finalClosing) {
      throw new BadRequestException(
        'Opening time and closing time cannot be the same',
      );
    }

    await this.settingRepository.update(existing.id, data);

    return this.getSettings();
  }
}
