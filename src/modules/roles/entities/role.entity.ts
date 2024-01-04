import { RoleType } from '@core/enums/role-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'modules/users/entities/user.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

@Entity()
export class Role {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: RoleType })
  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  name: string;

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

  //relationships
  @OneToMany(() => User, (user) => user.rol)
  users?: User[];
}
