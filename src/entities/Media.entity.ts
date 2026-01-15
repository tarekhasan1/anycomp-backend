// src/entities/Media.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Specialist } from './Specialist.entity';

export enum MediaType {
  LOGO = 'logo',
  DOCUMENT = 'document',
  IMAGE = 'image',
}

@Entity('media')
@Index('idx_media_specialist', ['specialist_id'])
@Index('idx_media_type', ['media_type'])
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  specialist_id: string;

  @ManyToOne(() => Specialist, (specialist) => specialist.media, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist: Specialist;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'varchar', length: 1000 })
  file_url: string;

  @Column({ type: 'varchar', length: 50 })
  file_type: string;

  @Column({ type: 'integer', nullable: true })
  file_size: number;

  @Column({ type: 'enum', enum: MediaType })
  media_type: MediaType;

  @CreateDateColumn()
  uploaded_at: Date;
}