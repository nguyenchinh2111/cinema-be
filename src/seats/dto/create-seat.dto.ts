import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeatType, SeatStatus } from '../entities/seat.entity';

export class CreateSeatDto {
  @ApiProperty({
    description: 'Seat row identifier',
    example: 'A',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 5)
  row: string;

  @ApiProperty({
    description: 'Seat number within the row',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  number: string;

  @ApiPropertyOptional({
    description: 'Type of seat',
    enum: SeatType,
    example: SeatType.STANDARD,
  })
  @IsOptional()
  @IsEnum(SeatType)
  seatType?: SeatType;

  @ApiPropertyOptional({
    description: 'Status of seat',
    enum: SeatStatus,
    example: SeatStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(SeatStatus)
  status?: SeatStatus;

  @ApiPropertyOptional({
    description: 'Price modifier for this seat type (e.g., 1.5 for VIP)',
    example: 1.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceModifier?: number;

  @ApiPropertyOptional({
    description: 'X position in layout',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  xPosition?: number;

  @ApiPropertyOptional({
    description: 'Y position in layout',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yPosition?: number;

  @ApiPropertyOptional({
    description: 'Whether the seat is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes about the seat',
    example: 'Near emergency exit',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
