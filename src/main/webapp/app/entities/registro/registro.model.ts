import dayjs from 'dayjs/esm';
import { IEmpleado } from 'app/entities/empleado/empleado.model';
import { IVehiculo } from 'app/entities/vehiculo/vehiculo.model';

export interface IRegistro {
  id?: number;
  horaIngreso?: dayjs.Dayjs;
  horaSalida?: dayjs.Dayjs;
  empleados?: IEmpleado[] | null;
  vehiculo?: IVehiculo;
}

export class Registro implements IRegistro {
  constructor(
    public id?: number,
    public horaIngreso?: dayjs.Dayjs,
    public horaSalida?: dayjs.Dayjs,
    public empleados?: IEmpleado[] | null,
    public vehiculo?: IVehiculo
  ) {}
}

export function getRegistroIdentifier(registro: IRegistro): number | undefined {
  return registro.id;
}
