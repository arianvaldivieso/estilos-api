import { Status } from 'core/enums/card-status.enum';
import { CardType } from 'core/enums/card-type.enum';
import { User } from 'modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  card_number: string;

  @Column({ nullable: true })
  name: string;
  
  @Column({ nullable: true })
  number_account: string;

  @Column({ nullable: true })
  type: CardType;

  @Column({ default: Status.PENDING })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  //relationships
  @ManyToOne(() => User, (user) => user.cards)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
