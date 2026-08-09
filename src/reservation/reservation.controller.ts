import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { UpdateReservationDto } from './dtos/update-reservation.dto';
import { UpdateReservationStatusDto } from './dtos/update-reservation-status.dto';
import { ReservationStatus } from './reservation.entity';
import { ConfirmReservationDto } from './dtos/confirm-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @UseGuards(AuthGuard)
  getReservations(@Query() query:Record<string, any>) {
    return this.reservationService.getReservations(query);
  }

  @Post()
  createReservations(@Body() dto: CreateReservationDto) {
    return this.reservationService.createReservation(dto);
  }

  @Patch(":id/confirm")
  confirmReservations(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ConfirmReservationDto) {
    return this.reservationService.confirmReservation(id, dto);
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
    if (dto.status === ReservationStatus.CANCELED) {
      return this.reservationService.cancelReservation(id);    
    }
    return this.reservationService.updateReservationStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteReservations(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.deleteReservation(id);
  }
}