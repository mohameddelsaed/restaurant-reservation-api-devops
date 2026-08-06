import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'stay_duration' })
  stayDuration!: number;

  @Column({ name: 'shift_start', type: 'varchar', default: '12:00' })
  shiftStart!: string;

  @Column({ name: 'shift_end', type: 'varchar', default: '23:59' })
  shiftEnd!: string;

  @Column({ nullable: true })
  image?: string;

  @Exclude()
  @Column({ name: 'image_public_id', nullable: true })
  imagePublicId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
