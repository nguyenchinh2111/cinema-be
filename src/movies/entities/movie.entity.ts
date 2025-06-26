import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'varchar', length: 100 })
  director: string;

  @Column({ type: 'simple-array', nullable: true })
  genre: string[];

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating: number;

  @Column({ type: 'int' })
  duration: number; // Duration in minutes

  @Column({ type: 'varchar', length: 255, nullable: true })
  posterUrl: string;

  @Column({ type: 'text', nullable: true })
  trailerUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  cast: string[]; // Array of actor names

  @Column({ type: 'simple-array', nullable: true })
  reviews: string[]; // Array of review texts

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];

  constructor(
    title: string,
    description: string,
    releaseDate: Date,
    director: string,
    genre: string[],
    rating: number,
    duration: number,
    posterUrl?: string,
    trailerUrl?: string,
    cast?: string[],
    reviews?: string[],
  ) {
    this.title = title;
    this.description = description;
    this.releaseDate = releaseDate;
    this.director = director;
    this.genre = genre;
    this.rating = rating;
    this.duration = duration;
    this.posterUrl = posterUrl || '';
    this.trailerUrl = trailerUrl || '';
    this.cast = cast || [];
    this.reviews = reviews || [];
  }
}
