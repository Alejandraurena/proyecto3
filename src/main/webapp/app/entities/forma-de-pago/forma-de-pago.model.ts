import { IFacturacion } from 'app/entities/facturacion/facturacion.model';

export interface IFormaDePago {
  id?: number;
  formaPago?: string;
  facturacions?: IFacturacion[] | null;
}

export class FormaDePago implements IFormaDePago {
  constructor(public id?: number, public formaPago?: string, public facturacions?: IFacturacion[] | null) {}
}

export function getFormaDePagoIdentifier(formaDePago: IFormaDePago): number | undefined {
  return formaDePago.id;
}
