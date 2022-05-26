import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FacturacionComponent } from '../list/facturacion.component';
import { FacturacionDetailComponent } from '../detail/facturacion-detail.component';
import { FacturacionUpdateComponent } from '../update/facturacion-update.component';
import { FacturacionRoutingResolveService } from './facturacion-routing-resolve.service';

const facturacionRoute: Routes = [
  {
    path: '',
    component: FacturacionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FacturacionDetailComponent,
    resolve: {
      facturacion: FacturacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FacturacionUpdateComponent,
    resolve: {
      facturacion: FacturacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FacturacionUpdateComponent,
    resolve: {
      facturacion: FacturacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(facturacionRoute)],
  exports: [RouterModule],
})
export class FacturacionRoutingModule {}
