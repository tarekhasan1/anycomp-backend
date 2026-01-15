// src/entities/PlatformFee.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('platform_fee')
export class PlatformFee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  fee_name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  fee_percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fee_fixed_amount: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}