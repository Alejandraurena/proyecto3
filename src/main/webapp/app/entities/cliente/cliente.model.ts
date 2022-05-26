import { IEmpleado } from 'app/entities/empleado/empleado.model';
import { ITarifaPlana } from 'app/entities/tarifa-plana/tarifa-plana.model';

export interface ICliente {
  id?: number;
  nombreCliente?: string;
  apellidocliente?: string;
  bloqueCliente?: string;
  phone?: string;
  correoCliente?: string;
  empleados?: IEmpleado[] | null;
  tarifaPlanas?: ITarifaPlana[] | null;
}

export class Cliente implements ICliente {
  constructor(
    public id?: number,
    public nombreCliente?: string,
    public apellidocliente?: string,
    public bloqueCliente?: string,
    public phone?: string,
    public correoCliente?: string,
    public empleados?: IEmpleado[] | null,
    public tarifaPlanas?: ITarifaPlana[] | null
  ) {}
}

export function getClienteIdentifier(cliente: ICliente): number | undefined {
  return cliente.id;
}
