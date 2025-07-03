import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Name of the room',
    example: 'Room A1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Capacity of the room',
    example: 150,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  capacity: number;

  @ApiPropertyOptional({
    description: 'Description of the room',
    example: 'Standard cinema room with comfortable seating',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the room is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Type of the room',
    example: 'Standard',
  })
  @IsOptional()
  @IsString()
  roomType?: string; // e.g., "Standard", "IMAX", "VIP"

  @ApiPropertyOptional({
    description: 'Floor number of the room',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  floor?: number;
}
