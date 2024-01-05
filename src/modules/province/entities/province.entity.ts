import { Departament } from 'modules/departament/entities/departament.entity';
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
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @ManyToOne(() => Departament, (departament) => departament.provinces)
  @JoinColumn({ name: 'departamentId' })
  departament: Departament;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
