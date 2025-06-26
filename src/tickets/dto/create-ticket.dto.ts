import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  Min,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SeatType, PaymentStatus } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  movieId: number;

  @IsNotEmpty()
  @IsNumber()
  showtimeId: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  customerName: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]+$/)
  @Length(10, 20)
  customerPhone?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  seatNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 5)
  seatRow: string;

  @IsOptional()
  @IsEnum(SeatType)
  seatType?: SeatType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  finalPrice: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  voucherCode?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  paymentTransactionId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paymentDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  bookingDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  specialRequests?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalServices?: string[];

  @IsOptional()
  @IsBoolean()
  isCheckedIn?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  checkInTime?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  qrCode?: string;
}
