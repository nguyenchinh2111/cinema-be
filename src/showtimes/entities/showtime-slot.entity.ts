import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Room } from '../../rooms/entities/room.entity';
import { ShowtimeSession } from './showtime-session.entity';

@Entity('showtime_slots')
@Index(['sessionId', 'roomId', 'startTime'], { unique: true }) // Không trùng phòng + giờ trong session
export class ShowtimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => ShowtimeSession, (session) => session.slots)
  @JoinColumn({ name: 'sessionId' })
  session: ShowtimeSession;

  @Column()
  sessionId: number;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  movieId: number;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  roomId: number;

  @Column({ type: 'datetime' })
  startTime: Date; // Giờ bắt đầu cụ thể của slot này

  @Column({ type: 'datetime' })
  endTime: Date; // Giờ kết thúc (startTime + movie.duration + 10 phút buffer)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  basePrice: number;

  @Column({ type: 'int', default: 0 })
  bookedSeats: number; // Số ghế đã đặt

  @Column({ type: 'int', default: 0 })
  totalSeats: number; // Tổng số ghế (từ room.capacity)

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual field để check availability
  get availableSeats(): number {
    return this.totalSeats - this.bookedSeats;
  }

  get isFullyBooked(): boolean {
    return this.bookedSeats >= this.totalSeats;
  }
}
