import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFacturacion, getFacturacionIdentifier } from '../facturacion.model';

export type EntityResponseType = HttpResponse<IFacturacion>;
export type EntityArrayResponseType = HttpResponse<IFacturacion[]>;

@Injectable({ providedIn: 'root' })
export class FacturacionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/facturacions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(facturacion: IFacturacion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facturacion);
    return this.http
      .post<IFacturacion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(facturacion: IFacturacion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facturacion);
    return this.http
      .put<IFacturacion>(`${this.resourceUrl}/${getFacturacionIdentifier(facturacion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(facturacion: IFacturacion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facturacion);
    return this.http
      .patch<IFacturacion>(`${this.resourceUrl}/${getFacturacionIdentifier(facturacion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFacturacion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFacturacion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFacturacionToCollectionIfMissing(
    facturacionCollection: IFacturacion[],
    ...facturacionsToCheck: (IFacturacion | null | undefined)[]
  ): IFacturacion[] {
    const facturacions: IFacturacion[] = facturacionsToCheck.filter(isPresent);
    if (facturacions.length > 0) {
      const facturacionCollectionIdentifiers = facturacionCollection.map(facturacionItem => getFacturacionIdentifier(facturacionItem)!);
      const facturacionsToAdd = facturacions.filter(facturacionItem => {
        const facturacionIdentifier = getFacturacionIdentifier(facturacionItem);
        if (facturacionIdentifier == null || facturacionCollectionIdentifiers.includes(facturacionIdentifier)) {
          return false;
        }
        facturacionCollectionIdentifiers.push(facturacionIdentifier);
        return true;
      });
      return [...facturacionsToAdd, ...facturacionCollection];
    }
    return facturacionCollection;
  }

  protected convertDateFromClient(facturacion: IFacturacion): IFacturacion {
    return Object.assign({}, facturacion, {
      fechaFactura: facturacion.fechaFactura?.isValid() ? facturacion.fechaFactura.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaFactura = res.body.fechaFactura ? dayjs(res.body.fechaFactura) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((facturacion: IFacturacion) => {
        facturacion.fechaFactura = facturacion.fechaFactura ? dayjs(facturacion.fechaFactura) : undefined;
      });
    }
    return res;
  }
}
