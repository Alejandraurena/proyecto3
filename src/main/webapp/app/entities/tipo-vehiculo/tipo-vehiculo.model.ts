import { IVehiculo } from 'app/entities/vehiculo/vehiculo.model';
import { IFacturacion } from 'app/entities/facturacion/facturacion.model';

export interface ITipoVehiculo {
  id?: number;
  tipoVehiculo?: string;
  marcaVehiculo?: string;
  vehiculos?: IVehiculo[] | null;
  facturacion?: IFacturacion;
}

export class TipoVehiculo implements ITipoVehiculo {
  constructor(
    public id?: number,
    public tipoVehiculo?: string,
    public marcaVehiculo?: string,
    public vehiculos?: IVehiculo[] | null,
    public facturacion?: IFacturacion
  ) {}
}

export function getTipoVehiculoIdentifier(tipoVehiculo: ITipoVehiculo): number | undefined {
  return tipoVehiculo.id;
}
