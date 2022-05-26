import { IEmpleado } from 'app/entities/empleado/empleado.model';

export interface IVisitante {
  id?: number;
  nombrevisitante?: string;
  apellido?: string | null;
  phone?: string;
  empleados?: IEmpleado[] | null;
}

export class Visitante implements IVisitante {
  constructor(
    public id?: number,
    public nombrevisitante?: string,
    public apellido?: string | null,
    public phone?: string,
    public empleados?: IEmpleado[] | null
  ) {}
}

export function getVisitanteIdentifier(visitante: IVisitante): number | undefined {
  return visitante.id;
}
