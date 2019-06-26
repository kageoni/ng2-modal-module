import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrustHtmlModule } from 'trust-html';
import { Ng2ModalWindowComponent } from './ng2-modal-window/ng2-modal-window.component';

@NgModule({
  declarations: [Ng2ModalWindowComponent],
  imports: [
    CommonModule,
    TrustHtmlModule
  ],
  exports: [Ng2ModalWindowComponent]
})
export class ModalModule { }
