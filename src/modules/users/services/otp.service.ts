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

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    @InjectRepository(User) private userRepository: Repository<User>,
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
}
