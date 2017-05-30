import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RxPubSub } from "rx-pubsub";
import { TrustHtmlPipe } from "trust-html-pipe";
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import { ModalWindowService } from "./services/modal-window.service";


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalWindowComponent,
    TrustHtmlPipe
  ],
  providers: [RxPubSub, ModalWindowService],
  exports: [ModalWindowComponent]
})
export class ModalModule {
}
