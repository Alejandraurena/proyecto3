import dayjs from 'dayjs/esm';
import { ITipoVehiculo } from 'app/entities/tipo-vehiculo/tipo-vehiculo.model';
import { ITarifaPlana } from 'app/entities/tarifa-plana/tarifa-plana.model';
import { IFormaDePago } from 'app/entities/forma-de-pago/forma-de-pago.model';

export interface IFacturacion {
  id?: number;
  fechaFactura?: dayjs.Dayjs;
  valorFactura?: number;
  tipoVehiculos?: ITipoVehiculo[] | null;
  tarifaPlanas?: ITarifaPlana[] | null;
  formaDepago?: IFormaDePago;
}

export class Facturacion implements IFacturacion {
  constructor(
    public id?: number,
    public fechaFactura?: dayjs.Dayjs,
    public valorFactura?: number,
    public tipoVehiculos?: ITipoVehiculo[] | null,
    public tarifaPlanas?: ITarifaPlana[] | null,
    public formaDepago?: IFormaDePago
  ) {}
}

export function getFacturacionIdentifier(facturacion: IFacturacion): number | undefined {
  return facturacion.id;
}
