import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormaDePagoComponent } from './list/forma-de-pago.component';
import { FormaDePagoDetailComponent } from './detail/forma-de-pago-detail.component';
import { FormaDePagoUpdateComponent } from './update/forma-de-pago-update.component';
import { FormaDePagoDeleteDialogComponent } from './delete/forma-de-pago-delete-dialog.component';
import { FormaDePagoRoutingModule } from './route/forma-de-pago-routing.module';

@NgModule({
  imports: [SharedModule, FormaDePagoRoutingModule],
  declarations: [FormaDePagoComponent, FormaDePagoDetailComponent, FormaDePagoUpdateComponent, FormaDePagoDeleteDialogComponent],
  entryComponents: [FormaDePagoDeleteDialogComponent],
})
export class FormaDePagoModule {}
