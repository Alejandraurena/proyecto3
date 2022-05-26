import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TarifaPlanaComponent } from './list/tarifa-plana.component';
import { TarifaPlanaDetailComponent } from './detail/tarifa-plana-detail.component';
import { TarifaPlanaUpdateComponent } from './update/tarifa-plana-update.component';
import { TarifaPlanaDeleteDialogComponent } from './delete/tarifa-plana-delete-dialog.component';
import { TarifaPlanaRoutingModule } from './route/tarifa-plana-routing.module';

@NgModule({
  imports: [SharedModule, TarifaPlanaRoutingModule],
  declarations: [TarifaPlanaComponent, TarifaPlanaDetailComponent, TarifaPlanaUpdateComponent, TarifaPlanaDeleteDialogComponent],
  entryComponents: [TarifaPlanaDeleteDialogComponent],
})
export class TarifaPlanaModule {}
