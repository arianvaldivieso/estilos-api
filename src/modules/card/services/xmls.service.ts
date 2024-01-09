import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

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
   * @returns {Promise<string>} The parsed JSON object.
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
   * @returns {Promise<string>} The parsed JSON object.
   */
  async checkGetBalance(number_account: string) {
    const data = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tem:ConsultaObtenerSaldo>
            <!--Optional:-->
            <tem:tcTarjeta>?</tem:tcTarjeta>
            <!--Optional:-->
            <tem:tcCuenta>${number_account}</tem:tcCuenta>
        </tem:ConsultaObtenerSaldo>
      </soapenv:Body>
    </soapenv:Envelope>
       `;

    return data;
  }

  /**
   * Parse string to XML.
   * @param {string} number_account - The number_account string to be parsed.
   * @returns string.
   */
  async transactionRegistration(): Promise<string> {
    const data = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tem:TransactionRegistration>                  
      <!--Optional:-->                  
      <tem:BillType>NC</tem:BillType>                  
      <!--Optional:-->                  
      <tem:EstilosUserName>EstilosOnLine</tem:EstilosUserName>                  
      <!--Optional:-->                  
      <tem:EstilosStoreId>17</tem:EstilosStoreId>                  
      <!--Optional:-->                  
      <tem:EstilosCashierId>5</tem:EstilosCashierId>                  
      <!--Optional:-->                  
      <tem:EstilosCardUsed>1</tem:EstilosCardUsed>                  
      <!--Optional:-->                  
      <tem:XML><![CDATA[<POS><Detalle NLinea="1" Vendedor="15927" CodigoProducto="001671600" Descripcion="DISPOSICIÓN EFECTIVO S/.30 . ." Cantidad="1" PorcentajeDescuento="0" ValorUnitario="30" SubTotal1="30" ValorDescuento="0" SubTotal2="30" GravaImpuesto="0" ValorImpuesto="0" DescuentoGeneral="0" Beneficio="" MetodoCupon="" CuponesAplicados=""/><Pagos NPago="1" FormaPago="31" Cuotas="6" CodigoDocumento="16" NumeroDocumento="6010100103000009" Valor="30.000000" TitularTarjeta="DEMO DEMO" AutorizadorTarjeta="12345" Lote="12345" SubTotal1="30.000000" SubTotal2="30.000000" ValorImpuesto="0" TipoDiferido="2" CodigoOperador="" Cuenta="300000" BancoEmite="1" Credicash="1" Comision="3.00000000"/><Cliente IdCliente="99999999" TipoId="1" Nombre1="DEMO DEMO" DireccionDomicilio="Calle Canoas" TelefonoDomicilio1="999999999" CorreoElectronico="demo@hotmail.com" FechaNacimiento="1982-10-30" Observaciones="Nro Operacion: 2818" /></POS>]]></tem:XML>                  
      <!--Optional:-->                  
      <tem:CardAccount>300000</tem:CardAccount>                  
      <!--Optional:-->                  
      <tem:CardNumber>6010100103000009</tem:CardNumber>                  
      <!--Optional:-->                  
      <tem:CardPassword>12345</tem:CardPassword>                  
      <!--Optional:-->                  
      <tem:BillAmount>30.000000</tem:BillAmount>                  
      <!--Optional:-->                  
      <tem:BillDate>2023-12-19 00:00:00</tem:BillDate>                  
      <!--Optional:-->                  
      <tem:PaymentMode>2</tem:PaymentMode>                  
      <!--Optional:-->                  
      <tem:PaymentLength>6</tem:PaymentLength>                 
      <!--Optional:-->                  
      <tem:EstilosBussinessId>1</tem:EstilosBussinessId>                 
      <!--Optional:-->                  
      <tem:EstilosTerminalName>PCPRUEBA</tem:EstilosTerminalName>                 
      <!--Optional:-->                  
      <tem:EstilosPrinterName>S/N</tem:EstilosPrinterName>                  
      <!--Optional:-->                  
      <tem:SunatSerie>001</tem:SunatSerie>                  
      <!--Optional:-->                  
      <tem:SunatSequential>33511</tem:SunatSequential>                  
      <!--Optional:-->                  
      <tem:modoCaptura>CASHWEB</tem:modoCaptura>                 
      <!--Optional:-->                  
      <tem:TipoIdentificacion>1</tem:TipoIdentificacion>                  
      <!--Optional:-->                  
      <tem:IdDocumentoCliente>99999999</tem:IdDocumentoCliente>                  
      </tem:TransactionRegistration>                  
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
   * Parse string to XML.
   * @param {string} dni - The dni string to be parsed.
   * @returns {Promise<string>} The parsed JSON object.
   */
  async mxConsultaDatosClienteEBI(dni: string): Promise<any> {
    const data = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tem:mxConsultaDatosClienteEBI>
            <!--Optional:-->
            <tem:tcDNI>99999999</tem:tcDNI>
        </tem:mxConsultaDatosClienteEBI>
      </soapenv:Body>
    </soapenv:Envelope>
       `;

    return data;
  }

  /**
   * Parse XML string to JSON object.
   * @param {string} xmlString - The XML string to be parsed.
   * @param {object} [options={ explicitArray: false }] - Optional parsing options.
   * @returns {Promise<object>} The parsed JSON object.
   */
  async parseXMLtoJSON(xmlString: string): Promise<object> {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser();

      parser.parseString(xmlString, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
