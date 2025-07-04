import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { Movie } from './movies/entities/movie.entity';
import { Showtime } from './showtimes/entities/showtime.entity';
import { ShowtimeSession } from './showtimes/entities/showtime-session.entity';
import { ShowtimeSlot } from './showtimes/entities/showtime-slot.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { Event } from './event/entities/event.entity';
import { Voucher } from './vouchers/entities/voucher.entity';
import { Room } from './rooms/entities/room.entity';
import { Seat } from './seats/entities/seat.entity';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { RoomsModule } from './rooms/rooms.module';
import { EventModule } from './event/event.module';
import { TicketsModule } from './tickets/tickets.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { SeatsModule } from './seats/seats.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'cinema_db',
      entities: [
        Movie,
        Showtime,
        ShowtimeSession,
        ShowtimeSlot,
        Ticket,
        Event,
        Voucher,
        Room,
        Seat,
      ],
      synchronize: true, // set to false in production
    }),
    AuthModule,
    MoviesModule,
    ShowtimesModule,
    RoomsModule,
    EventModule,
    TicketsModule,
    VouchersModule,
    SeatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
