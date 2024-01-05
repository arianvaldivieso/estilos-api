import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { AllowedDocumentTypes } from 'core/enums/document-type.enum';
import { Role } from 'modules/roles/entities/role.entity';
import { Transaction } from 'modules/transaction/entities/transaction.entity';
import { Otp } from './otp.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  secondLastName: string;

  @Column({ nullable: true, default: null })
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
  birthdate: Date;

  @Column({ nullable: false })
  department: string;

  @Column({ nullable: false })
  province: string;

  @Column({ nullable: false })
  district: string;

  /** Terms & Conditions */

  @Column({ nullable: false })
  termsAndConditions: boolean;

  @Column({ nullable: false })
  dataPrivacy: boolean;

  @Column({ nullable: false })
  electronicMoneyContract: boolean;

  @Column({ nullable: false })
  offersAndDiscounts: boolean;

  @Column({ nullable: false, select: true })
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  receivedTransactions: Transaction[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  /** DATETIME */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => Role, (rol) => rol.users)
  @JoinColumn({ name: 'roleId' })
  rol: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
