import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketStatus, PaymentStatus } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    // Generate unique ticket code
    const ticketCode = this.generateTicketCode();

    // Check if seat is already booked for this showtime
    const existingSeat = await this.ticketsRepository.findOne({
      where: {
        showtimeId: createTicketDto.showtimeId,
        seatRow: createTicketDto.seatRow,
        seatNumber: createTicketDto.seatNumber,
        status: TicketStatus.CONFIRMED,
      },
    });

    if (existingSeat) {
      throw new BadRequestException('Seat is already booked for this showtime');
    }

    const ticket = this.ticketsRepository.create({
      ...createTicketDto,
      ticketCode,
      bookingDate: new Date(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    return this.ticketsRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      relations: ['movie', 'showtime'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['movie', 'showtime'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async findByTicketCode(ticketCode: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { ticketCode },
      relations: ['movie', 'showtime'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with code ${ticketCode} not found`);
    }

    return ticket;
  }

  async findByCustomer(customerEmail: string): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      where: { customerEmail },
      relations: ['movie', 'showtime'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByShowtime(showtimeId: number): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      where: { showtimeId },
      relations: ['movie', 'showtime'],
      order: { seatRow: 'ASC', seatNumber: 'ASC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['movie', 'showtime'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    // Prevent updating certain fields if ticket is already confirmed
    if (
      ticket.status === TicketStatus.CONFIRMED &&
      (updateTicketDto.seatNumber || updateTicketDto.seatRow)
    ) {
      throw new BadRequestException('Cannot change seat for confirmed ticket');
    }

    Object.assign(ticket, updateTicketDto);
    return this.ticketsRepository.save(ticket);
  }

  async confirmPayment(
    id: number,
    paymentData: {
      paymentMethod: string;
      paymentTransactionId: string;
    },
  ): Promise<Ticket> {
    const ticket = await this.findOne(id);

    ticket.paymentStatus = PaymentStatus.PAID;
    ticket.status = TicketStatus.CONFIRMED;
    ticket.paymentDate = new Date();
    ticket.paymentMethod = paymentData.paymentMethod;
    ticket.paymentTransactionId = paymentData.paymentTransactionId;

    return this.ticketsRepository.save(ticket);
  }

  async checkIn(ticketCode: string): Promise<Ticket> {
    const ticket = await this.findByTicketCode(ticketCode);

    if (ticket.status !== TicketStatus.CONFIRMED) {
      throw new BadRequestException('Ticket is not confirmed');
    }

    if (ticket.isCheckedIn) {
      throw new BadRequestException('Ticket is already checked in');
    }

    ticket.isCheckedIn = true;
    ticket.checkInTime = new Date();
    ticket.status = TicketStatus.USED;

    return this.ticketsRepository.save(ticket);
  }

  async cancel(id: number): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (ticket.status === TicketStatus.USED) {
      throw new BadRequestException('Cannot cancel used ticket');
    }

    ticket.status = TicketStatus.CANCELLED;

    if (ticket.paymentStatus === PaymentStatus.PAID) {
      ticket.paymentStatus = PaymentStatus.REFUNDED;
    }

    return this.ticketsRepository.save(ticket);
  }

  async remove(id: number): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketsRepository.remove(ticket);
  }

  private generateTicketCode(): string {
    const prefix = 'TKT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  async getBookingStats(startDate?: Date, endDate?: Date) {
    const whereClause =
      startDate && endDate ? { createdAt: Between(startDate, endDate) } : {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [totalTickets, confirmedTickets, revenue] = await Promise.all([
      this.ticketsRepository.count({ where: whereClause }),
      this.ticketsRepository.count({
        where: { ...whereClause, status: TicketStatus.CONFIRMED },
      }),
      this.ticketsRepository
        .createQueryBuilder('ticket')
        .select('SUM(ticket.finalPrice)', 'total')
        .where(whereClause)
        .andWhere('ticket.paymentStatus = :status', {
          status: PaymentStatus.PAID,
        })
        .getRawOne(),
    ]);

    return {
      totalTickets,
      confirmedTickets,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      revenue: parseFloat(revenue?.total || '0'),
    };
  }
}
