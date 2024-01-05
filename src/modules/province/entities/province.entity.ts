import { Departament } from 'modules/departament/entities/departament.entity';
import { District } from 'modules/district/entities/district.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @ManyToOne(() => Departament, (departament) => departament.provinces)
  @JoinColumn({ name: 'departamentId' })
  departament: Departament;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
