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
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('/api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll(@Query('customerEmail') customerEmail?: string) {
    if (customerEmail) {
      return this.ticketsService.findByCustomer(customerEmail);
    }
    return this.ticketsService.findAll();
  }

  @Get('stats')
  getBookingStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.ticketsService.getBookingStats(start, end);
  }

  @Get('code/:ticketCode')
  findByTicketCode(@Param('ticketCode') ticketCode: string) {
    return this.ticketsService.findByTicketCode(ticketCode);
  }

  @Get('showtime/:showtimeId')
  findByShowtime(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return this.ticketsService.findByShowtime(showtimeId);
  }

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Patch(':id/confirm-payment')
  confirmPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    paymentData: { paymentMethod: string; paymentTransactionId: string },
  ) {
    return this.ticketsService.confirmPayment(id, paymentData);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.cancel(id);
  }

  @Post('check-in/:ticketCode')
  checkIn(@Param('ticketCode') ticketCode: string) {
    return this.ticketsService.checkIn(ticketCode);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.remove(id);
  }
}
