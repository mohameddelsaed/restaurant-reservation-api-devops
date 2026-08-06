import { Controller, Get, Query } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';

@Controller('time-slots')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Get()
  getTimeSlots(
    @Query('date') date?: string,
    @Query('guests') guests?: number,
  ) {
    return this.timeSlotService.getTimeSlots(
      date,
      guests ? Number(guests) : 1,
    );
  }
}