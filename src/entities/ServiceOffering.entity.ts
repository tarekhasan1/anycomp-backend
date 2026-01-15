// src/entities/ServiceOffering.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Specialist } from './Specialist.entity';
import { PlatformFee } from './PlatformFee.entity';

@Entity('service_offerings')
@Index('idx_service_specialist', ['specialist_id'])
export class ServiceOffering {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  specialist_id: string;

  @ManyToOne(() => Specialist, (specialist) => specialist.service_offerings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist: Specialist;

  @Column({ type: 'varchar', length: 255 })
  service_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  service_type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  platform_fee_id: string;

  @ManyToOne(() => PlatformFee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'platform_fee_id' })
  platform_fee: PlatformFee;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}