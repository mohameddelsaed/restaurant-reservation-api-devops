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

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @UseGuards(AuthGuard)
  getReservations() {}

  @Post()
  createReservations(@Body() data: CreateReservationDto) {
    return this.reservationService.createReservation(data);
  }

  @Patch(":id/confirm")
  confirmReservations(@Param('id',ParseUUIDPipe) id:string, @Body() data: {otp:string}) {
    return this.reservationService.confirmReservation(id,data.otp);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateReservations(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateReservationDto,
  ) { }
  
  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateReservationsStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: {status:string},
  ) {}

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteReservations(@Param('id', ParseUUIDPipe) id: string) {}
}
