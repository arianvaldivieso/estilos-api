import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  question: string;

  @Column({
    nullable: false,
  })
  url_video: string;

  @Column({
    nullable: false,
  })
  body: string;

  @Column({
    nullable: false,
  })
  category: string;
}
