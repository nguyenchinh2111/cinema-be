import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@ApiTags('tickets')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('/api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateTicketDto })
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @ApiOperation({ summary: 'Get all tickets or filter by customer email' })
  @ApiResponse({ status: 200, description: 'List of tickets' })
  @ApiQuery({
    name: 'customerEmail',
    required: false,
    description: 'Customer email filter',
  })
  @Get()
  findAll(@Query('customerEmail') customerEmail?: string) {
    if (customerEmail) {
      return this.ticketsService.findByCustomer(customerEmail);
    }
    return this.ticketsService.findAll();
  }

  @ApiOperation({ summary: 'Get booking statistics' })
  @ApiResponse({ status: 200, description: 'Booking statistics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date' })
  @Get('stats')
  getBookingStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.ticketsService.getBookingStats(start, end);
  }

  @ApiOperation({ summary: 'Get ticket by ticket code' })
  @ApiResponse({ status: 200, description: 'Ticket found' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiParam({ name: 'ticketCode', description: 'Ticket code' })
  @Get('code/:ticketCode')
  findByTicketCode(@Param('ticketCode') ticketCode: string) {
    return this.ticketsService.findByTicketCode(ticketCode);
  }

  @ApiOperation({ summary: 'Get tickets by showtime' })
  @ApiResponse({ status: 200, description: 'List of tickets for showtime' })
  @ApiParam({ name: 'showtimeId', description: 'Showtime ID' })
  @Get('showtime/:showtimeId')
  findByShowtime(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return this.ticketsService.findByShowtime(showtimeId);
  }

  @ApiOperation({ summary: 'Get tickets by date range' })
  @ApiResponse({ status: 200, description: 'List of tickets in date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date' })
  @ApiQuery({ name: 'endDate', description: 'End date' })
  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.ticketsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket found' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiBody({ type: UpdateTicketDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @ApiOperation({ summary: 'Confirm payment for a ticket' })
  @ApiResponse({ status: 200, description: 'Payment confirmed' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentMethod: { type: 'string' },
        paymentTransactionId: { type: 'string' },
      },
    },
  })
  @Patch(':id/confirm-payment')
  confirmPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    paymentData: { paymentMethod: string; paymentTransactionId: string },
  ) {
    return this.ticketsService.confirmPayment(id, paymentData);
  }

  @ApiOperation({ summary: 'Cancel a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket cancelled' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.cancel(id);
  }

  @ApiOperation({ summary: 'Check in a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket checked in' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiParam({ name: 'ticketCode', description: 'Ticket code' })
  @Post('check-in/:ticketCode')
  checkIn(@Param('ticketCode') ticketCode: string) {
    return this.ticketsService.checkIn(ticketCode);
  }

  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.remove(id);
  }
}
