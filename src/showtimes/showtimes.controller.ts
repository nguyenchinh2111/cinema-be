import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
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
import { ShowtimesService } from './showtimes.service';
import { ShowtimeSessionsService } from './showtime-sessions.service';
import { ShowtimeSlotsService } from './showtime-slots.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { CreateShowtimeSessionDto } from './dto/create-showtime-session.dto';
import { CreateShowtimeSlotDto } from './dto/create-showtime-slot.dto';

@ApiTags('showtimes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('/api/showtimes')
export class ShowtimesController {
  constructor(
    private readonly showtimesService: ShowtimesService,
    private readonly sessionsService: ShowtimeSessionsService,
    private readonly slotsService: ShowtimeSlotsService,
  ) {}

  @ApiOperation({ summary: 'Get all showtimes' })
  @ApiResponse({ status: 200, description: 'List of all showtimes' })
  @Get()
  findAll() {
    return this.showtimesService.findAll();
  }

  @ApiOperation({ summary: 'Create a new showtime' })
  @ApiResponse({ status: 201, description: 'Showtime created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateShowtimeDto })
  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @ApiOperation({ summary: 'Get a showtime by ID' })
  @ApiResponse({ status: 200, description: 'Showtime found' })
  @ApiResponse({ status: 404, description: 'Showtime not found' })
  @ApiParam({ name: 'id', description: 'Showtime ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Get showtimes by movie ID' })
  @ApiResponse({ status: 200, description: 'List of showtimes for the movie' })
  @ApiParam({ name: 'movieId', description: 'Movie ID' })
  @Get('movie/:movieId')
  findByMovieId(@Param('movieId') movieId: string) {
    return this.showtimesService.findByMovieId(+movieId);
  }

  @ApiOperation({ summary: 'Get active showtimes' })
  @ApiResponse({ status: 200, description: 'List of active showtimes' })
  @Get('active/list')
  findActiveShowtimes() {
    return this.showtimesService.findActiveShowtimes();
  }

  @ApiOperation({ summary: 'Get showtimes by date' })
  @ApiResponse({ status: 200, description: 'List of showtimes for the date' })
  @ApiParam({ name: 'date', description: 'Date in YYYY-MM-DD format' })
  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.showtimesService.findByDate(date);
  }

  // NEW SESSION-BASED ENDPOINTS
  @ApiOperation({ summary: 'Create a new showtime session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateShowtimeSessionDto })
  @Post('sessions')
  createSession(@Body() createSessionDto: CreateShowtimeSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @ApiOperation({ summary: 'Get all showtime sessions with slots' })
  @ApiResponse({ status: 200, description: 'List of sessions with slots' })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by date (YYYY-MM-DD)',
  })
  @Get('sessions')
  getSessions(@Query('date') date?: string) {
    return this.showtimesService.getSessionsWithSlots(date);
  }

  @ApiOperation({ summary: 'Get sessions by date' })
  @ApiResponse({ status: 200, description: 'List of sessions for the date' })
  @ApiParam({ name: 'date', description: 'Date (YYYY-MM-DD)' })
  @Get('sessions/date/:date')
  getSessionsByDate(@Param('date') date: string) {
    return this.sessionsService.findByDate(date);
  }

  @ApiOperation({ summary: 'Create a new showtime slot' })
  @ApiResponse({ status: 201, description: 'Slot created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Time conflict detected' })
  @ApiBody({ type: CreateShowtimeSlotDto })
  @Post('slots')
  createSlot(@Body() createSlotDto: CreateShowtimeSlotDto) {
    return this.slotsService.create(createSlotDto);
  }

  @ApiOperation({ summary: 'Get available showtime slots' })
  @ApiResponse({ status: 200, description: 'List of available slots' })
  @ApiQuery({
    name: 'movieId',
    required: false,
    description: 'Filter by movie ID',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by date (YYYY-MM-DD)',
  })
  @Get('slots/available')
  getAvailableSlots(
    @Query('movieId', ParseIntPipe) movieId?: number,
    @Query('date') date?: string,
  ) {
    return this.showtimesService.getAvailableSlots(movieId, date);
  }

  @ApiOperation({ summary: 'Get slots by session ID' })
  @ApiResponse({ status: 200, description: 'List of slots for the session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @Get('sessions/:sessionId/slots')
  getSlotsBySession(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.slotsService.findBySession(sessionId);
  }

  @ApiOperation({ summary: 'Get a specific slot by ID' })
  @ApiResponse({ status: 200, description: 'Slot found' })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  @ApiParam({ name: 'slotId', description: 'Slot ID' })
  @Get('slots/:slotId')
  getSlotById(@Param('slotId', ParseIntPipe) slotId: number) {
    return this.showtimesService.getSlotById(slotId);
  }

  @ApiOperation({ summary: 'Update booked seats for a slot' })
  @ApiResponse({ status: 200, description: 'Booked seats updated' })
  @ApiResponse({ status: 400, description: 'Invalid seat count' })
  @ApiParam({ name: 'slotId', description: 'Slot ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        increment: {
          type: 'number',
          description: 'Number to add/subtract from booked seats',
        },
      },
    },
  })
  @Post('slots/:slotId/book')
  updateBookedSeats(
    @Param('slotId', ParseIntPipe) slotId: number,
    @Body() data: { increment: number },
  ) {
    return this.slotsService.updateBookedSeats(slotId, data.increment);
  }
}
