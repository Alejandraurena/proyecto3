import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVehiculo, getVehiculoIdentifier } from '../vehiculo.model';

export type EntityResponseType = HttpResponse<IVehiculo>;
export type EntityArrayResponseType = HttpResponse<IVehiculo[]>;

@Injectable({ providedIn: 'root' })
export class VehiculoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vehiculos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vehiculo: IVehiculo): Observable<EntityResponseType> {
    return this.http.post<IVehiculo>(this.resourceUrl, vehiculo, { observe: 'response' });
  }

  update(vehiculo: IVehiculo): Observable<EntityResponseType> {
    return this.http.put<IVehiculo>(`${this.resourceUrl}/${getVehiculoIdentifier(vehiculo) as number}`, vehiculo, { observe: 'response' });
  }

  partialUpdate(vehiculo: IVehiculo): Observable<EntityResponseType> {
    return this.http.patch<IVehiculo>(`${this.resourceUrl}/${getVehiculoIdentifier(vehiculo) as number}`, vehiculo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVehiculo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVehiculo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVehiculoToCollectionIfMissing(vehiculoCollection: IVehiculo[], ...vehiculosToCheck: (IVehiculo | null | undefined)[]): IVehiculo[] {
    const vehiculos: IVehiculo[] = vehiculosToCheck.filter(isPresent);
    if (vehiculos.length > 0) {
      const vehiculoCollectionIdentifiers = vehiculoCollection.map(vehiculoItem => getVehiculoIdentifier(vehiculoItem)!);
      const vehiculosToAdd = vehiculos.filter(vehiculoItem => {
        const vehiculoIdentifier = getVehiculoIdentifier(vehiculoItem);
        if (vehiculoIdentifier == null || vehiculoCollectionIdentifiers.includes(vehiculoIdentifier)) {
          return false;
        }
        vehiculoCollectionIdentifiers.push(vehiculoIdentifier);
        return true;
      });
      return [...vehiculosToAdd, ...vehiculoCollection];
    }
    return vehiculoCollection;
  }
}
