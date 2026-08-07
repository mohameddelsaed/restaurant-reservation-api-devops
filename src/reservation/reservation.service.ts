import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { REDIS_CLIENT } from '@/redis/redis.provider';
import Redis from 'ioredis';
import { randomInt } from 'node:crypto';
import { UpdateReservationDto } from './dtos/update-reservation.dto';
import { ReservationGateway } from './reservation.gateway';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { CategoryService } from '@/category/category.service';
import { NotificationService } from '@/notification/notification.service';
import { format } from 'date-fns';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly reservationGateway: ReservationGateway,
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService,
  ) {}

  async getReservations(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find();
    return reservations;
  }

  async createReservation(dto: CreateReservationDto) {
    const category = await this.categoryService.findOne(dto.category_id);

    // Check Client Selected Category
    if (!category) {
      throw new NotFoundException('There is no category with that id !');
    }

    // Here we will check about "Date" and "Time" availability

    const otp = randomInt(100000, 1000000).toString(); //Create OTP Code

    await this.redis.set(`otp-${dto.phone_number}`, otp, 'EX', 300); // Save OTP Into Redis

    // Send OTP Code via SMS Service
    // await this.notificationService.sendSMSNotification(`+2${dto.phone_number}`, `Your OTP code is : ${otp}`);
    await this.notificationService.sendWhatsappNotification(
      `+2${dto.phone_number}`,
      `Your OTP code is : ${otp}`,
    );

    const { category_id, ...reservationData } = dto;

    const reservation = this.reservationRepository.create({
      ...reservationData,
      category: {
        id: category.id,
        name: category.name,
        stay_duration: category.stayDuration,
      },
    });

    await this.reservationRepository.save(reservation);

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange(reservation);

    return reservation;
  }

  async confirmReservation(id: string, otp: string) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new NotFoundException('There is no reservation with that Id!');
    }

    if (reservation.status === ReservationStatus.RESERVED) {
      throw new BadRequestException('Reservation is already confirmed!');
    }

    const savedOTP = await this.redis.get(`otp-${reservation.phone_number}`); // Get OTP Code From Redis

    if (!savedOTP || savedOTP !== otp) {
      throw new UnauthorizedException('OTP code is incorrect or has expired!');
    }

    await this.redis.del(`otp-${reservation.phone_number}`); //Remove OTP Code From Redis After Validation Check

    reservation.status = ReservationStatus.RESERVED;

    await this.reservationRepository.save(reservation);

    const { phone_number, status, created_at, updated_at, ...restData } =
      reservation;

    // Send Reservation Confirmation Via Whatsapp
    await this.notificationService.sendReservationConfirmation(
      `+2${phone_number}`,
      {
        ...restData,
        cancel_url: '',
      },
    );

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange(reservation);

    return reservation;
  }

  async updateReservation(id: string, updateDto: UpdateReservationDto) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (updateDto.category_id) {
      const category = await this.categoryService.findOne(
        updateDto.category_id,
      );

      // Check Client Selected Category
      if (!category) {
        throw new NotFoundException('There is no category with that id !');
      }
      const { category_id, ...restUpdate } = updateDto;
      Object.assign(reservation, {
        ...restUpdate,
        category: {
          id: category.id,
          name: category.name,
          stay_duration: category.stayDuration,
        },
      });
    } else {
      Object.assign(reservation, updateDto);
    }

    await this.reservationRepository.save(reservation);

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange(reservation);

    return reservation;
  }

  async updateReservationStatus(id: string, status: ReservationStatus) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = status;

    await this.reservationRepository.save(reservation);

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange(reservation);

    if (reservation.status === ReservationStatus.RESERVED) {
      // Here Will Send Whatsapp notification about Reservation Confirmation
    }

    return reservation;
  }

  async deleteReservation(id: string) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    await this.reservationRepository.remove(reservation);

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange({ id, deleted: true });

    return { message: 'Reservation deleted successfully' };
  }

  async cancelReservation(id: string) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new NotFoundException('There is no reservation with that id!');
    }

    // reservation.status = ReservationStatus.
  }

  async markOverdueAsWaiting() {
    const today = new Date();
    const currentDateStr = format(today, 'yyyy-MM-dd');
    const currentTimeStr = format(today, 'HH:mm:ss');

    await this.reservationRepository.update(
      {
        date: currentDateStr,
        status: ReservationStatus.RESERVED,
        seating_time: LessThanOrEqual(currentTimeStr),
      },
      {
        status: ReservationStatus.WAITING,
      },
    );
  }

  async deleteReservationsOlderThan(cutoffDate: Date) {
    await this.reservationRepository.delete({
      date: LessThan(format(cutoffDate, 'yyyy-MM-dd')),
    });
  }
}
