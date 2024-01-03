import { RoleType } from '@core/enums/role-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';

@Entity()

export class Role {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @ApiProperty({ type: String })
  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  name: string;

  @ApiProperty({ type: String })
  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @ApiProperty({ type: Date })
  @Column({
      name: 'created_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Column({
      name: 'update_at',
      type: 'timestamp',
      default: null,
  })
  updateAt: Date;
}
