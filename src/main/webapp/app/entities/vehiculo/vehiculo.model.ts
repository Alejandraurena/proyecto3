import { IRegistro } from 'app/entities/registro/registro.model';
import { ITipoVehiculo } from 'app/entities/tipo-vehiculo/tipo-vehiculo.model';

export interface IVehiculo {
  id?: number;
  placa?: string;
  registros?: IRegistro[] | null;
  tipoVehiculo?: ITipoVehiculo;
}

export class Vehiculo implements IVehiculo {
  constructor(public id?: number, public placa?: string, public registros?: IRegistro[] | null, public tipoVehiculo?: ITipoVehiculo) {}
}

export function getVehiculoIdentifier(vehiculo: IVehiculo): number | undefined {
  return vehiculo.id;
}
