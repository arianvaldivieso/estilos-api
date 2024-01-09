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

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  comision: number;

  type: string;
  comisionData;

  setTransactionType(userId: number): void {
    if (this.senderId == userId) {
      this.type = 'expense';
    } else if (this.receiverId == userId) {
      this.type = 'income';
    } else {
      this.type = 'unknown';
    }
  }

  calculateComision() {
    const calculate = this.amount * (this.comision / 100);
    const comisionTotal = this.amount * calculate;
    this.comisionData = {
      comision: this.comision,
      calculate: calculate,
      comisionTotal: comisionTotal,
    };
  }

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
