import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

interface CapacityStats {
  totalCapacity: string;
  averageCapacity: string;
  minCapacity: string;
  maxCapacity: string;
}

interface TypeStat {
  type: string;
  count: string;
}

interface FloorStat {
  floor: string;
  count: string;
}

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    // Check if room name already exists
    const existingRoom = await this.roomRepository.findOne({
      where: { name: createRoomDto.name },
    });

    if (existingRoom) {
      throw new ConflictException('Room with this name already exists');
    }

    const room = this.roomRepository.create({
      ...createRoomDto,
      isActive: createRoomDto.isActive ?? true,
    });

    return await this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return await this.roomRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findActive(): Promise<Room[]> {
    return await this.roomRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByType(roomType: string): Promise<Room[]> {
    return await this.roomRepository.find({
      where: { roomType, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByFloor(floor: number): Promise<Room[]> {
    return await this.roomRepository.find({
      where: { floor, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByCapacityRange(
    minCapacity: number,
    maxCapacity: number,
  ): Promise<Room[]> {
    return await this.roomRepository
      .createQueryBuilder('room')
      .where('room.capacity >= :minCapacity', { minCapacity })
      .andWhere('room.capacity <= :maxCapacity', { maxCapacity })
      .andWhere('room.isActive = :isActive', { isActive: true })
      .orderBy('room.capacity', 'ASC')
      .getMany();
  }

  async searchRooms(searchTerm: string): Promise<Room[]> {
    return await this.roomRepository.find({
      where: [
        { name: Like(`%${searchTerm}%`) },
        { description: Like(`%${searchTerm}%`) },
        { roomType: Like(`%${searchTerm}%`) },
      ],
      order: { name: 'ASC' },
    });
  }

  async getRoomStats(): Promise<any> {
    const totalRooms = await this.roomRepository.count();
    const activeRooms = await this.roomRepository.count({
      where: { isActive: true },
    });
    const inactiveRooms = totalRooms - activeRooms;

    const capacityStats = await this.roomRepository
      .createQueryBuilder('room')
      .select([
        'SUM(room.capacity) as totalCapacity',
        'AVG(room.capacity) as averageCapacity',
        'MIN(room.capacity) as minCapacity',
        'MAX(room.capacity) as maxCapacity',
      ])
      .where('room.isActive = :isActive', { isActive: true })
      .getRawOne<CapacityStats>();

    const roomTypeStats = await this.roomRepository
      .createQueryBuilder('room')
      .select('room.roomType as type, COUNT(*) as count')
      .where('room.isActive = :isActive', { isActive: true })
      .groupBy('room.roomType')
      .getRawMany<TypeStat>();

    const floorStats = await this.roomRepository
      .createQueryBuilder('room')
      .select('room.floor as floor, COUNT(*) as count')
      .where('room.isActive = :isActive', { isActive: true })
      .andWhere('room.floor IS NOT NULL')
      .groupBy('room.floor')
      .orderBy('room.floor', 'ASC')
      .getRawMany<FloorStat>();

    return {
      totalRooms,
      activeRooms,
      inactiveRooms,
      capacity: {
        total: parseInt(capacityStats?.totalCapacity || '0', 10) || 0,
        average:
          Math.round(parseFloat(capacityStats?.averageCapacity || '0')) || 0,
        min: parseInt(capacityStats?.minCapacity || '0', 10) || 0,
        max: parseInt(capacityStats?.maxCapacity || '0', 10) || 0,
      },
      byType: roomTypeStats.map((stat) => ({
        type: stat.type || 'Unknown',
        count: parseInt(stat.count, 10),
      })),
      byFloor: floorStats.map((stat) => ({
        floor: parseInt(stat.floor, 10),
        count: parseInt(stat.count, 10),
      })),
    };
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['showtimes'],
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id);

    // Check if name is being updated and if it conflicts with existing room
    if (updateRoomDto.name && updateRoomDto.name !== room.name) {
      const existingRoom = await this.roomRepository.findOne({
        where: { name: updateRoomDto.name },
      });

      if (existingRoom && existingRoom.id !== id) {
        throw new ConflictException('Room with this name already exists');
      }
    }

    Object.assign(room, updateRoomDto);
    return await this.roomRepository.save(room);
  }

  async toggleStatus(id: number): Promise<Room> {
    const room = await this.findOne(id);
    room.isActive = !room.isActive;
    return await this.roomRepository.save(room);
  }

  async remove(id: number): Promise<void> {
    const room = await this.findOne(id);
    await this.roomRepository.remove(room);
  }

  async bulkUpdateStatus(ids: number[], isActive: boolean): Promise<void> {
    await this.roomRepository
      .createQueryBuilder()
      .update(Room)
      .set({ isActive })
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
