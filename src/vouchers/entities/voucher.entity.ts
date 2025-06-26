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

export enum VoucherType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_ONE_GET_ONE = 'buy_one_get_one',
  FREE_ITEM = 'free_item',
  COMBO_DEAL = 'combo_deal',
}

export enum VoucherStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  USED_UP = 'used_up',
}

export enum DiscountScope {
  ALL_MOVIES = 'all_movies',
  SPECIFIC_MOVIE = 'specific_movie',
  SPECIFIC_GENRE = 'specific_genre',
  WEEKEND_ONLY = 'weekend_only',
  WEEKDAY_ONLY = 'weekday_only',
  PREMIUM_SCREENS = 'premium_screens',
  CONCESSIONS = 'concessions',
}

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: VoucherType })
  voucherType: VoucherType;

  @Column({ type: 'enum', enum: VoucherStatus, default: VoucherStatus.ACTIVE })
  status: VoucherStatus;

  @Column({
    type: 'enum',
    enum: DiscountScope,
    default: DiscountScope.ALL_MOVIES,
  })
  discountScope: DiscountScope;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderAmount: number;

  @ManyToOne(() => Movie, { nullable: true })
  @JoinColumn({ name: 'applicableMovieId' })
  applicableMovie: Movie;

  @Column({ nullable: true })
  applicableMovieId: number;

  @Column({ type: 'json', nullable: true })
  applicableGenres: string[];

  @Column({ type: 'json', nullable: true })
  applicableScreenTypes: string[];

  @Column({ type: 'datetime' })
  validFrom: Date;

  @Column({ type: 'datetime' })
  validUntil: Date;

  @Column({ type: 'int', nullable: true })
  maxUsage: number;

  @Column({ type: 'int', default: 0 })
  currentUsage: number;

  @Column({ type: 'int', nullable: true })
  maxUsagePerUser: number;

  @Column({ type: 'boolean', default: false })
  isFirstTimeUserOnly: boolean;

  @Column({ type: 'boolean', default: false })
  isStackable: boolean;

  @Column({ type: 'json', nullable: true })
  applicableDaysOfWeek: number[];

  @Column({ type: 'time', nullable: true })
  applicableTimeFrom: string;

  @Column({ type: 'time', nullable: true })
  applicableTimeTo: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  termsAndConditions: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bannerImage: string;

  @Column({ type: 'json', nullable: true })
  targetAudience: string[];

  @Column({ type: 'boolean', default: false })
  requiresCode: boolean;

  @Column({ type: 'boolean', default: false })
  autoApply: boolean;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
