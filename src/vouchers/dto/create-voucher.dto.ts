import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDate,
  IsArray,
  IsUrl,
  Min,
  Max,
  Length,
  Matches,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  VoucherType,
  VoucherStatus,
  DiscountScope,
} from '../entities/voucher.entity';

export class CreateVoucherDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      'Code must contain only uppercase letters, numbers, hyphens and underscores',
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 2000)
  description: string;

  @IsNotEmpty()
  @IsEnum(VoucherType)
  voucherType: VoucherType;

  @IsOptional()
  @IsEnum(VoucherStatus)
  status?: VoucherStatus;

  @IsOptional()
  @IsEnum(DiscountScope)
  discountScope?: DiscountScope;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @IsOptional()
  @IsNumber()
  applicableMovieId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableGenres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableScreenTypes?: string[];

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  validFrom: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  validUntil: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsage?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentUsage?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxUsagePerUser?: number;

  @IsOptional()
  @IsBoolean()
  isFirstTimeUserOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  applicableDaysOfWeek?: number[];

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format',
  })
  applicableTimeFrom?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format',
  })
  applicableTimeTo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  createdBy?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  termsAndConditions?: string;

  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  bannerImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetAudience?: string[];

  @IsOptional()
  @IsBoolean()
  requiresCode?: boolean;

  @IsOptional()
  @IsBoolean()
  autoApply?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
