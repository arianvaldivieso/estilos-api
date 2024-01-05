import { Injectable } from '@nestjs/common';
import { parseString } from 'xml2js';

export type SOAPResponse = {
  's:Envelope': {
    's:Body': {
      mxConsultaListadoMovimientosResponse: {
        mxConsultaListadoMovimientosResult: {
          $: {
            'i:nil': string;
          };
          'a:EListadoMovimientoES'?: {
            'a:Cancelado': string;
            'a:Cuotas': string;
            'a:Descripcion': string;
            'a:Dias': number;
            'a:Documento': string;
            'a:Documento2': string;
            'a:Emision': string;
            'a:Establecimiento': string;
            'a:Gasto': string;
            'a:GastosTotal': string;
            'a:Importe': string;
            'a:ImporteTotal': string;
            'a:Monto': string;
            'a:NAdicionales': number;
            'a:PagosLinea': string;
            'a:TOperacion': string;
            'a:Vencimiento': string;
          }[];
        };
      };
    };
  };
};

@Injectable()
export class XmlsService {
  /**
   * Parse string to XML.
   * @param {string} dni - The dni string to be parsed.
   * @param {string} card_number - The card_number string to be parsed.
   * @param {string} password - The endDate string to be parsed.
   * @returns {Promise<object>} The parsed JSON object.
   */
  async getCardData(
    dni: string,
    card_number: string,
    password: string,
  ): Promise<string> {
    const data = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
        <tem:ObtenerObtenerDatosTarjeta>
            <!--Optional:-->
            <tem:req>
                <!--DNI:-->
                <!--TODO: tarjeta estilos change to DNI from client-->
                <tem:Codigo>${dni}</tem:Codigo>
                <!--Optional:-->
                <tem:Empresa>1</tem:Empresa>
                <!--Optional:-->
                <tem:Cuenta>?</tem:Cuenta>
                <!--Optional:-->
                <tem:Usuario>?</tem:Usuario>
                <!--Optional:-->
                <tem:PcName>?</tem:PcName>
                <!--Optional:-->
                <tem:Tarjeta>${card_number}</tem:Tarjeta>
                <!--Optional:-->
                <tem:TarjetaBin>?</tem:TarjetaBin>
                <!--Optional:-->
                <tem:ClaveDigitada>${password}</tem:ClaveDigitada>
            </tem:req>
        </tem:ObtenerObtenerDatosTarjeta>
    </soapenv:Body>
</soapenv:Envelope>`;

    return data;
  }

  /**
   * Parse string to XML.
   * @param {string} number_account - The number_account string to be parsed.
   * @returns {Promise<object>} The parsed JSON object.
   */
  async getCheckOutstandingLetters(number_account: string): Promise<string> {
    const data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
           <tem:ConsultaLetrasPendientes>
              <!--Optional:-->
              <tem:tcTarjeta>?</tem:tcTarjeta>
              <!--Optional:-->
              <tem:tcCuenta>${number_account}</tem:tcCuenta>
           </tem:ConsultaLetrasPendientes>
        </soapenv:Body>
     </soapenv:Envelope>
     `;

    return data;
  }

  /**
   * Parse string to XML.
   * @param {string} number_account - The number_account string to be parsed.
   * @param {string} startDate - The startDate string to be parsed.
   * @param {string} endDate - The endDate string to be parsed.
   * @returns {Promise<object>} The parsed JSON object.
   */
  async getMxCheckListMovements(
    number_account: string,
    startDate: string,
    endDate: string,
  ) {
    const data = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
            <tem:mxConsultaListadoMovimientos>
            <tem:tnEmpresa>1</tem:tnEmpresa> <!-- Por defecto va 1 -->
            <tem:tnCuenta>${number_account}</tem:tnCuenta> <!-- Número de cuenta estilos -->
            <tem:tcDesde>${startDate}</tem:tcDesde> <!-- Fecha Inicio de consulta a buscar -->
            <tem:tcHasta>${endDate}</tem:tcHasta> <!-- Fecha fin de consulta a buscar -->
            </tem:mxConsultaListadoMovimientos>
        </soapenv:Body>
    </soapenv:Envelope>
`;

    return data;
  }

  /**
   * Parse XML string to JSON object.
   * @param {string} xml - The XML string to be parsed.
   * @param {object} [options={ explicitArray: false }] - Optional parsing options.
   * @returns {Promise<object>} The parsed JSON object.
   */
  async parseXMLtoJSON(
    xml: string,
    options = { explicitArray: false },
  ): Promise<object> {
    return new Promise((resolve, reject) => {
      parseString(xml, options, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Parse XML string to JSON object.
   * @param {object} data - The data object to be parsed.
   * @returns {Promise<object>} The parsed JSON object.
   */
  async parseDataGetCard(data: any): Promise<{
    status: boolean;
    data: {
      amount: any;
      message: any;
      number_account: any;
    };
  }> {
    const input = data['soap:Envelope']['soap:Body'];

    if (
      !input.ObtenerObtenerDatosTarjetaResponse ||
      !input.ObtenerObtenerDatosTarjetaResponse.ObtenerObtenerDatosTarjetaResult
    ) {
      throw new Error(
        'El objeto proporcionado no tiene la estructura esperada',
      );
    }

    const tarjetaData =
      input.ObtenerObtenerDatosTarjetaResponse.ObtenerObtenerDatosTarjetaResult;

    return {
      status: tarjetaData.Correcto === 'true',
      data: {
        amount: tarjetaData.SaldoActual,
        message: tarjetaData.Mensaje,
        number_account: tarjetaData.TarjetaCuenta,
      },
    };
  }

  /**
   * Parse XML string to JSON object.
   * @param string innerXml - The innerXml object to be parsed.
   * @returns string The parsed JSON object.
   */
  createSoapEnvelope(innerXml: string) {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          ${innerXml}
        </soapenv:Body>
      </soapenv:Envelope>`;
  }

  async parseConsultaListadoMovimientos(soapResponse: SOAPResponse) {
    const isResultNil =
      soapResponse?.['s:Envelope']?.['s:Body']?.[
        'mxConsultaListadoMovimientosResponse'
      ]?.['mxConsultaListadoMovimientosResult']?.['$']?.['i:nil'] === 'true';

    if (isResultNil) {
      return [];
    }

    const listadoMovimientos =
      soapResponse?.['s:Envelope']?.['s:Body']?.[
        'mxConsultaListadoMovimientosResponse'
      ]?.['mxConsultaListadoMovimientosResult']?.['a:EListadoMovimientoES'];

    let items: {
      canceled: string;
      installments: string;
      description: string;
      days: number;
      document: string;
      document2: string;
      emissionDate: string;
      establishment: string;
      expense: string;
      totalExpenses: string;
      amount: string;
      totalAmount: string;
      amountDue: string;
      additionalNotes: number;
      onlinePayments: string;
      operationType: string;
      dueDate: string;
    }[] = [];

    if (listadoMovimientos && Array.isArray(listadoMovimientos)) {
      items = listadoMovimientos.map((movimiento) => {
        return {
          canceled: movimiento['a:Cancelado'],
          installments: movimiento['a:Cuotas'],
          description: movimiento['a:Descripcion'],
          days: movimiento['a:Dias'],
          document: movimiento['a:Documento'],
          document2: movimiento['a:Documento2'],
          emissionDate: movimiento['a:Emision'],
          establishment: movimiento['a:Establecimiento'],
          expense: movimiento['a:Gasto'],
          totalExpenses: movimiento['a:GastosTotal'],
          amount: movimiento['a:Importe'],
          totalAmount: movimiento['a:ImporteTotal'],
          amountDue: movimiento['a:Monto'],
          additionalNotes: movimiento['a:NAdicionales'],
          onlinePayments: movimiento['a:PagosLinea'],
          operationType: movimiento['a:TOperacion'],
          dueDate: movimiento['a:Vencimiento'],
        };
      });
    }

    return {
      data: items,
    };
  }
}
