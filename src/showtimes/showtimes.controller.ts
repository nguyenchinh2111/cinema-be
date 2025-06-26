import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Controller('/api/showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get()
  findAll() {
    return this.showtimesService.findAll();
  }

  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(+id);
  }

  @Get('movie/:movieId')
  findByMovieId(@Param('movieId') movieId: string) {
    return this.showtimesService.findByMovieId(+movieId);
  }

  @Get('active/list')
  findActiveShowtimes() {
    return this.showtimesService.findActiveShowtimes();
  }

  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.showtimesService.findByDate(date);
  }
}
