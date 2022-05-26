import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FacturacionComponent } from './list/facturacion.component';
import { FacturacionDetailComponent } from './detail/facturacion-detail.component';
import { FacturacionUpdateComponent } from './update/facturacion-update.component';
import { FacturacionDeleteDialogComponent } from './delete/facturacion-delete-dialog.component';
import { FacturacionRoutingModule } from './route/facturacion-routing.module';

@NgModule({
  imports: [SharedModule, FacturacionRoutingModule],
  declarations: [FacturacionComponent, FacturacionDetailComponent, FacturacionUpdateComponent, FacturacionDeleteDialogComponent],
  entryComponents: [FacturacionDeleteDialogComponent],
})
export class FacturacionModule {}
