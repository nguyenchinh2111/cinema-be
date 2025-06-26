import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

export enum TicketStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  USED = 'used',
  EXPIRED = 'expired',
}

export enum SeatType {
  STANDARD = 'standard',
  VIP = 'vip',
  PREMIUM = 'premium',
  COUPLE = 'couple',
  WHEELCHAIR = 'wheelchair',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  ticketCode: string;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  movieId: number;

  @ManyToOne(() => Showtime)
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  @Column()
  showtimeId: number;

  @Column({ type: 'varchar', length: 100 })
  customerName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customerEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  customerPhone: string;

  @Column({ type: 'varchar', length: 10 })
  seatNumber: string;

  @Column({ type: 'varchar', length: 5 })
  seatRow: string;

  @Column({ type: 'enum', enum: SeatType, default: SeatType.STANDARD })
  seatType: SeatType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalPrice: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  voucherCode: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.PENDING })
  status: TicketStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  paymentTransactionId: string;

  @Column({ type: 'datetime', nullable: true })
  paymentDate: Date;

  @Column({ type: 'datetime', nullable: true })
  bookingDate: Date;

  @Column({ type: 'datetime', nullable: true })
  expiryDate: Date;

  @Column({ type: 'text', nullable: true })
  specialRequests: string;

  @Column({ type: 'json', nullable: true })
  additionalServices: string[];

  @Column({ type: 'boolean', default: false })
  isCheckedIn: boolean;

  @Column({ type: 'datetime', nullable: true })
  checkInTime: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  qrCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
