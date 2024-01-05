import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../entities/otp.entity';

import * as moment from 'moment';
import { User } from '../entities/user.entity';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class OtpServiceService {
  constructor(
    @InjectRepository(Otp)
    private _otpRepository: Repository<Otp>,
  ) {}

  async createOtp(user: User, expirationMinutes: number): Promise<Otp> {
    const otp = await lastValueFrom(
      from(
        this._otpRepository.save({
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
}
