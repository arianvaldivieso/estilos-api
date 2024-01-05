import { ApiProperty } from '@nestjs/swagger';
import { Province } from 'modules/province/entities/province.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updateAt: Date;
}
