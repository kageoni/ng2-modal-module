import { Component, OnInit } from '@angular/core';
import { Ng2ModalWindow } from '../../projects/ng2-modal/src/lib/ng2-modal-window';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ridder';
  modalId: string = 'modalId';

  ngOnInit() {
    Ng2ModalWindow.showModal(this.modalId, {
      title: 'Modal title',
      htmlContent: 'Modal content'
    });
  }
}
