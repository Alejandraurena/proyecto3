import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormaDePago, getFormaDePagoIdentifier } from '../forma-de-pago.model';

export type EntityResponseType = HttpResponse<IFormaDePago>;
export type EntityArrayResponseType = HttpResponse<IFormaDePago[]>;

@Injectable({ providedIn: 'root' })
export class FormaDePagoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/forma-de-pagos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(formaDePago: IFormaDePago): Observable<EntityResponseType> {
    return this.http.post<IFormaDePago>(this.resourceUrl, formaDePago, { observe: 'response' });
  }

  update(formaDePago: IFormaDePago): Observable<EntityResponseType> {
    return this.http.put<IFormaDePago>(`${this.resourceUrl}/${getFormaDePagoIdentifier(formaDePago) as number}`, formaDePago, {
      observe: 'response',
    });
  }

  partialUpdate(formaDePago: IFormaDePago): Observable<EntityResponseType> {
    return this.http.patch<IFormaDePago>(`${this.resourceUrl}/${getFormaDePagoIdentifier(formaDePago) as number}`, formaDePago, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFormaDePago>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormaDePago[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFormaDePagoToCollectionIfMissing(
    formaDePagoCollection: IFormaDePago[],
    ...formaDePagosToCheck: (IFormaDePago | null | undefined)[]
  ): IFormaDePago[] {
    const formaDePagos: IFormaDePago[] = formaDePagosToCheck.filter(isPresent);
    if (formaDePagos.length > 0) {
      const formaDePagoCollectionIdentifiers = formaDePagoCollection.map(formaDePagoItem => getFormaDePagoIdentifier(formaDePagoItem)!);
      const formaDePagosToAdd = formaDePagos.filter(formaDePagoItem => {
        const formaDePagoIdentifier = getFormaDePagoIdentifier(formaDePagoItem);
        if (formaDePagoIdentifier == null || formaDePagoCollectionIdentifiers.includes(formaDePagoIdentifier)) {
          return false;
        }
        formaDePagoCollectionIdentifiers.push(formaDePagoIdentifier);
        return true;
      });
      return [...formaDePagosToAdd, ...formaDePagoCollection];
    }
    return formaDePagoCollection;
  }
}
