// transaction.entity.ts

import { User } from 'modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  senderId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ nullable: true })
  receiverId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column()
  amount: number;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
