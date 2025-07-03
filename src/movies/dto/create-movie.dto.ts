import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsUrl,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    example: 'The Matrix',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the movie',
    example:
      'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Release date of the movie',
    example: '1999-03-31T00:00:00.000Z',
  })
  @IsISO8601()
  @IsNotEmpty()
  @Type(() => Date)
  releaseDate: Date;

  @ApiProperty({
    description: 'Director of the movie',
    example: 'Lana Wachowski',
  })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty({
    description: 'Genre of the movie',
    example: ['Action', 'Sci-Fi'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  genre: string[];

  @ApiProperty({
    description: 'Rating of the movie',
    example: 8.7,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: 'Duration of the movie in minutes',
    example: 136,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiPropertyOptional({
    description: 'URL of the movie poster',
    example: 'https://example.com/poster.jpg',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @ApiPropertyOptional({
    description: 'URL of the movie trailer',
    example: 'https://example.com/trailer.mp4',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  trailerUrl?: string;

  @ApiPropertyOptional({
    description: 'Cast of the movie',
    example: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];

  @ApiPropertyOptional({
    description: 'Reviews of the movie',
    example: ['Great movie!', 'Mind-blowing effects'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reviews?: string[];
}
