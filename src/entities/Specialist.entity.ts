// src/entities/Specialist.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Media } from './Media.entity';
import { ServiceOffering } from './ServiceOffering.entity';

export enum SpecialistStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('specialists')
@Index('idx_specialists_status', ['status'])
@Index('idx_specialists_name', ['name'])
export class Specialist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SpecialistStatus,
    default: SpecialistStatus.DRAFT,
  })
  status: SpecialistStatus;

  @Column({ type: 'varchar', length: 255, unique: true })
  contact_email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact_phone: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website_url: string;

  @Column({ type: 'uuid', nullable: true })
  logo_id: string;

  @ManyToOne(() => Media, { nullable: true })
  @JoinColumn({ name: 'logo_id' })
  logo: Media;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ServiceOffering, (service) => service.specialist, {
    cascade: true,
  })
  service_offerings: ServiceOffering[];

  @OneToMany(() => Media, (media) => media.specialist)
  media: Media[];
}