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
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventType } from './entities/event.entity';

@Controller('/api/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get('active')
  findActive() {
    return this.eventService.findActive();
  }

  @Get('featured')
  findFeatured() {
    return this.eventService.findFeatured();
  }

  @Get('upcoming')
  findUpcoming(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.eventService.findUpcoming(daysNum);
  }

  @Get('stats')
  getEventStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.eventService.getEventStats(start, end);
  }

  @Get('expiring')
  findExpiringSoon(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.eventService.findExpiringSoon(daysNum);
  }

  @Get('type/:eventType')
  findByType(@Param('eventType') eventType: EventType) {
    return this.eventService.findByType(eventType);
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.eventService.findByMovie(movieId);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.eventService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  @Patch(':id/attendees')
  updateAttendeeCount(
    @Param('id', ParseIntPipe) id: number,
    @Body() attendeeData: { increment: number },
  ) {
    return this.eventService.updateAttendeeCount(id, attendeeData.increment);
  }

  @Patch(':id/publish')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.publish(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.cancel(id);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.complete(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.remove(id);
  }
}
