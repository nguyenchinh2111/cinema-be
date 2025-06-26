import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDate,
  IsArray,
  IsEmail,
  IsUrl,
  Min,
  Max,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventType, EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 5000)
  description: string;

  @IsNotEmpty()
  @IsEnum(EventType)
  eventType: EventType;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsNumber()
  movieId?: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  venue?: string;

  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  bannerImage?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  galleryImages?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vipPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  maxAttendees?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAttendees?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  organizer?: string;

  @IsOptional()
  @IsEmail()
  organizerEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]+$/)
  @Length(10, 20)
  organizerPhone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sponsors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialGuests?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  specialInstructions?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 20)
  ageRating?: string;

  @IsOptional()
  @IsBoolean()
  allowBooking?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  bookingStartDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  bookingEndDate?: Date;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  discountDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
