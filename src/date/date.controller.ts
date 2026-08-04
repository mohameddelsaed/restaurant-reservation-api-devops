import { Controller, Get } from '@nestjs/common';
import { DateService } from './date.service';

@Controller('dates')
export class DateController {
  constructor(private readonly dateService: DateService) {}
  
  @Get()
  getDates() {
    return this.dateService.getDates();
  }
}
