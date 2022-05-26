import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFacturacion, Facturacion } from '../facturacion.model';
import { FacturacionService } from '../service/facturacion.service';

@Injectable({ providedIn: 'root' })
export class FacturacionRoutingResolveService implements Resolve<IFacturacion> {
  constructor(protected service: FacturacionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFacturacion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((facturacion: HttpResponse<Facturacion>) => {
          if (facturacion.body) {
            return of(facturacion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Facturacion());
  }
}
