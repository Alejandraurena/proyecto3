import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRegistro, Registro } from '../registro.model';
import { RegistroService } from '../service/registro.service';

@Injectable({ providedIn: 'root' })
export class RegistroRoutingResolveService implements Resolve<IRegistro> {
  constructor(protected service: RegistroService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRegistro> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((registro: HttpResponse<Registro>) => {
          if (registro.body) {
            return of(registro.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Registro());
  }
}
