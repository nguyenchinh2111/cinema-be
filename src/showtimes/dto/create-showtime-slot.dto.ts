import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShowtimeSlotDto {
  @ApiProperty({
    description: 'Session ID this slot belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @ApiProperty({
    description: 'Movie ID for this slot',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  movieId: number;

  @ApiProperty({
    description: 'Room ID for this slot',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @ApiProperty({
    description: 'Start time of this specific slot (ISO string)',
    example: '2025-07-05T09:30:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({
    description: 'Base price for this slot',
    example: 75000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({
    description: 'Additional notes for this slot',
    example: 'Special morning rate',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Whether the slot is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
