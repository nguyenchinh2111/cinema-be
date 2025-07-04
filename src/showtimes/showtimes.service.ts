import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ShowtimeSession } from './entities/showtime-session.entity';
import { ShowtimeSlot } from './entities/showtime-slot.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
    @InjectRepository(ShowtimeSession)
    private sessionRepository: Repository<ShowtimeSession>,
    @InjectRepository(ShowtimeSlot)
    private slotRepository: Repository<ShowtimeSlot>,
  ) {}

  // LEGACY METHODS - Kept for backward compatibility
  async findAll(): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      relations: ['movie'],
    });
  }

  async create(CreateShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const newShowtime = this.showtimesRepository.create(CreateShowtimeDto);
    return this.showtimesRepository.save(newShowtime);
  }

  async findOne(id: number): Promise<Showtime> {
    const showtime = await this.showtimesRepository.findOne({
      where: { id },
      relations: ['movie'],
    });
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }
    return showtime;
  }

  async findByMovieId(movieId: number): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      where: { movie: { id: movieId } },
      relations: ['movie'],
    });
  }

  async findActiveShowtimes(): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      where: { isActive: true },
      relations: ['movie'],
      order: { startTime: 'ASC' },
    });
  }

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

  // NEW SESSION-BASED METHODS
  async getSessionsWithSlots(date?: string): Promise<ShowtimeSession[]> {
    let query = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.slots', 'slots')
      .leftJoinAndSelect('slots.movie', 'movie')
      .leftJoinAndSelect('slots.room', 'room')
      .where('session.isActive = true');

    if (date) {
      query = query.andWhere('session.date = :date', { date: new Date(date) });
    }

    return query
      .orderBy('session.date', 'ASC')
      .addOrderBy('session.startTime', 'ASC')
      .addOrderBy('slots.startTime', 'ASC')
      .getMany();
  }

  async getAvailableSlots(
    movieId?: number,
    date?: string,
  ): Promise<ShowtimeSlot[]> {
    const now = new Date();

    let query = this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.movie', 'movie')
      .leftJoinAndSelect('slot.room', 'room')
      .leftJoinAndSelect('slot.session', 'session')
      .where('slot.startTime > :now', { now })
      .andWhere('slot.isActive = true')
      .andWhere('slot.bookedSeats < slot.totalSeats');

    if (movieId) {
      query = query.andWhere('slot.movieId = :movieId', { movieId });
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .andWhere('slot.startTime >= :startOfDay', { startOfDay })
        .andWhere('slot.startTime <= :endOfDay', { endOfDay });
    }

    return query.orderBy('slot.startTime', 'ASC').getMany();
  }

  async getSlotById(slotId: number): Promise<ShowtimeSlot> {
    const slot = await this.slotRepository.findOne({
      where: { id: slotId },
      relations: ['movie', 'room', 'session'],
    });

    if (!slot) {
      throw new NotFoundException(`Showtime slot with ID ${slotId} not found`);
    }

    return slot;
  }
}
