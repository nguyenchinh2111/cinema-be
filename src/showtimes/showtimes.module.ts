import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimeSessionsService } from './showtime-sessions.service';
import { ShowtimeSlotsService } from './showtime-slots.service';
import { Showtime } from './entities/showtime.entity';
import { ShowtimeSession } from './entities/showtime-session.entity';
import { ShowtimeSlot } from './entities/showtime-slot.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Room } from '../rooms/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Showtime,
      ShowtimeSession,
      ShowtimeSlot,
      Movie,
      Room,
    ]),
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService, ShowtimeSessionsService, ShowtimeSlotsService],
  exports: [ShowtimesService, ShowtimeSessionsService, ShowtimeSlotsService],
})
export class ShowtimesModule {}
