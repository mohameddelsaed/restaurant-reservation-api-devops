import { Controller, Get } from '@nestjs/common';
import { TimeSlotService } from '../time-slot/time-slot.service';

@Controller('time-slots')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) { }
  
  @Get()
  getTimeSlots() {
    return this.timeSlotService.getTimeSlots();
  }
}
