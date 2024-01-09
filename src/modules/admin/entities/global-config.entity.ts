import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GlobalConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  module: string;

  @Column({ nullable: false })
  value: string;
}
