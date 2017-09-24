import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PipesModule } from 'pipes-module';
import { ComponentInjector } from 'component-injector';
import { Ng2ModalWindowComponent } from './components/ng2-modal-window/ng2-modal-window.component';
import { Ng2ModalWindowService } from './services/ng2-modal-window.service';

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  declarations: [
    Ng2ModalWindowComponent
  ],
  providers: [Ng2ModalWindowService, ComponentInjector],
  exports: [Ng2ModalWindowComponent]
})
export class ModalModule {
}
