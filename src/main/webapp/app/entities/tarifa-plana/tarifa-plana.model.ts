import { IFacturacion } from 'app/entities/facturacion/facturacion.model';
import { ICliente } from 'app/entities/cliente/cliente.model';

export interface ITarifaPlana {
  id?: number;
  valor?: number;
  fechaPago?: string;
  facturacion?: IFacturacion;
  cliente?: ICliente;
}

export class TarifaPlana implements ITarifaPlana {
  constructor(
    public id?: number,
    public valor?: number,
    public fechaPago?: string,
    public facturacion?: IFacturacion,
    public cliente?: ICliente
  ) {}
}

export function getTarifaPlanaIdentifier(tarifaPlana: ITarifaPlana): number | undefined {
  return tarifaPlana.id;
}
