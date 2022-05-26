import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITarifaPlana, getTarifaPlanaIdentifier } from '../tarifa-plana.model';

export type EntityResponseType = HttpResponse<ITarifaPlana>;
export type EntityArrayResponseType = HttpResponse<ITarifaPlana[]>;

@Injectable({ providedIn: 'root' })
export class TarifaPlanaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tarifa-planas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tarifaPlana: ITarifaPlana): Observable<EntityResponseType> {
    return this.http.post<ITarifaPlana>(this.resourceUrl, tarifaPlana, { observe: 'response' });
  }

  update(tarifaPlana: ITarifaPlana): Observable<EntityResponseType> {
    return this.http.put<ITarifaPlana>(`${this.resourceUrl}/${getTarifaPlanaIdentifier(tarifaPlana) as number}`, tarifaPlana, {
      observe: 'response',
    });
  }

  partialUpdate(tarifaPlana: ITarifaPlana): Observable<EntityResponseType> {
    return this.http.patch<ITarifaPlana>(`${this.resourceUrl}/${getTarifaPlanaIdentifier(tarifaPlana) as number}`, tarifaPlana, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITarifaPlana>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITarifaPlana[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTarifaPlanaToCollectionIfMissing(
    tarifaPlanaCollection: ITarifaPlana[],
    ...tarifaPlanasToCheck: (ITarifaPlana | null | undefined)[]
  ): ITarifaPlana[] {
    const tarifaPlanas: ITarifaPlana[] = tarifaPlanasToCheck.filter(isPresent);
    if (tarifaPlanas.length > 0) {
      const tarifaPlanaCollectionIdentifiers = tarifaPlanaCollection.map(tarifaPlanaItem => getTarifaPlanaIdentifier(tarifaPlanaItem)!);
      const tarifaPlanasToAdd = tarifaPlanas.filter(tarifaPlanaItem => {
        const tarifaPlanaIdentifier = getTarifaPlanaIdentifier(tarifaPlanaItem);
        if (tarifaPlanaIdentifier == null || tarifaPlanaCollectionIdentifiers.includes(tarifaPlanaIdentifier)) {
          return false;
        }
        tarifaPlanaCollectionIdentifiers.push(tarifaPlanaIdentifier);
        return true;
      });
      return [...tarifaPlanasToAdd, ...tarifaPlanaCollection];
    }
    return tarifaPlanaCollection;
  }
}
