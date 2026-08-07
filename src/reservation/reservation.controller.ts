import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { UpdateReservationDto } from './dtos/update-reservation.dto';
import { UpdateReservationStatusDto } from './dtos/update-reservation-status.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @UseGuards(AuthGuard)
  getReservations() {
    return this.reservationService.getReservations();
  }

  @Post()
  createReservations(@Body() dto: CreateReservationDto) {
    return this.reservationService.createReservation(dto);
  }

  @Patch(":id/confirm")
  confirmReservations(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { otp: string }) {
    return this.reservationService.confirmReservation(id, dto.otp);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateReservations(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservationService.updateReservation(id, dto);
  }
  
  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateReservationsStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.reservationService.updateReservationStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteReservations(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.deleteReservation(id);
  }
}