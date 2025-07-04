import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { ShowtimeSessionsService } from './showtime-sessions.service';
import { ShowtimeSlotsService } from './showtime-slots.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { CreateShowtimeSessionDto } from './dto/create-showtime-session.dto';
import { CreateShowtimeSlotDto } from './dto/create-showtime-slot.dto';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;

  const mockShowtime = {
    id: 1,
    movieId: 1,
    roomId: 1,
    showDate: new Date('2024-01-15'),
    showTime: '19:00',
    price: 15.99,
    availableSeats: 95,
    totalSeats: 100,
    isActive: true,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    movie: { id: 1, title: 'The Matrix' },
    room: { id: 1, name: 'Cinema Hall 1' },
  };

  const mockSession = {
    id: 1,
    date: '2024-01-15',
    movieId: 1,
    roomId: 1,
    created_at: new Date(),
    updated_at: new Date(),
    movie: { id: 1, title: 'The Matrix' },
    room: { id: 1, name: 'Cinema Hall 1' },
    slots: [],
  };

  const mockSlot = {
    id: 1,
    sessionId: 1,
    startTime: '19:00',
    endTime: '21:30',
    price: 15.99,
    bookedSeats: 5,
    totalSeats: 100,
    isActive: true,
    created_at: new Date(),
    updated_at: new Date(),
    session: mockSession,
  };

  const mockShowtimesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findByMovieId: jest.fn(),
    findActiveShowtimes: jest.fn(),
    findByDate: jest.fn(),
    getSessionsWithSlots: jest.fn(),
    getAvailableSlots: jest.fn(),
    getSlotById: jest.fn(),
  };

  const mockSessionsService = {
    create: jest.fn(),
    findByDate: jest.fn(),
  };

  const mockSlotsService = {
    create: jest.fn(),
    findBySession: jest.fn(),
    updateBookedSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
        {
          provide: ShowtimeSessionsService,
          useValue: mockSessionsService,
        },
        {
          provide: ShowtimeSlotsService,
          useValue: mockSlotsService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of showtimes', async () => {
      const mockShowtimes = [mockShowtime];
      mockShowtimesService.findAll.mockResolvedValue(mockShowtimes);

      const result = await controller.findAll();

      expect(mockShowtimesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockShowtimes);
    });

    it('should return empty array when no showtimes exist', async () => {
      mockShowtimesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockShowtimesService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new showtime', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        auditoriumId: 1,
        startTime: new Date('2024-01-15T19:00:00'),
        endTime: new Date('2024-01-15T21:30:00'),
        price: 15.99,
      };

      mockShowtimesService.create.mockResolvedValue(mockShowtime);

      const result = await controller.create(createShowtimeDto);

      expect(mockShowtimesService.create).toHaveBeenCalledWith(
        createShowtimeDto,
      );
      expect(result).toEqual(mockShowtime);
    });

    it('should handle service errors during creation', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        auditoriumId: 1,
        startTime: new Date('2024-01-15T19:00:00'),
        endTime: new Date('2024-01-15T21:30:00'),
        price: 15.99,
      };

      mockShowtimesService.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.create(createShowtimeDto)).rejects.toThrow(
        'Database error',
      );
      expect(mockShowtimesService.create).toHaveBeenCalledWith(
        createShowtimeDto,
      );
    });
  });

  describe('findOne', () => {
    it('should return a showtime by id', async () => {
      mockShowtimesService.findOne.mockResolvedValue(mockShowtime);

      const result = await controller.findOne('1');

      expect(mockShowtimesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockShowtime);
    });

    it('should throw NotFoundException when showtime does not exist', async () => {
      mockShowtimesService.findOne.mockRejectedValue(
        new NotFoundException('Showtime with ID 999 not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockShowtimesService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('findByMovieId', () => {
    it('should return showtimes by movie id', async () => {
      const showtimes = [mockShowtime];
      mockShowtimesService.findByMovieId.mockResolvedValue(showtimes);

      const result = await controller.findByMovieId('1');

      expect(mockShowtimesService.findByMovieId).toHaveBeenCalledWith(1);
      expect(result).toEqual(showtimes);
    });
  });

  describe('findActiveShowtimes', () => {
    it('should return active showtimes', async () => {
      const activeShowtimes = [mockShowtime];
      mockShowtimesService.findActiveShowtimes.mockResolvedValue(
        activeShowtimes,
      );

      const result = await controller.findActiveShowtimes();

      expect(mockShowtimesService.findActiveShowtimes).toHaveBeenCalled();
      expect(result).toEqual(activeShowtimes);
    });
  });

  describe('findByDate', () => {
    it('should return showtimes by date', async () => {
      const date = '2024-01-15';
      const showtimes = [mockShowtime];
      mockShowtimesService.findByDate.mockResolvedValue(showtimes);

      const result = await controller.findByDate(date);

      expect(mockShowtimesService.findByDate).toHaveBeenCalledWith(date);
      expect(result).toEqual(showtimes);
    });
  });

  describe('createSession', () => {
    it('should create a new showtime session', async () => {
      const createSessionDto: CreateShowtimeSessionDto = {
        name: 'Evening Session',
        date: '2024-01-15',
        startTime: '19:00',
        endTime: '23:00',
      };

      mockSessionsService.create.mockResolvedValue(mockSession);

      const result = await controller.createSession(createSessionDto);

      expect(mockSessionsService.create).toHaveBeenCalledWith(createSessionDto);
      expect(result).toEqual(mockSession);
    });

    it('should handle service errors during session creation', async () => {
      const createSessionDto: CreateShowtimeSessionDto = {
        name: 'Evening Session',
        date: '2024-01-15',
        startTime: '19:00',
        endTime: '23:00',
      };

      mockSessionsService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.createSession(createSessionDto)).rejects.toThrow(
        'Database error',
      );
      expect(mockSessionsService.create).toHaveBeenCalledWith(createSessionDto);
    });
  });

  describe('getSessions', () => {
    it('should return sessions with slots', async () => {
      const sessions = [mockSession];
      mockShowtimesService.getSessionsWithSlots.mockResolvedValue(sessions);

      const result = await controller.getSessions();

      expect(mockShowtimesService.getSessionsWithSlots).toHaveBeenCalledWith(
        undefined,
      );
      expect(result).toEqual(sessions);
    });

    it('should return sessions filtered by date', async () => {
      const date = '2024-01-15';
      const sessions = [mockSession];
      mockShowtimesService.getSessionsWithSlots.mockResolvedValue(sessions);

      const result = await controller.getSessions(date);

      expect(mockShowtimesService.getSessionsWithSlots).toHaveBeenCalledWith(
        date,
      );
      expect(result).toEqual(sessions);
    });
  });

  describe('getSessionsByDate', () => {
    it('should return sessions by date', async () => {
      const date = '2024-01-15';
      const sessions = [mockSession];
      mockSessionsService.findByDate.mockResolvedValue(sessions);

      const result = await controller.getSessionsByDate(date);

      expect(mockSessionsService.findByDate).toHaveBeenCalledWith(date);
      expect(result).toEqual(sessions);
    });
  });

  describe('createSlot', () => {
    it('should create a new showtime slot', async () => {
      const createSlotDto: CreateShowtimeSlotDto = {
        sessionId: 1,
        movieId: 1,
        roomId: 1,
        startTime: '2024-01-15T19:00:00.000Z',
        basePrice: 15.99,
      };

      mockSlotsService.create.mockResolvedValue(mockSlot);

      const result = await controller.createSlot(createSlotDto);

      expect(mockSlotsService.create).toHaveBeenCalledWith(createSlotDto);
      expect(result).toEqual(mockSlot);
    });

    it('should handle time conflict during slot creation', async () => {
      const createSlotDto: CreateShowtimeSlotDto = {
        sessionId: 1,
        movieId: 1,
        roomId: 1,
        startTime: '2024-01-15T19:00:00.000Z',
        basePrice: 15.99,
      };

      mockSlotsService.create.mockRejectedValue(
        new ConflictException('Time conflict detected'),
      );

      await expect(controller.createSlot(createSlotDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockSlotsService.create).toHaveBeenCalledWith(createSlotDto);
    });
  });

  describe('getAvailableSlots', () => {
    it('should return available slots', async () => {
      const slots = [mockSlot];
      mockShowtimesService.getAvailableSlots.mockResolvedValue(slots);

      const result = await controller.getAvailableSlots();

      expect(mockShowtimesService.getAvailableSlots).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(result).toEqual(slots);
    });

    it('should return available slots filtered by movie and date', async () => {
      const movieId = 1;
      const date = '2024-01-15';
      const slots = [mockSlot];
      mockShowtimesService.getAvailableSlots.mockResolvedValue(slots);

      const result = await controller.getAvailableSlots(movieId, date);

      expect(mockShowtimesService.getAvailableSlots).toHaveBeenCalledWith(
        movieId,
        date,
      );
      expect(result).toEqual(slots);
    });
  });

  describe('getSlotsBySession', () => {
    it('should return slots by session', async () => {
      const sessionId = 1;
      const slots = [mockSlot];
      mockSlotsService.findBySession.mockResolvedValue(slots);

      const result = await controller.getSlotsBySession(sessionId);

      expect(mockSlotsService.findBySession).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(slots);
    });
  });

  describe('getSlotById', () => {
    it('should return a slot by id', async () => {
      const slotId = 1;
      mockShowtimesService.getSlotById.mockResolvedValue(mockSlot);

      const result = await controller.getSlotById(slotId);

      expect(mockShowtimesService.getSlotById).toHaveBeenCalledWith(slotId);
      expect(result).toEqual(mockSlot);
    });

    it('should throw NotFoundException when slot does not exist', async () => {
      const slotId = 999;
      mockShowtimesService.getSlotById.mockRejectedValue(
        new NotFoundException('Slot with ID 999 not found'),
      );

      await expect(controller.getSlotById(slotId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockShowtimesService.getSlotById).toHaveBeenCalledWith(slotId);
    });
  });

  describe('updateBookedSeats', () => {
    it('should update booked seats for a slot', async () => {
      const slotId = 1;
      const increment = 2;
      const updatedSlot = { ...mockSlot, bookedSeats: 7 };

      mockSlotsService.updateBookedSeats.mockResolvedValue(updatedSlot);

      const result = await controller.updateBookedSeats(slotId, { increment });

      expect(mockSlotsService.updateBookedSeats).toHaveBeenCalledWith(
        slotId,
        increment,
      );
      expect(result).toEqual(updatedSlot);
    });

    it('should handle invalid seat count', async () => {
      const slotId = 1;
      const increment = -10; // This would make bookedSeats negative

      mockSlotsService.updateBookedSeats.mockRejectedValue(
        new Error('Invalid seat count'),
      );

      await expect(
        controller.updateBookedSeats(slotId, { increment }),
      ).rejects.toThrow('Invalid seat count');
      expect(mockSlotsService.updateBookedSeats).toHaveBeenCalledWith(
        slotId,
        increment,
      );
    });
  });
});
