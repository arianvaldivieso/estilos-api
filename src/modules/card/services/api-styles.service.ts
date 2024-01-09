import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { XmlsService } from './xmls.service';
import { createHash } from 'node:crypto';

@Injectable()
export class ApiStylesService {
  constructor(private _xmlsService: XmlsService) {}

  /**
   *
   * @param {string} url
   * @param {string} soapData
   * @param {any} config
   * @returns {Promise<any>} - Promise resolved.
   */
  private async soapApi(
    url: string,
    soapData: string,
    config: any,
  ): Promise<any> {
    // Realizar la solicitud SOAP con Axios
    const result = await axios
      .post(url, soapData, config)
      .then((response) => {
        // Procesar la respuesta SOAP
        //console.log(response.data);

        return response.data;
      })
      .catch((error) => {
        // Manejar errores
        console.error(error);
        return null;
      });

    return result;
  }

  /**
   *
   * @param {string} number_account
   * @returns {Promise<any>} - Promise resolved.
   */
  async consultaObtenerSaldo(number_account: string): Promise<any> {
    const soapData = await this._xmlsService.checkGetBalance(number_account);

    const url =
      'https://wap.nuestrafamilia.com.pe/Estilos.AppPagos/EstilosTiendaVirtual.svc';

    // Configuración de la solicitud Axios
    const config = {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction:
          'http://tempuri.org/IEstilosTiendaVirtual/ConsultaObtenerSaldo', // Reemplaza con la acción SOAP real
      },
    };

    // Realizar la solicitud SOAP con Axios
    const result = await this.soapApi(url, soapData, config);

    if (result) {
      const data: any = await this._xmlsService.parseXMLtoJSON(result);
      const json =
        data['s:Envelope']['s:Body'][0]['ConsultaObtenerSaldoResponse'][0][
          'ConsultaObtenerSaldoResult'
        ][0]['a:ECupoES'][0];

      return {
        cuenta: json['a:Cuenta'][0],
        disponible: json['a:Disponible'][0],
        linea: json['a:Linea'][0],
      };
    }

    return null;
  }

  /**
   *
   * @param {string} password
   * @param {string} card_number
   * @param {string} dni
   * @returns {Promise<any>} - Promise resolved.
   */
  async ObtenerObtenerDatosTarjeta(
    password: string,
    card_number: string,
    dni: string,
  ) {
    const soapData = await this._xmlsService.getCardData(
      dni,
      card_number,
      this.md5(password),
    );

    const url =
      'https://wap.nuestrafamilia.com.pe/Rp3.Web.Estilos.Ecommerce/ConsultaCredito.asmx?WSDL';

    // Configuración de la solicitud Axios
    const config = {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: 'http://tempuri.org/ObtenerObtenerDatosTarjeta', // Reemplaza con la acción SOAP real
      },
    };

    // Realizar la solicitud SOAP con Axios
    const result = await this.soapApi(url, soapData, config);

    if (result) {
      const data: any = await this._xmlsService.parseXMLtoJSON(result);

      const json =
        data['soap:Envelope']['soap:Body'][0][
          'ObtenerObtenerDatosTarjetaResponse'
        ][0]['ObtenerObtenerDatosTarjetaResult'][0];

      return {
        autorizacion: json['Autorizacion'][0],
        correcto: json['Correcto'][0],
        huboError: json['HuboError'][0],
        mensaje: json['Mensaje'][0],
        mensajeError: json['MensajeError'][0],
        tarjetaCuenta: json['TarjetaCuenta'][0],
        saldoActual: json['SaldoActual'][0],
        montoVencido: json['MontoVencido'][0],
        diasVencidos: json['DiasVencidos'][0],
        pagosVencidos: json['PagosVencidos'][0],
        primeraCompra: json['PrimeraCompra'][0],
        verifica: json['Verifica'][0],
        cupoDisponible: json['CupoDisponible'][0],
      };
    }

    return null;
  }

  /**
   *
   * @param {string} number_account
   * @returns {Promise<any>} - Promise resolved.
   */
  async ConsultaLetrasPendientes(number_account: string) {
    const soapData =
      await this._xmlsService.getCheckOutstandingLetters(number_account);

    const url =
      'https://app.estilos.com.pe/Estilos.ServiceAppPagos/EstilosTiendaVirtual.svc';

    // Configuración de la solicitud Axios
    const config = {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction:
          'http://tempuri.org/IEstilosTiendaVirtual/ConsultaLetrasPendientes', // Reemplaza con la acción SOAP real
      },
    };

    // Realizar la solicitud SOAP con Axios
    const result = await this.soapApi(url, soapData, config);

    if (result) {
      const data: any = await this._xmlsService.parseXMLtoJSON(result);
      console.log(
        '🚀 ~ file: api-styles.service.ts:137 ~ ApiStylesService ~ ConsultaLetrasPendientes ~ data:',
        data['s:Envelope']['s:Body'][0]['ConsultaLetrasPendientesResponse'][0][
          'ConsultaLetrasPendientesResult'
        ][0],
      );
      const json =
        data['s:Envelope']['s:Body'][0]['ConsultaLetrasPendientesResponse'][0][
          'ConsultaLetrasPendientesResult'
        ][0];

      const datosLetrasPendientesArray = [];

      for (
        let ind = 0;
        ind <
        json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'].length;
        ind++
      ) {
        const object = {
          auxSaldo:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:AuxSaldo'
            ][0],
          comercio:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Comercio'
            ][0],
          cuota:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Cuota'
            ][0],
          dctos:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Dctos'
            ][0],
          dias: json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][
            ind
          ]['a:Dias'][0],
          documento:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Documento'
            ][0],
          documento2:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Documento2'
            ][0],
          estado:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Estado'
            ][0],
          fEmision:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:FEmision'
            ][0],
          fPagos:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:FPagos'
            ][0],
          fVencimiento:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:FVencimiento'
            ][0],
          gastos:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Gastos'
            ][0],
          grupoEmpresa:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:GrupoEmpresa'
            ][0],
          id: json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][
            ind
          ]['a:Id'][0],
          importe:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Importe'
            ][0],
          minimoAmortizar:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:MinimoAmortizar'
            ][0],
          moneda:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Moneda'
            ][0],
          montoTcea:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:MontoTcea'
            ][0],
          nAdicional:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:NAdicional'
            ][0],
          pagar:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Pagar'
            ][0],
          pago: json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][
            ind
          ]['a:Pago'][0],
          pagos:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Pagos'
            ][0],
          saldo:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Saldo'
            ][0],
          tCEA: json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][
            ind
          ]['a:TCEA'][0],
          tienda:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:Tienda'
            ][0],
          tiendaDes:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:TiendaDes'
            ][0],
          valorPagoReal:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:ValorPagoReal'
            ][0],
          dSCTONUEVO:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:dSCTONUEVO'
            ][0],
          descripcionOperacion:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:descripcionOperacion'
            ][0],
          plazo:
            json['a:DatosLetrasPendientes'][0]['a:DatosLetrasPendientes'][ind][
              'a:plazo'
            ][0],
        };

        datosLetrasPendientesArray.push(object);
      }

      return {
        datosLetrasPendientes: datosLetrasPendientesArray,
        correcto: json['a:Correcto'][0] === 'true' ? true : false,
      };
    }

    return null;
  }

  /**
   *
   * @param {string} password
   * @param {string} card_number
   * @param {string} dni
   * @returns {Promise<any>} - Promise resolved.
   */
  async transactionRegistration() {
    const soapData = await this._xmlsService.transactionRegistration();

    const url =
      'http://wap.nuestrafamilia.com.pe:8003/Estilos.ServiceTiendaVirtual_dev/EstilosTiendaVirtual.svc';

    // Configuración de la solicitud Axios
    const config = {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction:
          'http://tempuri.org/IEstilosTiendaVirtual/TransactionRegistration', // Reemplaza con la acción SOAP real
      },
    };

    // Realizar la solicitud SOAP con Axios
    const result = await this.soapApi(url, soapData, config);

    if (result) {
      const data: any = await this._xmlsService.parseXMLtoJSON(result);
      console.log(
        '🚀 ~ file: api-styles.service.ts:137 ~ ApiStylesService ~ ConsultaLetrasPendientes ~ data:',
        JSON.parse(data['s:Envelope']['s:Body'][0]),
      );
      const json = data['s:Envelope']['s:Body'][0];

      const datosLetrasPendientesArray = [];

      return {
        datosLetrasPendientes: datosLetrasPendientesArray,
        correcto: json['a:Correcto'][0] === 'true' ? true : false,
      };
    }

    return null;
  }

  /**
   *
   * @param string content
   * @returns {string} - Promise resolved with an string encryp.
   */
  md5(content: string): string {
    return createHash('md5').update(content).digest('hex');
  }

  /**
   * @returns {Promise<any>} - Promise resolved with an string encryp.
   */
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
