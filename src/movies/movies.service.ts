import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    movie.created_at = new Date();
    movie.updated_at = new Date();
    return this.moviesRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find({
      where: { deleted_at: IsNull() },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    Object.assign(movie, updateMovieDto);
    movie.updated_at = new Date();
    return this.moviesRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    // Soft delete
    movie.deleted_at = new Date();
    await this.moviesRepository.save(movie);
  }
}
