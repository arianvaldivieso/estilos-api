import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateCardDto } from '../dto/create-card.dto';
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
import { ListMovementCardDto } from '../dto/list-movement.dto';

@Injectable()
export class CardService {
  private currentUser: User;
  private attributes: FindOptionsSelectByString<Card> = [
    'name',
    'card_number',
    'number_account',
    'id',
  ];

  constructor(
    @InjectRepository(Card)
    private _cardRepository: Repository<Card>,
    private readonly _usersService: UsersService,
    private readonly _xmlsService: XmlsService,
  ) {}

  async create(createCardDto: CreateCardDto, user): Promise<Card> {
    try {
      this.currentUser = user;
      const receiverId = createCardDto.receiverId;
      const receiver = await this._usersService.findOneById(receiverId);

      if (!receiver) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const userHasCard = await this.getCardByCardNumber(
        createCardDto.card_number,
      );

      if (userHasCard) {
        throw new BadRequestException('Ya existe una tarjeta con ese número');
      }

      if (createCardDto.type === CardType.STYLE_CARD) {
        const typeHasCard = await this.getCardByType(createCardDto.type);

        if (typeHasCard) {
          throw new BadRequestException('Ya posee una tarjeta estilo');
        }
      }

      const payloadCard: Card = new Card();
      payloadCard.card_number = createCardDto.card_number;
      payloadCard.number_account = createCardDto.number_account;
      payloadCard.name = createCardDto.name;
      payloadCard.user = receiver;
      payloadCard.type = createCardDto.type;

      const cardData = await this._cardRepository.save(payloadCard);

      return cardData;
      
    } catch (error) {
      throw new NotImplementedException(JSON.stringify(error));
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
              id: user.id,
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
              id: user.id,
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

  async dataCardStyles(
    password: string,
    card_number: string,
    user: User,
    dni: string = '99999999',
  ) {
    try {
      const card = await this.getCardByUserId(user);

      if (!card) {
        throw new NotFoundException('Credenciales invalidas');
      }

      const data = await this._xmlsService.getCardData(
        dni,
        card_number,
        this.md5(password),
      );

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://wap.nuestrafamilia.com.pe:8003/Rp3.Web.Estilos.Ecommerce/ConsultaCredito.asmx?op=ObtenerObtenerDatosTarjeta',
        headers: {
          'Content-Type': 'text/xml',
        },
        data: data,
      };

      const response = await axios.request(config);
      const responseBody = await this._xmlsService.parseXMLtoJSON(
        response.data,
      );
      const parsedBody = await this._xmlsService.parseDataGetCard(responseBody);

      return parsedBody;
    } catch (error: unknown) {
      return null;
    }
  }

  async listMovements(listMovementCardDto: ListMovementCardDto, user: User) {
    try {
      const userHasCard = await this.getCardByCardNumber(
        listMovementCardDto.card_number,
      );

      if (!userHasCard) {
        throw new NotFoundException('Tarjeta no encontrada');
      }

      const cardData = await this.dataCardStyles(
        this.md5(listMovementCardDto.password),
        listMovementCardDto.card_number,
        user,
        user.documentNumber,
      );
      console.log("🚀 ~ file: card.service.ts:215 ~ CardService ~ listMovements ~ cardData:", JSON.stringify(cardData));

      const dates = this.getFormattedLast30Days();

      const data = this._xmlsService.createSoapEnvelope(`
        <tem:mxConsultaListadoMovimientos>
          <tem:tnEmpresa>1</tem:tnEmpresa> <!-- Por defecto va 1 -->
          <tem:tnCuenta>${cardData.data.number_account}</tem:tnCuenta> <!-- Número de cuenta estilos -->
          <tem:tcDesde>${dates['startDate']}</tem:tcDesde> <!-- Fecha Inicio de consulta a buscar -->
          <tem:tcHasta>${dates['endDate']}</tem:tcHasta> <!-- Fecha fin de consulta a buscar -->
        </tem:mxConsultaListadoMovimientos>
      `);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://tempuri.org/IEstilosTiendaVirtual/mxConsultaListadoMovimientos',
        headers: {
          'Content-Type': 'text/xml',
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(
        '🚀 ~ file: card.service.ts:223 ~ CardService ~ listMovements ~ response:',
        JSON.stringify(response),
      );

      //const movimiento = await this._xmlsService.parseConsultaListadoMovimientos(response)

      return {};
    } catch (error) {
      throw new NotImplementedException(JSON.stringify(error));
    }
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
}
