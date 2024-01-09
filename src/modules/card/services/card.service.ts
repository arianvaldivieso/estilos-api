import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CardDto } from '../dto/card.dto';
import { User } from 'modules/users/entities/user.entity';
import { Card } from '../entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelectByString, Repository } from 'typeorm';
import { UsersService } from 'modules/users/services/users.service';
import { from, lastValueFrom } from 'rxjs';
import { XmlsService } from './xmls.service';
import { CardType } from 'core/enums/card-type.enum';
import { CardStatus } from 'core/enums/card-status.enum';
import { RechargeCardDto } from '../dto/recharge.dto';
import { ApiStylesService } from './api-styles.service';
import { ListMovementCardDto } from '../dto/list-movement-card.dto';

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
    private readonly _apiStylesService: ApiStylesService,
  ) {}

  /**
   * Creates a new transaction.
   * @param {CardDto} associateCardDto - DTO containing card creation data.
   * @param {User} user - User initiating the transaction.
   * @returns {Promise<Card>} - Promise resolved with the created transaction.
   * @throws {BadRequestException} - Rolled if the card to be associated exists or the receiver cannot be found. In case it is a style card and it already has an associated
   */
  async associate(associateCardDto: CardDto, user: User): Promise<Card> {
    try {
      this.currentUser = user;
      const receiverId = associateCardDto.receiverId;
      const receiver = await this._usersService.findOneById(receiverId);

      //validation of existence of the id within the database
      if (!receiver) {
        throw new BadRequestException('Usuario no encontrado');
      }

      //validate if the card exists
      const hasExisteCard = this.validateCard(
        associateCardDto.number_account,
        true,
      );

      let payloadCard: any;

      //validates if the card is of the type card style
      if (associateCardDto.type === CardType.STYLE_CARD) {
        let card = await this.getCardByType(associateCardDto.type);

        //validates the status of the card within the system
        if (card) {
          if (
            card.status === CardStatus.APPROVED ||
            card.status === CardStatus.IN_PROCCESS ||
            card.status === CardStatus.PENDING
          ) {
            throw new BadRequestException('Ya posee una tarjeta estilo');
          }

          if (card.status === CardStatus.REFUSED) {
            throw new BadRequestException(
              'La tarjeta que esta intentando asociar ya fue rechazada',
            );
          }
        }

        //validates if the card is a style card
        let validateCard =
          await this._apiStylesService.ObtenerObtenerDatosTarjeta(
            associateCardDto.password,
            associateCardDto.card_number,
            receiver.documentNumber,
          );

        if (!validateCard) {
          throw new BadRequestException(
            'Error al intentar procesar la tarjeta',
          );
        }

        payloadCard = {
          card_number: associateCardDto.card_number,
          user: receiver,
          type: associateCardDto.type,
          number_account: validateCard.tarjetaCuenta,
        };

        if (validateCard) {
          payloadCard.number_account = validateCard.tarjetaCuenta;
        }

        const cardData = await this._cardRepository.save(payloadCard);

        //delete data
        delete cardData.user;
  
        throw new BadRequestException(
          'Aun no se encuentra activado el servicio para tarjetas distintas a tarjetas estilos',
        );
      }

      return 

    } catch (error) {
      throw new NotImplementedException(error);
    }
  }

  /**
   * Finds all cards associated with the current user.
   * @param {User} user - User for whom transactions are fetched.
   * @returns {Promise<Card[]>} - Promise resolved with an array of cards.
   */
  async findAll(user: User): Promise<Card[]> {
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

  /**
   * Finds a specific card by ID.
   * @param {number} id - ID of the card to be found.
   * @param {User} user - User for whom the card is fetched.
   * @returns {Promise<Card>} - Promise resolved with the found transaction.
   */
  async findOne(id: string, user: User): Promise<Card> {
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

  /**
   * Get card by card number.
   * @param {string} card_number - ID of the card to be found.
   * @returns {Promise<Card>} - Promise resolved with the found transaction.
   */
  async getCardByCardNumber(card_number: string): Promise<Card> {
    return await lastValueFrom(
      from(
        this._cardRepository.findOne({
          where: { card_number },
        }),
      ),
    );
  }

  /**
   * Get card by user id.
   * @param {User} user - User for whom the card is fetched.
   * @returns {Promise<Card>} - Promise resolved with the found transaction.
   */
  async getCardByUserId(user: User): Promise<Card> {
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

  /**
   * Get card by type card.
   * @param {CardType} type - type for whom the card is fetched.
   * @returns {Promise<Card>} - Promise resolved with the found transaction.
   */
  async getCardByType(type: CardType): Promise<Card> {
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

  /**
   * list Movements.
   * @param {User} user - User initiating the transaction.
   * @param {CardDto} pendingPaymentsCardDto - type for whom the card is fetched.
   * @returns {Promise<any>} - Promise resolved with the found transaction.
   */
  async pendingPayments(
    pendingPaymentsCardDto: CardDto,
    user: User,
  ): Promise<any> {
    try {
      const receiverId = pendingPaymentsCardDto.receiverId;
      const receiver = await this._usersService.findOneById(receiverId);

      //validation of existence of the id within the database
      if (!receiver) {
        throw new NotFoundException('Usuario no encontrado');
      }

      //validate if the card exists
      const hasExisteCard = this.validateCard(
        pendingPaymentsCardDto.number_account,
        true,
      );

      const cardData = await this._apiStylesService.ObtenerObtenerDatosTarjeta(
        this._apiStylesService.md5(pendingPaymentsCardDto.password),
        pendingPaymentsCardDto.card_number,
        receiver.documentNumber,
      );

      const movements = await this._apiStylesService.ConsultaLetrasPendientes(
        cardData.tarjetaCuenta,
      );

      return movements;
    } catch (error) {
      throw new NotImplementedException(error);
    }
  }

  /**
   * recharge.
   * @param {User} user - User initiating the transaction.
   * @param {RechargeCardDto} rechargeCardDto - type for whom the card is fetched.
   * @returns {Promise<any>} - Promise resolved with the found transaction.
   */
  async recharge(rechargeCardDto: RechargeCardDto, user: User): Promise<any> {
    try {
      this.currentUser = user;
      const receiverId = rechargeCardDto.receiverId;
      const receiver = await this._usersService.findOneById(receiverId);

      //validation of existence of the id within the database
      if (!receiver) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const card = await this.findOne(rechargeCardDto.cardId, user);

      //validates if the card is a style card
      let validateCard;

      if (card.type === CardType.STYLE_CARD) {
        validateCard = await this._apiStylesService.ObtenerObtenerDatosTarjeta(
          rechargeCardDto.password,
          card.card_number,
          receiver.documentNumber,
        );

        if (!validateCard) {
          throw new BadRequestException(
            'Error al intentar procesar la tarjeta',
          );
        }

        //check balance card style
        const result = await this._apiStylesService.consultaObtenerSaldo(
          validateCard.tarjetaCuenta,
        );

        if (result.disponible < rechargeCardDto.amount) {
          throw new BadRequestException(
            'El monto solicitado es mayor que el monto que contiene su tarjeta estilo',
          );
        }

        const xml = await this._xmlsService.transactionRegistration();

        const transactionRegistration =
          await this._apiStylesService.transactionRegistration();
      }

      return {};
    } catch (error) {
      throw new NotImplementedException(error);
    }
  }

  /**
   * recharge.
   * @param {boolean} hasExists - boolean type consult.
   * @param {string} card_number - card_number for whom the card is fetched.
   * @returns {Promise<boolean>} - Promise resolved with the found.
   * @throws {BadRequestException} - returning error
   */
  //validation functions
  async validateCard(
    card_number: string,
    hasExists: boolean,
  ): Promise<boolean> {
    const userHasCard = await this.getCardByCardNumber(card_number);

    //validation of existence of the card number
    if (userHasCard && hasExists) {
      throw new BadRequestException('Ya existe una tarjeta con ese número');
    }

    if (!userHasCard && !hasExists) {
      throw new BadRequestException('No tiene tarjeta asociada con ese numero');
    }

    return true;
  }

  /**
   * getMxCheckListMovements.
   * @param {ListMovementCardDto} listMovementCardDto - DTO containing card.
   * @param {User} user - User initiating the transaction.
   * @returns {Promise<any>} - Promise resolved with the found.
   * @throws {BadRequestException} - returning error
   */
  async getMxCheckListMovements(
    listMovementCardDto: ListMovementCardDto,
    user: User,
  ): Promise<any> {
    const receiverId = listMovementCardDto.receiverId;
    const receiver = await this._usersService.findOneById(receiverId);

    //validation of existence of the id within the database
    if (!receiver) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const card = await this.findOne(listMovementCardDto.cardId, user);

    if (!card) {
      throw new BadRequestException(
        'El id de la tarjeta no pertence a ninguna tarjeta',
      );
    }

    const cardData = await this._apiStylesService.ObtenerObtenerDatosTarjeta(
      this._apiStylesService.md5(listMovementCardDto.password),
      card.card_number,
      receiver.documentNumber,
    );

    const compareDate = this._apiStylesService.validarFechaFinal(new Date(listMovementCardDto.startDate), new Date(listMovementCardDto.endDate));

    if (!compareDate) {
      throw new BadRequestException(
        'La fecha final no puede ser menor a la fecha inicial',
      );
    }
    
    const result = await this._apiStylesService.mxConsultaListadoMovimientos(
      cardData.tarjetaCuenta,
      listMovementCardDto.startDate,
      listMovementCardDto.endDate,
    );

    return result;
  }
}
