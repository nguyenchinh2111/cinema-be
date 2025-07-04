import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowtimeSession } from './entities/showtime-session.entity';
import { CreateShowtimeSessionDto } from './dto/create-showtime-session.dto';

@Injectable()
export class ShowtimeSessionsService {
  constructor(
    @InjectRepository(ShowtimeSession)
    private sessionRepository: Repository<ShowtimeSession>,
  ) {}

  async create(
    createSessionDto: CreateShowtimeSessionDto,
  ): Promise<ShowtimeSession> {
    // Check if session with same name and date already exists
    const existingSession = await this.sessionRepository.findOne({
      where: {
        name: createSessionDto.name,
        date: new Date(createSessionDto.date),
      },
    });

    if (existingSession) {
      throw new ConflictException(
        'Session with this name and date already exists',
      );
    }

    const session = this.sessionRepository.create({
      ...createSessionDto,
      date: new Date(createSessionDto.date),
      isActive: createSessionDto.isActive ?? true,
    });

    return this.sessionRepository.save(session);
  }

  async findAll(): Promise<ShowtimeSession[]> {
    return this.sessionRepository.find({
      relations: ['slots'],
      order: { date: 'DESC', startTime: 'ASC' },
    });
  }

  async findByDate(date: string): Promise<ShowtimeSession[]> {
    return this.sessionRepository.find({
      where: { date: new Date(date), isActive: true },
      relations: ['slots'],
      order: { startTime: 'ASC' },
    });
  }

  async findActive(): Promise<ShowtimeSession[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.slots', 'slots')
      .where('session.isActive = true')
      .andWhere('session.date >= :today', { today })
      .orderBy('session.date', 'ASC')
      .addOrderBy('session.startTime', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<ShowtimeSession> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['slots', 'slots.movie', 'slots.room'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async remove(id: number): Promise<void> {
    const session = await this.findOne(id);
    await this.sessionRepository.remove(session);
  }
}
