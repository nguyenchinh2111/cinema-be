import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@ApiTags('showtimes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('/api/showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

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
}
