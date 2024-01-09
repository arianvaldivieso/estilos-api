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
            <tem:BillType>NC</tem:BillType>  <!-- --NC (Por defecto) -->  
            <!--Optional:-->                  
            <tem:EstilosUserName>EstilosOnLine</tem:EstilosUserName> <!-- --EstilosOnLine (Por defecto) -->             
            <!--Optional:-->                  
            <tem:EstilosStoreId>35</tem:EstilosStoreId> <!-- --35 (Por defecto)  35 = Tienda Virtual  (Validar si será misma tienda o se creará otra) -->              
            <!--Optional:-->                  
            <tem:EstilosCashierId>10</tem:EstilosCashierId>  --10 (Por defecto)   Caja Credicash (Validar si se usará esta misma caja para billetera u otra) -->                  
            <!--Optional:-->                  
            <tem:EstilosCardUsed>1</tem:EstilosCardUsed> <!-- --1 (Por defecto) -Si se usará tarjeta estilos para pago -->                     
            <!--Optional:-->                  
            <tem:XML>
              <![CDATA[<POS>
                <Detalle NLinea="1" <!-- --Correlativo de línea -->
                Vendedor="15927" <!-- -Por defecto 15927 -->
                CodigoProducto="001671600" <!-- -Código del producto (Cada monto credicash tiene un código de producto) -->
                Descripcion="DISPOSICIÓN EFECTIVO S/.3 . ." <!-- -Descripción del producto -->
                Cantidad="1" <!-- --Cantidad -->
                PorcentajeDescuento="0" <!-- -Por defecto CERO -->
                ValorUnitario="3" <!-- -Valor del credicash -->
                SubTotal1="3" <!-- -Valor del credicash -->
                ValorDescuento="0" <!-- -Por defecto CERO -->
                SubTotal2="3"  <!-- —Valor del credicash -->
                GravaImpuesto="0" <!-- -Por defecto CERO -->
                ValorImpuesto="0" <!-- -Por defecto CERO -->
                DescuentoGeneral="0" <!-- -Por defecto CERO -->
                Beneficio="" <!-- -Por defecto vacío -->
                MetodoCupon="" <!-- -Por defecto vacío -->
                CuponesAplicados=""/> <!-- -Por defecto vacío -->

                <Pagos NPago="1" 
                FormaPago="31"  <!-- -Por defecto 31 -->
                Cuotas="6"  <!-- -Número de cuotas -->
                CodigoDocumento="16"  <!-- Por defecto 16 -->
                NumeroDocumento="6010100103000009" <!-- Numero de tarjeta estilos -->
                Valor="300.000000"  <!-- -Monto Credicash -->
                TitularTarjeta="DEMO DEMO"  <!-- Titular de la tarjeta -->
                AutorizadorTarjeta="12345"  <!-- Por defecto 12345 -->
                Lote="12345"  <!-- Por defecto 12345 -->
                SubTotal1="3.000000"  <!-- Monto credicash -->
                SubTotal2="3.000000"  <!-- Monto credicash -->
                ValorImpuesto="0"  <!-- Por defecto CERO -->
                TipoDiferido="2"  <!--  //TipoDiferido (1:sin interes, 2:en cuotas, 3:diferido) -->
                CodigoOperador="" <!-- Por defecto vacío -->
                Cuenta="300000" <!-- Número cuenta estilos -->
                BancoEmite="1" <!-- Por defecto 1 -->
                Credicash="1" <!-- Por defecto 1 -->
                Comision="0.300000000"/> <!-- Valor de comisión credicash (Actualmente es el 1% del total)-->

                <Cliente IdCliente="99999999" <!-- Documento de identidad del cliente-->
                TipoId="1" <!-- --Tipo de documento identidad (1: DNI, 4: RUC, 3: Carnet Extranjeria)-->
                Nombre1="DEMO DEMO" <!-- Nombre del cliente-->
                DireccionDomicilio="Calle Canoas" <!-- Dirección del cliente-->
                TelefonoDomicilio1="999999999" <!-- Teléfono del cliente-->
                CorreoElectronico="demo@hotmail.com" <!-- Correo del cliente-->
                FechaNacimiento="1982-10-30" <!-- Año nacimieno del cliente-->
                Observaciones="Nro Operacion: 2818" /> <!-- Codigo operación (En este caso de la transferencia bancaria)-->
             </POS>]]>
            </tem:XML>                  
            <!--Optional:-->                  
            <tem:CardAccount>300000</tem:CardAccount> <!--  -- Número Cuenta Estilos     -->                 
            <!--Optional:-->                  
            <tem:CardNumber>6010100103000009</tem:CardNumber> <!--  -- Número Tarjeta EStilos     -->                 
            <!--Optional:-->                  
            <tem:CardPassword>12345</tem:CardPassword> <!--  --12345 (Por defecto)      -->                 
            <!--Optional:-->                  
            <tem:BillAmount>3.000000</tem:BillAmount>  <!-- --Total de compra    -->                  
            <!--Optional:-->                  
            <tem:BillDate>2024-2-19 00:00:00</tem:BillDate> <!--   --Fecha Transacción      -->               
            <!--Optional:-->                  
            <tem:PaymentMode>2</tem:PaymentMode> <!--  //PaymentMode (1:sin interes, 2:en cuotas, 3:diferido) -->
            <!--Optional:-->                  
            <tem:PaymentLength>6</tem:PaymentLength>    <!--  --Número de cuotas      -->                           
            <!--Optional:-->                  
            <tem:EstilosBussinessId>1</tem:EstilosBussinessId>  <!--  --Por defecto va 1   -->                                
            <!--Optional:-->                  
            <tem:EstilosTerminalName>PCPRUEBA</tem:EstilosTerminalName> <!--  --Por defecto va PCPRUEBA   -->                                 
            <!--Optional:-->                  
            <tem:EstilosPrinterName>S/N</tem:EstilosPrinterName> <!--  --Por defecto va S/N -->                                    
            <!--Optional:-->                  
            <tem:SunatSerie>001</tem:SunatSerie> <!--  --Colocar el secuencial de sunat de la tienda-->
            <!--Optional:-->                  
            <tem:SunatSequential>33511</tem:SunatSequential> <!-- --Por defecto va 33511   -->                                                   
            <!--Optional:-->                  
            <tem:modoCaptura>CASHWEB</tem:modoCaptura> <!-- --Por defecto va CASHWEB  -->                                                   
            <!--Optional:-->                  
            <tem:TipoIdentificacion>1</tem:TipoIdentificacion> <!-- --Tipo de documento identidad (1: DNI, 4: RUC, 3: Carnet Extranjeria) -->
            <!--Optional:-->                  
            <tem:IdDocumentoCliente>99999999</tem:IdDocumentoCliente> <!--  --Número Documento de identidad -->                                                    
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
