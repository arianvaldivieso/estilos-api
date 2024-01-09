import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../entities/otp.entity';

import * as moment from 'moment';
import { User } from '../entities/user.entity';
import { from, lastValueFrom } from 'rxjs';
import { TwilioService } from './twilio.service';
import { MasterBaseService } from './master-base.service';
import { ConfigService } from 'modules/admin/config/config.service';

/**
 * Service for managing One-Time Password (OTP) codes.
 */
@Injectable()
export class OtpService {
  /**
   * Constructor for the OtpService.
   * @param {Repository<Otp>} otpRepository - Repository for the Otp entity.
   * @param {Repository<User>} userRepository - Repository for the User entity.
   * @param {TwilioService} twilioService - Twilio service for sending SMS messages.
   * @param {MasterBaseService} masterBaseService - Service for sending emails via MasterBase.
   * @param {ConfigService} configService - Service for sending emails via MasterBase.
   */
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    @InjectRepository(User) private userRepository: Repository<User>,

    private twilioService: TwilioService,
    private masterBaseService: MasterBaseService,
    private configService: ConfigService,
  ) {}

  /**
   * Creates a new OTP code for a user.
   * @param {User} user - User for whom the OTP is created.
   * @param {number} expirationMinutes - Expiration duration in minutes for the OTP code.
   * @returns {Promise<Otp>} - Promise resolved with the created Otp object.
   */
  async createOtp(user: User, expirationMinutes: number): Promise<Otp> {
    const otp = await lastValueFrom(
      from(
        this.otpRepository.save({
          otp: this.generateOTP(),
          expirationDate: moment().add(expirationMinutes, 'minutes').toDate(),
          user: user,
        }),
      ),
    );

    return otp;
  }

  /**
   * Generates a random OTP code.
   * @returns {string} - Generated OTP code.
   */
  generateOTP() {
    const otpLength = 6;
    const allowedChars = '0123456789';

    let otp = '';
    for (let i = 0; i < otpLength; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      otp += allowedChars.charAt(randomIndex);
    }

    return otp;
  }

  /**
   * Validates an OTP code for a given user.
   * @param {number} userId - User ID.
   * @param {string} userOtp - OTP code provided by the user.
   * @returns {Promise<boolean>} - Promise resolved with a boolean indicating whether the validation was successful.
   * @throws {NotFoundException} - Thrown if the user or associated OTP is not found.
   * @throws {BadRequestException} - Thrown if the provided OTP is incorrect or has expired.
   */
  async validateOtp(userId: number, userOtp: string): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.otps', 'otp')
      .where('user.id = :userId', { userId })
      .orderBy('otp.createdAt', 'DESC')
      .getOne();

    if (!user || !user.otps || user.otps.length === 0) {
      throw new NotFoundException('User or associated OTP not found.');
    }

    const latestOtp = user.otps[0];

    if (userOtp.toString() !== latestOtp.otp) {
      throw new BadRequestException('Incorrect OTP provided.');
    }

    if (new Date() > latestOtp.expirationDate) {
      throw new BadRequestException('OTP has expired.');
    }

    await this.otpRepository.remove(latestOtp);

    return true;
  }

  /**
   * Sends an OTP code via SMS.
   * @param {User} user - User to whom the OTP code will be sent.
   * @param {string} cellPhone - User's mobile phone number.
   * @param {string} email - User's email address.
   * @returns {Promise<void>} - Promise resolved after sending the OTP code.
   */
  async sendOtp(user, cellPhone, email) {
    const minutexExpirationOtp = await this.configService.finOneByKeyAndModule(
      'time',
      'otp',
    );

    const otp = await this.createOtp(
      user,
      minutexExpirationOtp ? parseInt(minutexExpirationOtp.value) : 5,
    );
    const messageBody = `Tu código de verificación es: ${otp.otp}. No compartas este código con nadie.`;
    this.twilioService.sendSMS(cellPhone, messageBody);
    this.masterBaseService.sendOtp(email, 'OTP', messageBody);
  }

  /**
   * Resends an OTP code for a given user.
   * @param {number} userId - User ID.
   * @returns {Promise<void>} - Promise resolved after sending the new OTP code.
   */
  async resendOtp(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    await this.sendOtp(user, user.cellPhone, user.email);
  }
}
