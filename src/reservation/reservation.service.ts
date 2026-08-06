import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { REDIS_CLIENT } from '@/redis/redis.provider';
import Redis from 'ioredis';
import { randomInt } from 'node:crypto';
import { UpdateReservationDto } from './dtos/update-reservation.dto';
import { ReservationGateway } from './reservation.gateway';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly reservationGateway: ReservationGateway,
  ) {}

  async createReservation(data: any) {
    const otp = randomInt(100000, 1000000).toString(); //Create OTP Code

    // HERE Will Send OTP Code via SMS Service

    await this.redis.set(`otp-${data.phone_number}`, otp, "EX", 300); // Save OTP Into Redis

    const reservation = this.reservationRepository.create(data);

    const savedReservation = await this.reservationRepository.save(reservation);

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange(savedReservation);

    return savedReservation;
  }

  async confirmReservation(id: string, otp: string) {
    const reservation = await this.reservationRepository.findOneBy({ id });
    
    if (!reservation) {
      throw new NotFoundException("There is no reservation with that Id!");
    }

    const savedOTP = await this.redis.get(`otp-${reservation.phone_number}`);

    if (savedOTP !== otp) {
      throw new UnauthorizedException("OTP code is incorrect");
    }

    reservation.status = ReservationStatus.RESERVED;

    const updatedReservation = await this.reservationRepository.save(reservation);

    // HERE Will Send Reservation Confirmation Via Whatsapp

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange(updatedReservation);

    return updatedReservation;
  }

  async updateReservation(id: string, updateDto: UpdateReservationDto) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    Object.assign(reservation, updateDto);
    const updatedReservation = await this.reservationRepository.save(reservation);

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange(updatedReservation);

    return updatedReservation;
  }

  async deleteReservation(id: string) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    await this.redis.del(`otp-${reservation.phone_number}`);
    await this.reservationRepository.remove(reservation);

    // Call WebSocket Gateway here to notify gateway
    this.reservationGateway.notifyReservationChange({ id, deleted: true });

    return { message: 'Reservation deleted successfully', id };
  }
}