import axios, { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';

/**
 * Service for interacting with the MasterBase API and sending emails.
 */
@Injectable()
export class MasterBaseService {
  /**
   * URL of the MasterBase API for sending emails.
   * @type {string}
   * @private
   */
  private url = process.env.MAIL_MASTERBASE_UNIQUE;

  /**
   * Username for authentication with the MasterBase API.
   * @type {string}
   * @private
   */
  private username = process.env.MASTERBASE_USERNAME;

  /**
   * Password for authentication with the MasterBase API.
   * @type {string}
   * @private
   */
  private password = process.env.MASTERBASE_PASSWORD;

  /**
   * Email address for the "From" field in the MasterBase API.
   * @type {string}
   * @private
   */
  private emailBenefit = process.env.EMAIL_BENEFIT;

  /**
   * Sends an email through the MasterBase API.
   * @param {string} to - Recipient's email address.
   * @param {string} subject - Email subject.
   * @param {string} message - HTML-formatted body of the email.
   * @returns {Promise<AxiosResponse>} - Promise resolved with the HTTP request response.
   * @throws {Error} - Thrown if there is an error in the HTTP request.
   */
  async sendOtp(
    to: string,
    subject: string,
    message: string,
  ): Promise<AxiosResponse> {
    const data = {
      GeneralData: {
        FromName: 'Estilos',
        From: this.emailBenefit,
        To: {
          Email: [to],
        },
        Message: {
          Subject: subject,
          Classification: 'C',
          Body: {
            Format: 'html',
            Value: message,
          },
        },
        Options: {
          OpenTracking: 'true',
          ClickTracking: 'false',
          TextHtmlTracking: 'true',
          AutoTextBody: 'false',
          Personalization: 'true',
        },
      },
    };

    try {
      const response = await axios.post(this.url, data, {
        headers: { 'Content-Type': 'application/json' },
        auth: {
          username: this.username,
          password: this.password,
        },
      });

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`Error sending email: ${error}`);
    }
  }
}
