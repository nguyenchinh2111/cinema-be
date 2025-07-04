import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

export enum SeatType {
  STANDARD = 'standard',
  VIP = 'vip',
  PREMIUM = 'premium',
  COUPLE = 'couple',
  WHEELCHAIR = 'wheelchair',
}

export enum SeatStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  DISABLED = 'disabled',
}

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Room, (room) => room.seats)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  roomId: number;

  @Column({ type: 'varchar', length: 5 })
  row: string;

  @Column({ type: 'varchar', length: 10 })
  number: string;

  @Column({ type: 'enum', enum: SeatType, default: SeatType.STANDARD })
  seatType: SeatType;

  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.AVAILABLE })
  status: SeatStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceModifier: number; // Modifier để tính giá (VIP seat có thể có modifier 1.5)

  @Column({ type: 'int', nullable: true })
  xPosition: number; // Vị trí X trong layout

  @Column({ type: 'int', nullable: true })
  yPosition: number; // Vị trí Y trong layout

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
