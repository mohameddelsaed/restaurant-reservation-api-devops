import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time' })
  opening_time: string;

  @Column({ type: 'time' })
  closing_time: string;

  @Column()
  max_capacity: number;

  @Column({ default: 10 })
  booking_window_days: number;

  @Column({default:30})
  slots_per_hour: number;

  @Column()
  max_stay_duration: number; 

  @Column()
  max_guest_count: number;

  @UpdateDateColumn()
  updated_at: Date;
}
