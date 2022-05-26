import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVisitante, getVisitanteIdentifier } from '../visitante.model';

export type EntityResponseType = HttpResponse<IVisitante>;
export type EntityArrayResponseType = HttpResponse<IVisitante[]>;

@Injectable({ providedIn: 'root' })
export class VisitanteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/visitantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(visitante: IVisitante): Observable<EntityResponseType> {
    return this.http.post<IVisitante>(this.resourceUrl, visitante, { observe: 'response' });
  }

  update(visitante: IVisitante): Observable<EntityResponseType> {
    return this.http.put<IVisitante>(`${this.resourceUrl}/${getVisitanteIdentifier(visitante) as number}`, visitante, {
      observe: 'response',
    });
  }

  partialUpdate(visitante: IVisitante): Observable<EntityResponseType> {
    return this.http.patch<IVisitante>(`${this.resourceUrl}/${getVisitanteIdentifier(visitante) as number}`, visitante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVisitante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVisitante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVisitanteToCollectionIfMissing(
    visitanteCollection: IVisitante[],
    ...visitantesToCheck: (IVisitante | null | undefined)[]
  ): IVisitante[] {
    const visitantes: IVisitante[] = visitantesToCheck.filter(isPresent);
    if (visitantes.length > 0) {
      const visitanteCollectionIdentifiers = visitanteCollection.map(visitanteItem => getVisitanteIdentifier(visitanteItem)!);
      const visitantesToAdd = visitantes.filter(visitanteItem => {
        const visitanteIdentifier = getVisitanteIdentifier(visitanteItem);
        if (visitanteIdentifier == null || visitanteCollectionIdentifiers.includes(visitanteIdentifier)) {
          return false;
        }
        visitanteCollectionIdentifiers.push(visitanteIdentifier);
        return true;
      });
      return [...visitantesToAdd, ...visitanteCollection];
    }
    return visitanteCollection;
  }
}
