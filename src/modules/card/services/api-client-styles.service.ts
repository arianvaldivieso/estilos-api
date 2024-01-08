import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { XmlsService } from './xmls.service';

@Injectable()
export class ApiClientStylesService {
  private readonly baseURL: string;
  private readonly headers: object;
  private readonly _xmlsService: XmlsService;

  constructor(baseURL: string, headers: object) {
    this.baseURL = baseURL;
    this.headers = headers;
  }

  async request(config: { headers?: object; data: any }) {
    const response = await axios.request({
      method: 'post',
      //maxBodyLength: Infinity,
      url: this.baseURL,
      headers: {
        ...this.headers,
        ...config.headers,
      },
      data: config.data,
    });
    const parseBody = await this._xmlsService.parseXMLtoJSON(response.data);

    return parseBody;
  }
}