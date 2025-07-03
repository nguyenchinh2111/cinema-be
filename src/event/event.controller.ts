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
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventType } from './entities/event.entity';

@ApiTags('events')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('/api/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateEventDto })
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'List of all events' })
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @ApiOperation({ summary: 'Get active events' })
  @ApiResponse({ status: 200, description: 'List of active events' })
  @Get('active')
  findActive() {
    return this.eventService.findActive();
  }

  @ApiOperation({ summary: 'Get featured events' })
  @ApiResponse({ status: 200, description: 'List of featured events' })
  @Get('featured')
  findFeatured() {
    return this.eventService.findFeatured();
  }

  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiResponse({ status: 200, description: 'List of upcoming events' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Days to look ahead',
  })
  @Get('upcoming')
  findUpcoming(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.eventService.findUpcoming(daysNum);
  }

  @ApiOperation({ summary: 'Get event statistics' })
  @ApiResponse({ status: 200, description: 'Event statistics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date' })
  @Get('stats')
  getEventStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.eventService.getEventStats(start, end);
  }

  @ApiOperation({ summary: 'Get events expiring soon' })
  @ApiResponse({ status: 200, description: 'List of expiring events' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Days until expiration',
  })
  @Get('expiring')
  findExpiringSoon(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.eventService.findExpiringSoon(daysNum);
  }

  @ApiOperation({ summary: 'Get events by type' })
  @ApiResponse({ status: 200, description: 'List of events by type' })
  @ApiParam({ name: 'eventType', description: 'Event type' })
  @Get('type/:eventType')
  findByType(@Param('eventType') eventType: EventType) {
    return this.eventService.findByType(eventType);
  }

  @ApiOperation({ summary: 'Get events by movie' })
  @ApiResponse({ status: 200, description: 'List of events for movie' })
  @ApiParam({ name: 'movieId', description: 'Movie ID' })
  @Get('movie/:movieId')
  findByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.eventService.findByMovie(movieId);
  }

  @ApiOperation({ summary: 'Get events by date range' })
  @ApiResponse({ status: 200, description: 'List of events in date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date' })
  @ApiQuery({ name: 'endDate', description: 'End date' })
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

  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiResponse({ status: 200, description: 'Event found' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ type: UpdateEventDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  @ApiOperation({ summary: 'Update event attendee count' })
  @ApiResponse({ status: 200, description: 'Attendee count updated' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        increment: { type: 'number' },
      },
    },
  })
  @Patch(':id/attendees')
  updateAttendeeCount(
    @Param('id', ParseIntPipe) id: number,
    @Body() attendeeData: { increment: number },
  ) {
    return this.eventService.updateAttendeeCount(id, attendeeData.increment);
  }

  @ApiOperation({ summary: 'Publish an event' })
  @ApiResponse({ status: 200, description: 'Event published' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Patch(':id/publish')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.publish(id);
  }

  @ApiOperation({ summary: 'Cancel an event' })
  @ApiResponse({ status: 200, description: 'Event cancelled' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.cancel(id);
  }

  @ApiOperation({ summary: 'Complete an event' })
  @ApiResponse({ status: 200, description: 'Event completed' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.complete(id);
  }

  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.remove(id);
  }
}
