import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowtimeSlot } from './entities/showtime-slot.entity';
import { CreateShowtimeSlotDto } from './dto/create-showtime-slot.dto';
import { Movie } from '../movies/entities/movie.entity';
import { Room } from '../rooms/entities/room.entity';

@Injectable()
export class ShowtimeSlotsService {
  constructor(
    @InjectRepository(ShowtimeSlot)
    private slotRepository: Repository<ShowtimeSlot>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createSlotDto: CreateShowtimeSlotDto): Promise<ShowtimeSlot> {
    // Lấy thông tin movie để tính endTime
    const movie = await this.movieRepository.findOne({
      where: { id: createSlotDto.movieId },
    });
    if (!movie) {
      throw new NotFoundException(
        `Movie with ID ${createSlotDto.movieId} not found`,
      );
    }

    // Lấy thông tin room để set totalSeats
    const room = await this.roomRepository.findOne({
      where: { id: createSlotDto.roomId },
    });
    if (!room) {
      throw new NotFoundException(
        `Room with ID ${createSlotDto.roomId} not found`,
      );
    }

    const startTime = new Date(createSlotDto.startTime);
    // endTime = startTime + movie.duration + 10 phút buffer
    const endTime = new Date(
      startTime.getTime() + (movie.duration + 10) * 60000,
    );

    // Kiểm tra conflict: không được trùng phòng + thời gian overlapping
    await this.checkTimeConflict(
      createSlotDto.roomId,
      startTime,
      endTime,
      createSlotDto.sessionId,
    );

    const slot = this.slotRepository.create({
      ...createSlotDto,
      startTime,
      endTime,
      totalSeats: room.capacity,
      bookedSeats: 0,
      basePrice: createSlotDto.basePrice || 0,
      isActive: createSlotDto.isActive ?? true,
    });

    return this.slotRepository.save(slot);
  }

  private async checkTimeConflict(
    roomId: number,
    startTime: Date,
    endTime: Date,
    sessionId: number,
    excludeSlotId?: number,
  ): Promise<void> {
    const conflictQuery = this.slotRepository
      .createQueryBuilder('slot')
      .where('slot.roomId = :roomId', { roomId })
      .andWhere('slot.sessionId = :sessionId', { sessionId })
      .andWhere('slot.isActive = true')
      .andWhere('(slot.startTime < :endTime AND slot.endTime > :startTime)', {
        startTime,
        endTime,
      });

    if (excludeSlotId) {
      conflictQuery.andWhere('slot.id != :excludeSlotId', { excludeSlotId });
    }

    const conflictingSlot = await conflictQuery.getOne();

    if (conflictingSlot) {
      throw new ConflictException(
        `Time conflict detected. Room ${roomId} is already booked during this time period.`,
      );
    }
  }

  async findBySession(sessionId: number): Promise<ShowtimeSlot[]> {
    return this.slotRepository.find({
      where: { sessionId, isActive: true },
      relations: ['movie', 'room', 'session'],
      order: { startTime: 'ASC' },
    });
  }

  async findByMovieAndDate(
    movieId: number,
    date: string,
  ): Promise<ShowtimeSlot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.movie', 'movie')
      .leftJoinAndSelect('slot.room', 'room')
      .leftJoinAndSelect('slot.session', 'session')
      .where('slot.movieId = :movieId', { movieId })
      .andWhere('slot.startTime >= :startOfDay', { startOfDay })
      .andWhere('slot.startTime <= :endOfDay', { endOfDay })
      .andWhere('slot.isActive = true')
      .orderBy('slot.startTime', 'ASC')
      .getMany();
  }

  async findAvailable(): Promise<ShowtimeSlot[]> {
    const now = new Date();

    return this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.movie', 'movie')
      .leftJoinAndSelect('slot.room', 'room')
      .leftJoinAndSelect('slot.session', 'session')
      .where('slot.startTime > :now', { now })
      .andWhere('slot.isActive = true')
      .andWhere('slot.bookedSeats < slot.totalSeats')
      .orderBy('slot.startTime', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<ShowtimeSlot> {
    const slot = await this.slotRepository.findOne({
      where: { id },
      relations: ['movie', 'room', 'session'],
    });

    if (!slot) {
      throw new NotFoundException(`Showtime slot with ID ${id} not found`);
    }

    return slot;
  }

  async updateBookedSeats(
    id: number,
    increment: number,
  ): Promise<ShowtimeSlot> {
    const slot = await this.findOne(id);

    const newBookedSeats = slot.bookedSeats + increment;

    if (newBookedSeats < 0) {
      throw new BadRequestException('Booked seats cannot be negative');
    }

    if (newBookedSeats > slot.totalSeats) {
      throw new BadRequestException('Cannot exceed total seats capacity');
    }

    slot.bookedSeats = newBookedSeats;
    return this.slotRepository.save(slot);
  }

  async remove(id: number): Promise<void> {
    const slot = await this.findOne(id);
    await this.slotRepository.remove(slot);
  }
}
