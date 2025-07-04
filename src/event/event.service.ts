import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventStatus, EventType } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Validate date range
    if (createEventDto.startDate >= createEventDto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Validate booking dates if provided
    if (createEventDto.bookingStartDate && createEventDto.bookingEndDate) {
      if (createEventDto.bookingStartDate >= createEventDto.bookingEndDate) {
        throw new BadRequestException(
          'Booking end date must be after booking start date',
        );
      }
    }

    const event = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['movie'],
      order: { startDate: 'ASC' },
    });
  }

  async findActive(): Promise<Event[]> {
    const now = new Date();
    return this.eventsRepository.find({
      where: {
        status: EventStatus.PUBLISHED,
        isActive: true,
        startDate: MoreThanOrEqual(now),
      },
      relations: ['movie'],
      order: { startDate: 'ASC' },
    });
  }

  async findUpcoming(days: number = 30): Promise<Event[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.eventsRepository.find({
      where: {
        status: EventStatus.PUBLISHED,
        isActive: true,
        startDate: Between(now, futureDate),
      },
      relations: ['movie'],
      order: { startDate: 'ASC' },
    });
  }

  async findByType(eventType: EventType): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { eventType, isActive: true },
      relations: ['movie'],
      order: { startDate: 'ASC' },
    });
  }

  async findByMovie(movieId: number): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { movieId, isActive: true },
      relations: ['movie'],
      order: { startDate: 'ASC' },
    });
  }

  async findFeatured(): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        isFeatured: true,
        status: EventStatus.PUBLISHED,
        isActive: true,
      },
      relations: ['movie'],
      order: { startDate: 'ASC' },
      take: 10,
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        startDate: Between(startDate, endDate),
        isActive: true,
      },
      relations: ['movie'],
      order: { startDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['movie'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Validate dates if being updated
    if (updateEventDto.startDate && updateEventDto.endDate) {
      if (updateEventDto.startDate >= updateEventDto.endDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async updateAttendeeCount(id: number, increment: number): Promise<Event> {
    const event = await this.findOne(id);

    const newCount = event.currentAttendees + increment;

    if (newCount < 0) {
      throw new BadRequestException('Cannot reduce attendee count below zero');
    }

    if (event.maxAttendees && newCount > event.maxAttendees) {
      throw new BadRequestException('Event capacity exceeded');
    }

    event.currentAttendees = newCount;

    // Update status if sold out
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      event.status = EventStatus.SOLD_OUT;
    }

    return this.eventsRepository.save(event);
  }

  async publish(id: number): Promise<Event> {
    const event = await this.findOne(id);
    event.status = EventStatus.PUBLISHED;
    return this.eventsRepository.save(event);
  }

  async cancel(id: number): Promise<Event> {
    const event = await this.findOne(id);
    event.status = EventStatus.CANCELLED;
    return this.eventsRepository.save(event);
  }

  async complete(id: number): Promise<Event> {
    const event = await this.findOne(id);
    event.status = EventStatus.COMPLETED;
    return this.eventsRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }

  async getEventStats(startDate?: Date, endDate?: Date) {
    const whereClause =
      startDate && endDate ? { createdAt: Between(startDate, endDate) } : {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [totalEvents, publishedEvents, completedEvents, totalAttendees] =
      await Promise.all([
        this.eventsRepository.count({ where: whereClause }),
        this.eventsRepository.count({
          where: { ...whereClause, status: EventStatus.PUBLISHED },
        }),
        this.eventsRepository.count({
          where: { ...whereClause, status: EventStatus.COMPLETED },
        }),
        this.eventsRepository
          .createQueryBuilder('event')
          .select('SUM(event.currentAttendees)', 'total')
          .where(whereClause)
          .getRawOne(),
      ]);

    return {
      totalEvents,
      publishedEvents,
      completedEvents,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      totalAttendees: parseInt(totalAttendees?.total || '0'),
    };
  }

  async findExpiringSoon(days: number = 7): Promise<Event[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.eventsRepository.find({
      where: {
        status: EventStatus.PUBLISHED,
        bookingEndDate: Between(now, futureDate),
      },
      relations: ['movie'],
      order: { bookingEndDate: 'ASC' },
    });
  }
}
