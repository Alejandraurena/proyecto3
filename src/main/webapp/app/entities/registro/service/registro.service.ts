import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRegistro, getRegistroIdentifier } from '../registro.model';

export type EntityResponseType = HttpResponse<IRegistro>;
export type EntityArrayResponseType = HttpResponse<IRegistro[]>;

@Injectable({ providedIn: 'root' })
export class RegistroService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/registros');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(registro: IRegistro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registro);
    return this.http
      .post<IRegistro>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(registro: IRegistro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registro);
    return this.http
      .put<IRegistro>(`${this.resourceUrl}/${getRegistroIdentifier(registro) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(registro: IRegistro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registro);
    return this.http
      .patch<IRegistro>(`${this.resourceUrl}/${getRegistroIdentifier(registro) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRegistro>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRegistro[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRegistroToCollectionIfMissing(registroCollection: IRegistro[], ...registrosToCheck: (IRegistro | null | undefined)[]): IRegistro[] {
    const registros: IRegistro[] = registrosToCheck.filter(isPresent);
    if (registros.length > 0) {
      const registroCollectionIdentifiers = registroCollection.map(registroItem => getRegistroIdentifier(registroItem)!);
      const registrosToAdd = registros.filter(registroItem => {
        const registroIdentifier = getRegistroIdentifier(registroItem);
        if (registroIdentifier == null || registroCollectionIdentifiers.includes(registroIdentifier)) {
          return false;
        }
        registroCollectionIdentifiers.push(registroIdentifier);
        return true;
      });
      return [...registrosToAdd, ...registroCollection];
    }
    return registroCollection;
  }

  protected convertDateFromClient(registro: IRegistro): IRegistro {
    return Object.assign({}, registro, {
      horaIngreso: registro.horaIngreso?.isValid() ? registro.horaIngreso.toJSON() : undefined,
      horaSalida: registro.horaSalida?.isValid() ? registro.horaSalida.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.horaIngreso = res.body.horaIngreso ? dayjs(res.body.horaIngreso) : undefined;
      res.body.horaSalida = res.body.horaSalida ? dayjs(res.body.horaSalida) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((registro: IRegistro) => {
        registro.horaIngreso = registro.horaIngreso ? dayjs(registro.horaIngreso) : undefined;
        registro.horaSalida = registro.horaSalida ? dayjs(registro.horaSalida) : undefined;
      });
    }
    return res;
  }
}
