import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

describe('TicketsController', () => {
  let controller: TicketsController;

  const mockTicket = {
    id: 1,
    showtimeId: 1,
    seatId: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    price: 15.99,
    bookingReference: 'TKT123456',
    status: 'confirmed',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    showtime: { id: 1, movie: { title: 'The Matrix' } },
    seat: { id: 1, row: 'A', number: 1 },
  };

  const mockTicketsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCustomerEmail: jest.fn(),
    getTicketStats: jest.fn(),
    findByStatus: jest.fn(),
    findByDateRange: jest.fn(),
    findByShowtime: jest.fn(),
    cancelTicket: jest.fn(),
    confirmTicket: jest.fn(),
    bulkCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ticket', async () => {
      const createTicketDto: CreateTicketDto = {
        movieId: 1,
        showtimeId: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        seatNumber: '1',
        seatRow: 'A',
        originalPrice: 15.99,
        finalPrice: 15.99,
      };

      mockTicketsService.create.mockResolvedValue(mockTicket);

      const result = await controller.create(createTicketDto);

      expect(mockTicketsService.create).toHaveBeenCalledWith(createTicketDto);
      expect(result).toEqual(mockTicket);
    });

    it('should handle service errors during creation', async () => {
      const createTicketDto: CreateTicketDto = {
        movieId: 1,
        showtimeId: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        seatNumber: '1',
        seatRow: 'A',
        originalPrice: 15.99,
        finalPrice: 15.99,
      };

      mockTicketsService.create.mockRejectedValue(
        new Error('Seat already booked'),
      );

      await expect(controller.create(createTicketDto)).rejects.toThrow(
        'Seat already booked',
      );
      expect(mockTicketsService.create).toHaveBeenCalledWith(createTicketDto);
    });
  });

  describe('findAll', () => {
    it('should return all tickets when no filter is provided', async () => {
      const mockTickets = [mockTicket];
      mockTicketsService.findAll.mockResolvedValue(mockTickets);

      const result = await controller.findAll();

      expect(mockTicketsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTickets);
    });

    it('should return tickets filtered by customer email', async () => {
      const customerEmail = 'john@example.com';
      const mockTickets = [mockTicket];
      mockTicketsService.findByCustomerEmail.mockResolvedValue(mockTickets);

      const result = await controller.findAll(customerEmail);

      expect(mockTicketsService.findByCustomerEmail).toHaveBeenCalledWith(
        customerEmail,
      );
      expect(result).toEqual(mockTickets);
    });
  });

  describe('findOne', () => {
    it('should return a ticket by id', async () => {
      mockTicketsService.findOne.mockResolvedValue(mockTicket);

      const result = await controller.findOne(1);

      expect(mockTicketsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTicket);
    });

    it('should throw NotFoundException when ticket does not exist', async () => {
      mockTicketsService.findOne.mockRejectedValue(
        new NotFoundException('Ticket with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockTicketsService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a ticket', async () => {
      const updateTicketDto: UpdateTicketDto = {
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
      };
      const updatedTicket = { ...mockTicket, ...updateTicketDto };

      mockTicketsService.update.mockResolvedValue(updatedTicket);

      const result = await controller.update(1, updateTicketDto);

      expect(mockTicketsService.update).toHaveBeenCalledWith(
        1,
        updateTicketDto,
      );
      expect(result).toEqual(updatedTicket);
    });

    it('should throw NotFoundException when updating non-existent ticket', async () => {
      const updateTicketDto: UpdateTicketDto = { customerName: 'Updated Name' };

      mockTicketsService.update.mockRejectedValue(
        new NotFoundException('Ticket with ID 999 not found'),
      );

      await expect(controller.update(999, updateTicketDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTicketsService.update).toHaveBeenCalledWith(
        999,
        updateTicketDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a ticket', async () => {
      mockTicketsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(mockTicketsService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when removing non-existent ticket', async () => {
      mockTicketsService.remove.mockRejectedValue(
        new NotFoundException('Ticket with ID 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockTicketsService.remove).toHaveBeenCalledWith(999);
    });
  });
});
