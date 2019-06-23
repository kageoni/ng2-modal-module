import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from 'pipes-module';
import { Ng2ModalWindowComponent } from './ng2-modal-window/ng2-modal-window.component';

@NgModule({
  declarations: [Ng2ModalWindowComponent],
  imports: [
    CommonModule,
    PipesModule
  ],
  exports: [Ng2ModalWindowComponent]
})
export class ModalModule { }
