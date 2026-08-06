import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { REDIS_CLIENT } from '@/redis/redis.provider';
import Redis from 'ioredis';
import { randomInt } from 'node:crypto';
import { UpdateReservationDto } from './dtos/update-reservation.dto';
import { ReservationGateway } from './reservation.gateway';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { SettingService } from '@/setting/setting.service';
import { CategoryService } from '@/category/category.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly reservationGateway: ReservationGateway,
    private readonly settingService: SettingService,
    private readonly categoryService: CategoryService,
  ) {}

  async createReservation(dto: CreateReservationDto) {
    const category = await this.categoryService.findOne(dto.category_id);

    // Check Client Selected Category
    if (!category) {
      throw new NotFoundException('There is no category with that id !');
    }

    const otp = randomInt(100000, 1000000).toString(); //Create OTP Code
    console.log(otp);

    // HERE Will Send OTP Code via SMS Service

    await this.redis.set(`otp-${dto.phone_number}`, otp, 'EX', 300); // Save OTP Into Redis

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

    // HERE Will Send Reservation Confirmation Via Whatsapp

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
}
