import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { UserRole } from '@/user/user.entity';
import { UpdateSettingsDto } from './dtos/update-settings.dto';

@Controller('settings')
@UseGuards(AuthGuard,RolesGuard)
@Roles(UserRole.MANAGER)
export class SettingController {
  constructor(private readonly settingService: SettingService) { }
  
  @Get()
  getSettings() {
    return this.settingService.getSettings();
  }

  @Patch()
  updateSettings(@Body() data:UpdateSettingsDto) {
    return this.settingService.updateSettings(data);
  }
}
