import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

export enum EventType {
  PREMIERE = 'premiere',
  SCREENING = 'screening',
  MEET_GREET = 'meet_greet',
  FESTIVAL = 'festival',
  SPECIAL_SCREENING = 'special_screening',
  DIRECTOR_QA = 'director_qa',
  MIDNIGHT_SHOW = 'midnight_show',
  ANNIVERSARY = 'anniversary',
  CHARITY = 'charity',
  PRIVATE = 'private',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  SOLD_OUT = 'sold_out',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: EventType })
  eventType: EventType;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @ManyToOne(() => Movie, { nullable: true })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column({ nullable: true })
  movieId: number;

  @OneToMany(() => Showtime, (showtime) => showtime.id)
  showtimes: Showtime[];

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  venue: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bannerImage: string;

  @Column({ type: 'json', nullable: true })
  galleryImages: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  vipPrice: number;

  @Column({ type: 'int', nullable: true })
  maxAttendees: number;

  @Column({ type: 'int', default: 0 })
  currentAttendees: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  organizer: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  organizerEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  organizerPhone: string;

  @Column({ type: 'json', nullable: true })
  sponsors: string[];

  @Column({ type: 'json', nullable: true })
  specialGuests: string[];

  @Column({ type: 'text', nullable: true })
  specialInstructions: string;

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ type: 'varchar', length: 20, nullable: true })
  ageRating: string;

  @Column({ type: 'boolean', default: true })
  allowBooking: boolean;

  @Column({ type: 'datetime', nullable: true })
  bookingStartDate: Date;

  @Column({ type: 'datetime', nullable: true })
  bookingEndDate: Date;

  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  discountDescription: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
