import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSeatDto } from './dto/create-seat.dto';
import { Seat, SeatStatus, SeatType } from './entities/seat.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatsRepository: Repository<Seat>,
  ) {}

  async create(roomId: number, createSeatDto: CreateSeatDto): Promise<Seat> {
    const seat = this.seatsRepository.create({
      ...createSeatDto,
      roomId,
    });
    return this.seatsRepository.save(seat);
  }

  async createMultiple(
    roomId: number,
    createSeatDtos: CreateSeatDto[],
  ): Promise<Seat[]> {
    const seats = createSeatDtos.map((dto) =>
      this.seatsRepository.create({
        ...dto,
        roomId,
      }),
    );
    return this.seatsRepository.save(seats);
  }

  async findByRoom(roomId: number): Promise<Seat[]> {
    return this.seatsRepository.find({
      where: { roomId, isActive: true },
      order: { row: 'ASC', number: 'ASC' },
    });
  }

  async findAvailableByRoom(roomId: number): Promise<Seat[]> {
    return this.seatsRepository.find({
      where: { roomId, isActive: true, status: SeatStatus.AVAILABLE },
      order: { row: 'ASC', number: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Seat> {
    const seat = await this.seatsRepository.findOne({
      where: { id },
      relations: ['room'],
    });
    if (!seat) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }
    return seat;
  }

  async findBySeatPosition(
    roomId: number,
    row: string,
    number: string,
  ): Promise<Seat> {
    const seat = await this.seatsRepository.findOne({
      where: { roomId, row, number },
    });
    if (!seat) {
      throw new NotFoundException(
        `Seat ${row}${number} not found in room ${roomId}`,
      );
    }
    return seat;
  }

  async updateSeatStatus(id: number, status: SeatStatus): Promise<Seat> {
    const seat = await this.findOne(id);
    seat.status = status;
    return this.seatsRepository.save(seat);
  }

  async remove(id: number): Promise<void> {
    const seat = await this.findOne(id);
    await this.seatsRepository.remove(seat);
  }

  async removeByRoom(roomId: number): Promise<void> {
    await this.seatsRepository.delete({ roomId });
  }

  // Utility method để tạo ghế theo pattern thông thường
  async generateSeatsForRoom(
    roomId: number,
    rows: string[],
    seatsPerRow: number,
    seatType: SeatType = SeatType.STANDARD,
  ): Promise<Seat[]> {
    const seatDtos: CreateSeatDto[] = [];

    rows.forEach((row, rowIndex) => {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        seatDtos.push({
          row,
          number: seatNum.toString(),
          seatType,
          xPosition: seatNum,
          yPosition: rowIndex + 1,
        });
      }
    });

    return this.createMultiple(roomId, seatDtos);
  }
}
