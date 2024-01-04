import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class District {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({ type: String })
  name: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updateAt: Date;
}
