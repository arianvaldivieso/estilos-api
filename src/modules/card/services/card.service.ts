import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { AssociateCardDto } from '../dto/card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { createHash } from 'node:crypto';
import { User } from 'modules/users/entities/user.entity';
import { Card } from '../entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelectByString, Repository } from 'typeorm';
import { UsersService } from 'modules/users/services/users.service';
import { from, lastValueFrom } from 'rxjs';
import { XmlsService } from './xmls.service';
import axios from 'axios';
import { CardType } from 'core/enums/card-type.enum';
import { CardStatus } from 'core/enums/card-status.enum';
import { DataCard } from '../dto/get-data-card.dto';
import { RechargeCardDto } from '../dto/recharge.dto';

@Injectable()
export class CardService {
  private currentUser: User;
  private attributes: FindOptionsSelectByString<Card> = [
    'card_number',
    'number_account',
    'id',
    'type',
    'status',
  ];

  private readonly logger: Logger = new Logger(CardService.name);
  
  constructor(
    @InjectRepository(Card)
    private _cardRepository: Repository<Card>,
    private readonly _usersService: UsersService,
    private readonly _xmlsService: XmlsService,
  ) {}

  async associate(associateCardDto: AssociateCardDto, user): Promise<Card> {
    try {
      this.currentUser = user;
      const receiverId = associateCardDto.receiverId;
      const receiver = await this._usersService.findOneById(receiverId);

      //validation of existence of the id within the database
      if (!receiver) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const userHasCard = await this.getCardByCardNumber(
        associateCardDto.card_number,
      );

      //validation of existence of the card number
      if (userHasCard) {
        throw new BadRequestException('Ya existe una tarjeta con ese número');
      }

      const card = await this.getCardByType(associateCardDto.type);

      //validates the status of the card within the system
      if (card) {
        if (
          card.status === CardStatus.APPROVED ||
          card.status === CardStatus.IN_PROCCESS ||
          card.status === CardStatus.PENDING
        ) {
          throw new BadRequestException('Ya posee una tarjeta estilo');
        }
      }

      //validates if the card is a style card
      let validateCard: DataCard;

      if (associateCardDto.type === CardType.STYLE_CARD) {
        validateCard = await this.dataCardStyles(
          associateCardDto.password,
          associateCardDto.card_number,
          receiver.documentNumber,
        );
      }

      const payloadCard: Card = new Card();
      payloadCard.card_number = associateCardDto.card_number;
      payloadCard.user = receiver;
      payloadCard.type = associateCardDto.type;
      payloadCard.number_account = validateCard.number_account;

      if (associateCardDto.type === CardType.STYLE_CARD && validateCard) {
        payloadCard.number_account = validateCard.number_account;
      } else if (associateCardDto.number_account) {
        payloadCard.number_account = associateCardDto.number_account;
      }
      const cardData = await this._cardRepository.save(payloadCard);

      //delete data
      delete cardData.user;

      return cardData;
    } catch (error) {
      throw new NotImplementedException(error);
    }
  }

  async findAll(user: User) {
    this.currentUser = user;
    const cards = await lastValueFrom(
      from(
        this._cardRepository.find({
          select: this.attributes,
          where: {
            user: {
              //id: user.id,
              id: 2,
            },
          },
        }),
      ),
    );

    return cards;
  }

  async findOne(id: string) {
    return await lastValueFrom(
      from(
        this._cardRepository.findOne({
          select: this.attributes,
          where: {
            id,
          },
        }),
      ),
    );
  }

  update(id: string, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: string) {
    return `This action removes a #${id} card`;
  }

  private md5(content: string) {
    return createHash('md5').update(content).digest('hex');
  }

  async getCardByCardNumber(card_number: string) {
    return await lastValueFrom(
      from(
        this._cardRepository.findOne({
          where: { card_number },
        }),
      ),
    );
  }

  async getCardByUserId(user: User) {
    return await lastValueFrom(
      from(
        this._cardRepository.findOne({
          where: {
            user: {
              //id: user.id,
              id: 2,
            },
          },
        }),
      ),
    );
  }

  async getCardByType(type: CardType) {
    return await lastValueFrom(
      from(
        this._cardRepository.findOne({
          where: {
            type,
          },
        }),
      ),
    );
  }

  async dataCardStyles(password: string, card_number: string, dni: string) {
    try {
      const data = await this._xmlsService.getCardData(
        dni,
        card_number,
        this.md5(password),
      );

      const config = {
        method: 'post',
        url: 'https://wap.nuestrafamilia.com.pe/Rp3.Web.Estilos.Ecommerce/ConsultaCredito.asmx?op=ObtenerObtenerDatosTarjeta',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
        },
        data: data,
      };

      const response = await axios.request(config);
      const responseBody = await this._xmlsService.parseXMLtoJSON(
        response.data,
      );
      const parsedBody = await this._xmlsService.parseDataGetCard(responseBody);

      if (!parsedBody.status) {
        throw new UnauthorizedException(
          'Ha ocurrido un error al momento de procesar esta solicitud le recomendamos ponerse en contacto con los proveedores de servicios de su tarjeta',
        );
      }

      return parsedBody.data;
    } catch (error: unknown) {
      return null;
    }
  }

  async listMovements(listMovementCardDto: AssociateCardDto, user: User) {
    try {
      const receiverId = listMovementCardDto.receiverId;
      const receiver = await this._usersService.findOneById(receiverId);

      //validation of existence of the id within the database
      if (!receiver) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const userHasCard = await this.getCardByCardNumber(
        listMovementCardDto.card_number,
      );

      if (!userHasCard) {
        throw new NotFoundException('Tarjeta no encontrada');
      } else {
        if (
          userHasCard.status === CardStatus.IN_PROCCESS ||
          userHasCard.status === CardStatus.PENDING
        ) {
          throw new BadRequestException(
            'La tarjeta no ha sido procesada, debido ha esto aun no podra ser utiliza dentro de nuestro sistema',
          );
        }
      }

      const cardData = await this.dataCardStyles(
        this.md5(listMovementCardDto.password),
        listMovementCardDto.card_number,
        receiver.documentNumber,
      );

      const dates = this.getFormattedLast30Days();

      const data = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
            <tem:mxConsultaListadoMovimientos>
              <!--Optional:-->
              <tem:tnEmpresa>1</tem:tnEmpresa>
              <!--Optional:-->
              <tem:tnCuenta>${userHasCard.number_account}</tem:tnCuenta>
              <!--Optional:-->
              <tem:tcDesde>${dates['startDate']}</tem:tcDesde>
              <!--Optional:-->
              <tem:tcHasta>${dates['endDate']}</tem:tcHasta>
            </tem:mxConsultaListadoMovimientos>
        </soapenv:Body>
      </soapenv:Envelope>
      `;

      const config = {
        method: 'post',
        url: 'https://app.estilos.com.pe/Estilos.ServiceAppPagos/EstilosTiendaVirtual.svc?wsdl',
        headers: {
          'Content-Type': 'text/xml',
        },
        data: data,
      };

      const response = await axios.request(config);
      this.logger.debug(`BUILD_RESPONSE::INIT ${response}`);

      const responseBody = await this._xmlsService.parseXMLtoJSON(
        response.data,
      );

      /*const movimiento =
        await this._xmlsService.parseConsultaListadoMovimientos(
          response as SOAPResponse,
        );
      console.log(
        '🚀 ~ file: card.service.ts:285 ~ CardService ~ listMovements ~ movimiento:',
        movimiento,
      );*/

      return {};
    } catch (error) {
      throw new NotImplementedException(error);
    }
    console.log(
      '🚀 ~ file: card.service.ts:300 ~ CardService ~ listMovements ~ user.documentNumber:',
      user.documentNumber,
    );
  }

  async getFormattedLast30Days(): Promise<{
    startDate: string;
    endDate: string;
  }> {
    try {
      const currentDate: Date = new Date();

      const startDate: Date = new Date();
      startDate.setDate(currentDate.getDate() - 30);

      const formatDate = (date: Date): string => {
        const year: number = date.getFullYear();
        const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
        const day: string = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
      };

      const formattedStartDate: string = formatDate(startDate);
      const formattedCurrentDate: string = formatDate(currentDate);

      return {
        startDate: formattedStartDate,
        endDate: formattedCurrentDate,
      };
    } catch (error) {
      return null;
    }
  }

  async pendingPayments(pendingPaymentCardDto: AssociateCardDto, user: User) {
    try {
      const receiverId = pendingPaymentCardDto.receiverId;
      const receiver = await this._usersService.findOneById(receiverId);

      //validation of existence of the id within the database
      if (!receiver) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const userHasCard = await this.getCardByCardNumber(
        pendingPaymentCardDto.card_number,
      );
      console.log(
        '🚀 ~ file: card.service.ts:359 ~ CardService ~ pendingPayments ~ userHasCard:',
        userHasCard,
      );

      if (!userHasCard) {
        throw new NotFoundException('Tarjeta no encontrada');
      } else {
        if (
          userHasCard.status === CardStatus.IN_PROCCESS ||
          userHasCard.status === CardStatus.PENDING
        ) {
          throw new BadRequestException(
            'La tarjeta no ha sido procesada, debido ha esto aun no podra ser utiliza dentro de nuestro sistema',
          );
        }
      }

      //validates if the card is a style card
      let validateCard: DataCard;

      if (pendingPaymentCardDto.type === CardType.STYLE_CARD) {
        validateCard = await this.dataCardStyles(
          pendingPaymentCardDto.password,
          pendingPaymentCardDto.card_number,
          receiver.documentNumber,
        );
      }

      const data = this._xmlsService.getCheckOutstandingLetters(
        userHasCard.number_account,
      );
      console.log(
        '🚀 ~ file: card.service.ts:376 ~ CardService ~ pendingPayments ~ data:',
        data,
      );

      const config = {
        method: 'post',
        url: 'https://app.estilos.com.pe/Estilos.ServiceAppPagos/EstilosTiendaVirtual.svc?wsdl',
        headers: {
          'Content-Type': 'text/xml',
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(
        '🚀 ~ file: card.service.ts:409 ~ CardService ~ response:',
        response,
      );

      const responseBody = await this._xmlsService.parseXMLtoJSON(
        response.data,
      );

      const result =
        this._xmlsService.parseDataConsultaLetrasPendientesResult(response);
      console.log(
        '🚀 ~ file: card.service.ts:416 ~ CardService ~ result:',
        result,
      );

      return result;
    } catch (error) {
      throw new NotImplementedException(error);
    }
  }

  async recharge(rechargeCardDto: RechargeCardDto, user) {
    try {
      this.currentUser = user;
      const receiverId = rechargeCardDto.receiverId;
      const receiver = await this._usersService.findOneById(receiverId);

      //validation of existence of the id within the database
      if (!receiver) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const userHasCard = await this.findOne(rechargeCardDto.cardId);
      //validation of existence of the card number
      if (!userHasCard) {
        throw new BadRequestException(
          'El identificador recibido no se encuentra asoaciado a ninguna tarjeta',
        );
      }

      if (
        userHasCard.status === CardStatus.IN_PROCCESS ||
        userHasCard.status === CardStatus.PENDING
      ) {
        throw new BadRequestException(
          'La tarjeta no ha sido procesada, debido ha esto aun no podra ser utiliza dentro de nuestro sistema',
        );
      }

      //validates if the card is a style card
      let validateCard: DataCard;

      if (userHasCard.type === CardType.STYLE_CARD) {
        validateCard = await this.dataCardStyles(
          rechargeCardDto.password,
          userHasCard.card_number,
          receiver.documentNumber,
        );

        if (validateCard.amount < rechargeCardDto.amount) {
          throw new BadRequestException(
            'El monto solicitado es mayor que el monto que contiene su tarjeta estilo',
          );
        }

        //check balance card style
        /*const result = await this.validateBalanceCardStyle(
          userHasCard.number_account,
        );
*/
        const transactionRegistration =
          await this._xmlsService.transactionRegistration();
        console.log(
          '🚀 ~ file: card.service.ts:468 ~ CardService ~ recharge ~ transactionRegistration:',
          transactionRegistration,
        );
        const config = {
          method: 'post',
          url: 'http://wap.nuestrafamilia.com.pe:8003/Estilos.ServiceTiendaVirtual_dev/EstilosTiendaVirtual.svc?wsdl',
          headers: {
            'Content-Type': 'text/xml',
          },
          data: transactionRegistration,
        };

        const resultTransactionResult = await axios.request(config);
        console.log(
          '🚀 ~ file: card.service.ts:484 ~ CardService ~ recharge ~ resultTransactionResult:',
          resultTransactionResult,
        );
      }

      return {};
    } catch (error) {
      throw new NotImplementedException(error);
    }
  }

  async validateBalanceCardStyle(id: string) {
    this.logger.debug('BUILD_RESPONSE::INIT');

    const data = await this._xmlsService.checkGetBalance();
    this.logger.debug(`BUILD_RESPONSE::INIT data ${data}`);

    const config = {
      method: 'post',
      url: 'https://app.estilos.com.pe/Estilos.ServiceAppPagos/EstilosTiendaVirtual.svc',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      data: data,
    };

    const response = await axios.request(config);
    this.logger.debug(`BUILD_RESPONSE::INIT response ${response}`);

    this.logger.debug('BUILD_RESPONSE::INIT');

    return true;
  }
}
