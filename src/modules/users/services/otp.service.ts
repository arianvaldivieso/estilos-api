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
import { UsersService } from './users.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    @InjectRepository(User) private userRepository: Repository<User>,

    private twilioService: TwilioService,
    //private userService: UsersService,
  ) {}

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

  async validateOtp(userId: number, userOtp: string): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.otps', 'otp')
      .where('user.id = :userId', { userId })
      .orderBy('otp.createdAt', 'DESC')
      .getOne();

    if (!user || !user.otps || user.otps.length === 0) {
      throw new NotFoundException(
        'No se encontró el usuario o el OTP asociado.',
      );
    }

    const latestOtp = user.otps[0];

    if (userOtp.toString() !== latestOtp.otp) {
      throw new BadRequestException('El OTP proporcionado es incorrecto.');
    }

    if (new Date() > latestOtp.expirationDate) {
      throw new BadRequestException('El OTP ha expirado.');
    }

    await this.otpRepository.remove(latestOtp);

    return true;
  }

  async sendOtp(user, cellPhone, email) {
    const otp = await this.createOtp(user, 5);
    const messageBody = `Tu código de verificación es: ${otp.otp}. No compartas este código con nadie.`;
    this.twilioService.sendSMS(cellPhone, messageBody);
  }

  async resendOtp(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    await this.sendOtp(user, user.cellPhone, user.email);
  }
}
