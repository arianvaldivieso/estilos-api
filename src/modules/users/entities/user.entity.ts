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
import { AllowedDocumentTypes } from '@core/enums/document-type.enum';
import { Role } from 'modules/roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from 'modules/transaction/entities/transaction.entity';

@Entity()
export class User {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  firstName: string;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  lastName: string;

  @ApiProperty({ type: String })
  @Column({ nullable: true, default: null })
  avatar: string;

  @ApiProperty({ enum: AllowedDocumentTypes })
  @Column({ nullable: false })
  documentType: AllowedDocumentTypes;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  documentNumber: string;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  cellPhone: string;

  @ApiProperty({ type: String })
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  department: string;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  province: string;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  district: string;

  /** Terms & Conditions */

  @ApiProperty({ type: Boolean })
  @Column({ nullable: false })
  termsAndConditions: boolean;

  @ApiProperty({ type: Boolean })
  @Column({ nullable: false })
  dataPrivacy: boolean;

  @ApiProperty({ type: Boolean })
  @Column({ nullable: false })
  electronicMoneyContract: boolean;

  @ApiProperty({ type: Boolean })
  @Column({ nullable: false })
  offersAndDiscounts: boolean;

  @ApiProperty({ type: String })
  @Column({ nullable: false, select: true })
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  receivedTransactions: Transaction[];

  /** DATETIME */

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updateAt: Date;

  @ApiProperty({ type: String })
  @ManyToOne(() => Role, (rol) => rol.users)
  @JoinColumn({ name: 'roleId' })
  rol: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
