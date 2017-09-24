import { Injectable } from '@angular/core';
import { PubSubDistinct } from 'pubsub-distinct';

@Injectable()
export class Ng2ModalWindowService {

  constructor(protected pubsub: PubSubDistinct) {
  }

  showModal(modalId: string, options: any = {}): void {
    options.show = true;
    options.hide = null;
    PubSubDistinct.publish(modalId, options);
  }

  hideModal(modalId: string): void {
    let options: any = {hide: true};
    PubSubDistinct.publish(modalId, options);
  }

  resetEventsSubscribers(eventsList: any[]): void {
    eventsList.forEach((eventName: string) => {
      if (eventName && PubSubDistinct.hasSubscribers(eventName)) {
        PubSubDistinct.dispose(eventName);
      }
    });
  }
}
