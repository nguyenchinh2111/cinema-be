import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomWithSeatsDto } from './dto/create-room-with-seats.dto';

describe('RoomsController', () => {
  let controller: RoomsController;

  const mockRoom = {
    id: 1,
    name: 'Cinema Hall 1',
    roomType: 'Standard',
    capacity: 100,
    floor: 1,
    isActive: true,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    seats: [],
    showtimes: [],
  };

  const mockRoomsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findActive: jest.fn(),
    searchRooms: jest.fn(),
    getRoomStats: jest.fn(),
    findByType: jest.fn(),
    findByFloor: jest.fn(),
    findByCapacityRange: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    bulkUpdateStatus: jest.fn(),
    remove: jest.fn(),
    createRoomWithStandardSeats: jest.fn(),
    findOneWithSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        {
          provide: RoomsService,
          useValue: mockRoomsService,
        },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new room', async () => {
      const createRoomDto: CreateRoomDto = {
        name: 'Cinema Hall 1',
        roomType: 'Standard',
        capacity: 100,
        floor: 1,
      };

      mockRoomsService.create.mockResolvedValue(mockRoom);

      const result = await controller.create(createRoomDto);

      expect(mockRoomsService.create).toHaveBeenCalledWith(createRoomDto);
      expect(result).toEqual(mockRoom);
    });

    it('should handle service errors during creation', async () => {
      const createRoomDto: CreateRoomDto = {
        name: 'Cinema Hall 1',
        roomType: 'Standard',
        capacity: 100,
        floor: 1,
      };

      mockRoomsService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createRoomDto)).rejects.toThrow(
        'Database error',
      );
      expect(mockRoomsService.create).toHaveBeenCalledWith(createRoomDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of rooms', async () => {
      const mockRooms = [
        mockRoom,
        { ...mockRoom, id: 2, name: 'Cinema Hall 2' },
      ];
      mockRoomsService.findAll.mockResolvedValue(mockRooms);

      const result = await controller.findAll();

      expect(mockRoomsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRooms);
    });

    it('should return empty array when no rooms exist', async () => {
      mockRoomsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockRoomsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findActive', () => {
    it('should return active rooms', async () => {
      const activeRooms = [mockRoom];
      mockRoomsService.findActive.mockResolvedValue(activeRooms);

      const result = await controller.findActive();

      expect(mockRoomsService.findActive).toHaveBeenCalled();
      expect(result).toEqual(activeRooms);
    });
  });

  describe('searchRooms', () => {
    it('should search rooms by term', async () => {
      const searchTerm = 'Hall';
      const searchResults = [mockRoom];
      mockRoomsService.searchRooms.mockResolvedValue(searchResults);

      const result = await controller.searchRooms(searchTerm);

      expect(mockRoomsService.searchRooms).toHaveBeenCalledWith(searchTerm);
      expect(result).toEqual(searchResults);
    });
  });

  describe('getRoomStats', () => {
    it('should return room statistics', async () => {
      const stats = {
        totalRooms: 5,
        activeRooms: 4,
        totalCapacity: 500,
        averageCapacity: 100,
      };
      mockRoomsService.getRoomStats.mockResolvedValue(stats);

      const result = await controller.getRoomStats();

      expect(mockRoomsService.getRoomStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('findByType', () => {
    it('should return rooms by type', async () => {
      const roomType = 'Standard';
      const rooms = [mockRoom];
      mockRoomsService.findByType.mockResolvedValue(rooms);

      const result = await controller.findByType(roomType);

      expect(mockRoomsService.findByType).toHaveBeenCalledWith(roomType);
      expect(result).toEqual(rooms);
    });
  });

  describe('findByFloor', () => {
    it('should return rooms by floor', async () => {
      const floor = 1;
      const rooms = [mockRoom];
      mockRoomsService.findByFloor.mockResolvedValue(rooms);

      const result = await controller.findByFloor(floor);

      expect(mockRoomsService.findByFloor).toHaveBeenCalledWith(floor);
      expect(result).toEqual(rooms);
    });
  });

  describe('findByCapacityRange', () => {
    it('should return rooms by capacity range', async () => {
      const minCapacity = 50;
      const maxCapacity = 150;
      const rooms = [mockRoom];
      mockRoomsService.findByCapacityRange.mockResolvedValue(rooms);

      const result = await controller.findByCapacityRange(
        minCapacity,
        maxCapacity,
      );

      expect(mockRoomsService.findByCapacityRange).toHaveBeenCalledWith(
        minCapacity,
        maxCapacity,
      );
      expect(result).toEqual(rooms);
    });
  });

  describe('findOne', () => {
    it('should return a room by id', async () => {
      mockRoomsService.findOne.mockResolvedValue(mockRoom);

      const result = await controller.findOne(1);

      expect(mockRoomsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRoom);
    });

    it('should throw NotFoundException when room does not exist', async () => {
      mockRoomsService.findOne.mockRejectedValue(
        new NotFoundException('Room with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRoomsService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a room', async () => {
      const updateRoomDto: UpdateRoomDto = {
        name: 'Updated Cinema Hall',
        capacity: 120,
      };
      const updatedRoom = { ...mockRoom, ...updateRoomDto };

      mockRoomsService.update.mockResolvedValue(updatedRoom);

      const result = await controller.update(1, updateRoomDto);

      expect(mockRoomsService.update).toHaveBeenCalledWith(1, updateRoomDto);
      expect(result).toEqual(updatedRoom);
    });

    it('should throw NotFoundException when updating non-existent room', async () => {
      const updateRoomDto: UpdateRoomDto = { name: 'Updated Name' };

      mockRoomsService.update.mockRejectedValue(
        new NotFoundException('Room with ID 999 not found'),
      );

      await expect(controller.update(999, updateRoomDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRoomsService.update).toHaveBeenCalledWith(999, updateRoomDto);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle room status', async () => {
      const toggledRoom = { ...mockRoom, isActive: false };
      mockRoomsService.toggleStatus.mockResolvedValue(toggledRoom);

      const result = await controller.toggleStatus(1);

      expect(mockRoomsService.toggleStatus).toHaveBeenCalledWith(1);
      expect(result).toEqual(toggledRoom);
    });
  });

  describe('bulkUpdateStatus', () => {
    it('should bulk update room status', async () => {
      const bulkData = { ids: [1, 2, 3], isActive: false };
      const updateResult = { updated: 3 };
      mockRoomsService.bulkUpdateStatus.mockResolvedValue(updateResult);

      const result = await controller.bulkUpdateStatus(bulkData);

      expect(mockRoomsService.bulkUpdateStatus).toHaveBeenCalledWith(
        bulkData.ids,
        bulkData.isActive,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a room', async () => {
      mockRoomsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(mockRoomsService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when removing non-existent room', async () => {
      mockRoomsService.remove.mockRejectedValue(
        new NotFoundException('Room with ID 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRoomsService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('createWithStandardSeats', () => {
    it('should create room with standard seats', async () => {
      const roomData: CreateRoomWithSeatsDto = {
        name: 'Cinema Hall 1',
        roomType: 'Standard',
        capacity: 100,
        floor: 1,
        rows: ['A', 'B', 'C'],
        seatsPerRow: 10,
      };
      const roomWithSeats = { ...mockRoom, seats: [] };

      mockRoomsService.createRoomWithStandardSeats.mockResolvedValue(
        roomWithSeats,
      );

      const result = await controller.createWithStandardSeats(roomData);

      expect(mockRoomsService.createRoomWithStandardSeats).toHaveBeenCalledWith(
        {
          name: roomData.name,
          roomType: roomData.roomType,
          capacity: roomData.capacity,
          floor: roomData.floor,
        },
        roomData.rows,
        roomData.seatsPerRow,
      );
      expect(result).toEqual(roomWithSeats);
    });

    it('should create room with default seat layout when not specified', async () => {
      const roomData: CreateRoomWithSeatsDto = {
        name: 'Cinema Hall 1',
        roomType: 'Standard',
        capacity: 100,
        floor: 1,
      };
      const roomWithSeats = { ...mockRoom, seats: [] };

      mockRoomsService.createRoomWithStandardSeats.mockResolvedValue(
        roomWithSeats,
      );

      const result = await controller.createWithStandardSeats(roomData);

      expect(mockRoomsService.createRoomWithStandardSeats).toHaveBeenCalledWith(
        {
          name: roomData.name,
          roomType: roomData.roomType,
          capacity: roomData.capacity,
          floor: roomData.floor,
        },
        ['A', 'B', 'C', 'D', 'E', 'F'],
        10,
      );
      expect(result).toEqual(roomWithSeats);
    });
  });

  describe('findOneWithSeats', () => {
    it('should return a room with its seats', async () => {
      const roomWithSeats = { ...mockRoom, seats: [] };
      mockRoomsService.findOneWithSeats.mockResolvedValue(roomWithSeats);

      const result = await controller.findOneWithSeats(1);

      expect(mockRoomsService.findOneWithSeats).toHaveBeenCalledWith(1);
      expect(result).toEqual(roomWithSeats);
    });

    it('should throw NotFoundException when room does not exist', async () => {
      mockRoomsService.findOneWithSeats.mockRejectedValue(
        new NotFoundException('Room with ID 999 not found'),
      );

      await expect(controller.findOneWithSeats(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRoomsService.findOneWithSeats).toHaveBeenCalledWith(999);
    });
  });
});
