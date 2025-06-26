import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
  ) {}

  // Lấy tất cả showtimes kèm thông tin movie
  async findAll(): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      relations: ['movie'],
    });
  }

  async create(CreateShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const newShowtime = this.showtimesRepository.create(CreateShowtimeDto);
    return this.showtimesRepository.save(newShowtime);
  }

  // Lấy showtime theo ID kèm thông tin movie
  async findOne(id: number): Promise<Showtime> {
    const showtime = await this.showtimesRepository.findOne({
      where: { id },
      relations: ['movie'],
    });
    if (!showtime) {
      throw new Error(`Showtime with ID ${id} not found`);
    }
    return showtime;
  }

  // Lấy showtimes theo movie ID
  async findByMovieId(movieId: number): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      where: { movie: { id: movieId } },
      relations: ['movie'],
    });
  }

  // Lấy showtimes còn active kèm thông tin movie
  async findActiveShowtimes(): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      where: { isActive: true },
      relations: ['movie'],
      order: { startTime: 'ASC' },
    });
  }

  // Lấy showtimes theo ngày cụ thể
  async findByDate(date: string): Promise<Showtime[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.showtimesRepository
      .createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .where('showtime.startTime >= :startOfDay', { startOfDay })
      .andWhere('showtime.startTime <= :endOfDay', { endOfDay })
      .andWhere('showtime.isActive = true')
      .orderBy('showtime.startTime', 'ASC')
      .getMany();
  }
}
