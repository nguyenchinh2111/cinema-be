import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('showtime_sessions')
export class ShowtimeSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string; // "Morning Session", "Afternoon Session", etc.

  @Column({ type: 'date' })
  date: Date; // Ngày chiếu

  @Column({ type: 'time' })
  startTime: string; // Giờ bắt đầu session (09:00)

  @Column({ type: 'time' })
  endTime: string; // Giờ kết thúc session (12:00)

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('ShowtimeSlot', 'session')
  slots: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
