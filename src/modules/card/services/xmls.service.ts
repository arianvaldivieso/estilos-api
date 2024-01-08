import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import { DataCard } from '../dto/get-data-card.dto';

export interface LetraPendiente {
  'a:AuxSaldo': string;
  'a:Comercio': string;
  'a:Cuota': string;
  'a:Dctos': string;
  'a:Dias': string;
  'a:Documento': string;
  'a:Documento2': string;
  'a:Estado': string;
  'a:FEmision': string;
  'a:FPagos': string;
  'a:FVencimiento': string;
  'a:Gastos': string;
  'a:GrupoEmpresa': string;
  'a:Id': string;
  'a:Importe': string;
  'a:MinimoAmortizar': string;
  'a:Moneda': string;
  'a:MontoTcea': string;
  'a:NAdicional': string;
  'a:Pagar': string;
  'a:Pago': string;
  'a:Pagos': string;
  'a:Saldo': string;
  'a:TCEA': string;
  'a:Tienda': string;
  'a:TiendaDes': string;
  'a:ValorPagoReal': string;
  'a:dSCTONUEVO': string;
  'a:descripcionOperacion': string;
  'a:plazo': string;
}

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

  async checkGetBalance() {
    const data = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tem:ConsultaObtenerSaldo>
            <!--Optional:-->
            <tem:tcTarjeta>?</tem:tcTarjeta>
            <!--Optional:-->
            <tem:tcCuenta>300000</tem:tcCuenta>
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
                Descripcion="DISPOSICIÓN EFECTIVO S/.300 . ." <!-- -Descripción del producto -->
                Cantidad="1" <!-- --Cantidad -->
                PorcentajeDescuento="0" <!-- -Por defecto CERO -->
                ValorUnitario="300" <!-- -Valor del credicash -->
                SubTotal1="300" <!-- -Valor del credicash -->
                ValorDescuento="0" <!-- -Por defecto CERO -->
                SubTotal2="300"  <!-- —Valor del credicash -->
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
                SubTotal1="300.000000"  <!-- Monto credicash -->
                SubTotal2="300.000000"  <!-- Monto credicash -->
                ValorImpuesto="0"  <!-- Por defecto CERO -->
                TipoDiferido="2"  <!--  //TipoDiferido (1:sin interes, 2:en cuotas, 3:diferido) -->
                CodigoOperador="" <!-- Por defecto vacío -->
                Cuenta="300000" <!-- Número cuenta estilos -->
                BancoEmite="1" <!-- Por defecto 1 -->
                Credicash="1" <!-- Por defecto 1 -->
                Comision="3.00000000"/> <!-- Valor de comisión credicash (Actualmente es el 1% del total)-->

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
            <tem:BillAmount>300.000000</tem:BillAmount>  <!-- --Total de compra    -->                  
            <!--Optional:-->                  
            <tem:BillDate>2023-12-19 00:00:00</tem:BillDate> <!--   --Fecha Transacción      -->               
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
   * Parse XML string to JSON object.
   * @param {string} xml - The XML string to be parsed.
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

  /**
   * Parse XML string to JSON object.
   * @param {object} data - The data object to be parsed.
   * @returns {Promise<object>} The parsed JSON object.
   */
  async parseDataGetCard(data: any): Promise<{
    status: boolean;
    data: any;
  }> {
    let input = data['soap:Envelope']['soap:Body'];
    input = input[0];

    if (input.ObtenerObtenerDatosTarjetaResponse) {
      input = input.ObtenerObtenerDatosTarjetaResponse;
      if (input && input[0]) {
        input = input[0];
        if (!input.ObtenerObtenerDatosTarjetaResult) {
          throw new Error(
            'El objeto proporcionado no tiene la estructura esperada',
          );
        }
      } else {
        throw new Error(
          'El objeto proporcionado no tiene la estructura esperada',
        );
      }
    } else {
      throw new Error(
        'El objeto proporcionado no tiene la estructura esperada',
      );
    }

    const tarjetaData = input.ObtenerObtenerDatosTarjetaResult;

    const result = {
      amount: tarjetaData[0].SaldoActual[0] ?? 0,
      message: tarjetaData[0].Mensaje[0] ?? '',
      number_account: tarjetaData[0].TarjetaCuenta[0] ?? '',
      autorization: tarjetaData[0].Autorizacion[0] ?? 0,
      amountExpired: tarjetaData[0].MontoVencido[0] ?? 0,
      daysExpired: tarjetaData[0].DiasVencidos[0] ?? 0,
      overduePayments: tarjetaData[0].PagosVencidos[0] ?? 0,
      firstBuy: tarjetaData[0].PrimeraCompra[0] ?? false,
      Verifica: tarjetaData[0].Verifica[0] ?? 0,
      availableQuotas: tarjetaData[0].CupoDisponible[0] ?? 0,
    };

    return {
      status: tarjetaData[0].Correcto[0] === 'true',
      data: result,
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

  async parseConsultaListadoMovimientos(soapResponse: any) {
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

  async parseDataConsultaLetrasPendientesResult(soapResponse: any) {
    const DatosLetrasPendientes =
      soapResponse?.['s:Envelope']?.['s:Body']?.ConsultaLetrasPendientesResponse
        ?.ConsultaLetrasPendientesResult?.['a:DatosLetrasPendientes'];
    let items: LetraPendiente[] = [];
    if (DatosLetrasPendientes !== '') {
      items = Array.isArray(DatosLetrasPendientes?.['a:DatosLetrasPendientes'])
        ? DatosLetrasPendientes?.['a:DatosLetrasPendientes']
        : [];
    }

    return {
      status:
        soapResponse?.['s:Envelope']?.['s:Body']
          ?.ConsultaLetrasPendientesResponse?.ConsultaLetrasPendientesResult?.[
          'a:Correcto'
        ] === 'true',
      data: items.map((item) => ({
        description: item['a:descripcionOperacion'],
        days: item['a:Dias'],
        date_issued: item['a:FEmision'],
        date_payment: item['a:FPagos'],
        date_expired: item['a:FVencimiento'],
        installment: item['a:Cuota'],
        document: item['a:Documento'],
        balance: item['a:Saldo'],
      })),
    };
  }
}
