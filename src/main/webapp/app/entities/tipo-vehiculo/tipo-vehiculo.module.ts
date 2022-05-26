import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TipoVehiculoComponent } from './list/tipo-vehiculo.component';
import { TipoVehiculoDetailComponent } from './detail/tipo-vehiculo-detail.component';
import { TipoVehiculoUpdateComponent } from './update/tipo-vehiculo-update.component';
import { TipoVehiculoDeleteDialogComponent } from './delete/tipo-vehiculo-delete-dialog.component';
import { TipoVehiculoRoutingModule } from './route/tipo-vehiculo-routing.module';

@NgModule({
  imports: [SharedModule, TipoVehiculoRoutingModule],
  declarations: [TipoVehiculoComponent, TipoVehiculoDetailComponent, TipoVehiculoUpdateComponent, TipoVehiculoDeleteDialogComponent],
  entryComponents: [TipoVehiculoDeleteDialogComponent],
})
export class TipoVehiculoModule {}
