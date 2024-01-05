import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  otp: string;

  @Column({ nullable: false })
  expirationDate: Date;

  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: 'userId' })
  user: User;

  /** DATETIME */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
