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

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsISO8601()
  @IsNotEmpty()
  @Type(() => Date)
  releaseDate: Date;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  genre: string[];

  @IsNumber({ maxDecimalPlaces: 1 })
  @IsNotEmpty()
  rating: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  trailerUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reviews?: string[];
}
