import { Role } from 'src/roles/entities/role.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { AllowedDocumentTypes } from 'src/@core/enums/document-type.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  avatar: string;

  @Column({ nullable: false })
  documentType: AllowedDocumentTypes;

  @Column({ nullable: false })
  documentNumber: string;

  @Column({ nullable: false })
  cellPhone: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  department: string;

  @Column({ nullable: false })
  province: string;

  @Column({ nullable: false })
  district: string;

  @Column({ nullable: false })
  termsAndConditions: boolean;

  @Column({ nullable: false })
  dataPrivacy: boolean;

  @Column({ nullable: false })
  electronicMoneyContract: boolean;

  @Column({ nullable: false })
  offersAndDiscounts: boolean;

  @Column({ nullable: false, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Role, { eager: true }) // Puedes cambiar "eager" según tus necesidades
  @JoinColumn({ name: 'roleId' }) // Asegúrate de tener una columna "roleId" en tu tabla User
  role: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
