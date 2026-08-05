import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface CategorySnapshot {
  id: number;
  name: string;
  stay_duration: number;
}

export enum ReservationStatus {
  HOLDING = 'holding',
  RESERVED = 'reserved',
  WAITING = 'waiting',
  ARRIVED = 'arrived',
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ length: 11 })
  phone_number: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  seating_time: string;

  @Column({ type: 'int' })
  guest_count: number;

  @Column({ type: 'jsonb' })
  category: CategorySnapshot;

  @Column({type:'enum',enum:ReservationStatus,default:ReservationStatus.HOLDING})
  status: ReservationStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
