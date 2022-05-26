import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITipoVehiculo, getTipoVehiculoIdentifier } from '../tipo-vehiculo.model';

export type EntityResponseType = HttpResponse<ITipoVehiculo>;
export type EntityArrayResponseType = HttpResponse<ITipoVehiculo[]>;

@Injectable({ providedIn: 'root' })
export class TipoVehiculoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tipo-vehiculos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tipoVehiculo: ITipoVehiculo): Observable<EntityResponseType> {
    return this.http.post<ITipoVehiculo>(this.resourceUrl, tipoVehiculo, { observe: 'response' });
  }

  update(tipoVehiculo: ITipoVehiculo): Observable<EntityResponseType> {
    return this.http.put<ITipoVehiculo>(`${this.resourceUrl}/${getTipoVehiculoIdentifier(tipoVehiculo) as number}`, tipoVehiculo, {
      observe: 'response',
    });
  }

  partialUpdate(tipoVehiculo: ITipoVehiculo): Observable<EntityResponseType> {
    return this.http.patch<ITipoVehiculo>(`${this.resourceUrl}/${getTipoVehiculoIdentifier(tipoVehiculo) as number}`, tipoVehiculo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITipoVehiculo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITipoVehiculo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTipoVehiculoToCollectionIfMissing(
    tipoVehiculoCollection: ITipoVehiculo[],
    ...tipoVehiculosToCheck: (ITipoVehiculo | null | undefined)[]
  ): ITipoVehiculo[] {
    const tipoVehiculos: ITipoVehiculo[] = tipoVehiculosToCheck.filter(isPresent);
    if (tipoVehiculos.length > 0) {
      const tipoVehiculoCollectionIdentifiers = tipoVehiculoCollection.map(
        tipoVehiculoItem => getTipoVehiculoIdentifier(tipoVehiculoItem)!
      );
      const tipoVehiculosToAdd = tipoVehiculos.filter(tipoVehiculoItem => {
        const tipoVehiculoIdentifier = getTipoVehiculoIdentifier(tipoVehiculoItem);
        if (tipoVehiculoIdentifier == null || tipoVehiculoCollectionIdentifiers.includes(tipoVehiculoIdentifier)) {
          return false;
        }
        tipoVehiculoCollectionIdentifiers.push(tipoVehiculoIdentifier);
        return true;
      });
      return [...tipoVehiculosToAdd, ...tipoVehiculoCollection];
    }
    return tipoVehiculoCollection;
  }
}
