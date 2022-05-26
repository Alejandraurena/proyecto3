import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormaDePagoComponent } from '../list/forma-de-pago.component';
import { FormaDePagoDetailComponent } from '../detail/forma-de-pago-detail.component';
import { FormaDePagoUpdateComponent } from '../update/forma-de-pago-update.component';
import { FormaDePagoRoutingResolveService } from './forma-de-pago-routing-resolve.service';

const formaDePagoRoute: Routes = [
  {
    path: '',
    component: FormaDePagoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormaDePagoDetailComponent,
    resolve: {
      formaDePago: FormaDePagoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormaDePagoUpdateComponent,
    resolve: {
      formaDePago: FormaDePagoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormaDePagoUpdateComponent,
    resolve: {
      formaDePago: FormaDePagoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formaDePagoRoute)],
  exports: [RouterModule],
})
export class FormaDePagoRoutingModule {}
