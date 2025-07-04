import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 10, nullable: true })
  roomType?: string; // e.g., "Standard", "IMAX", "VIP"

  @Column({ nullable: true })
  floor?: number;

  @OneToMany('Showtime', 'room')
  showtimes: any[];

  @OneToMany('Seat', 'room')
  seats: any[];
}
