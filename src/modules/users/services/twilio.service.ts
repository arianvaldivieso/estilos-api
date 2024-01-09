import { Injectable, Logger } from '@nestjs/common';
import * as twilio from 'twilio';

/**
 * Service for interacting with the Twilio API and sending SMS messages.
 */
@Injectable()
export class TwilioService {
  /**
   * Twilio client used for sending SMS messages.
   * @type {twilio.Twilio}
   * @private
   */
  private readonly client: twilio.Twilio;

  /**
   * Constructor for the TwilioService.
   * @constructor
   */
  constructor() {
    /**
     * Twilio client configured with account credentials.
     * @type {twilio.Twilio}
     * @private
     */
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  /**
   * Sends an SMS message to a specific phone number.
   * @param {string} to - Recipient's phone number.
   * @param {string} body - Body of the SMS message.
   * @returns {Promise<void>} - Promise resolved after sending the SMS message.
   * @throws {Error} - Thrown if there is an error sending the SMS message.
   */
  async sendSMS(to: string, body: string): Promise<void> {
    try {
      await this.client.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (error) {
      Logger.log(`Error sending SMS: ${error}`);
    }
  }
}
