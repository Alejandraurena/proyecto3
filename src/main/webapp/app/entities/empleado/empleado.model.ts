import { IUser } from 'app/entities/user/user.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { IVisitante } from 'app/entities/visitante/visitante.model';
import { IRegistro } from 'app/entities/registro/registro.model';

export interface IEmpleado {
  id?: number;
  nombreEmpleado?: string;
  apellidoEmpleado?: string | null;
  cargoEmpleado?: string;
  phone?: string;
  user?: IUser;
  cliente?: ICliente;
  visitante?: IVisitante;
  registro?: IRegistro;
}

export class Empleado implements IEmpleado {
  constructor(
    public id?: number,
    public nombreEmpleado?: string,
    public apellidoEmpleado?: string | null,
    public cargoEmpleado?: string,
    public phone?: string,
    public user?: IUser,
    public cliente?: ICliente,
    public visitante?: IVisitante,
    public registro?: IRegistro
  ) {}
}

export function getEmpleadoIdentifier(empleado: IEmpleado): number | undefined {
  return empleado.id;
}
