
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
import { AllowedDocumentTypes } from '@core/enums/document-type.enum';
import { Role } from 'modules/roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  @Column({ nullable: false })
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
  @Column({ nullable: false, select: false })
  password: string;
  
  @ApiProperty({ type: String })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  token?: string;

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

  @ApiProperty({ type: String })
  @ManyToOne(() => Role, (rol) => rol.users)
  @JoinColumn({ name: 'rol_id' })
  rol: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
