import { Injectable } from '@angular/core';
import { RxPubSub } from "rx-pubsub";

@Injectable()
export class Ng2ModalWindowService {

  constructor(protected pubsub: RxPubSub) {
  }

  showModal(modalId: string, options: any = {}): void {
    options.show = true;
    options.hide = null;
    this.pubsub.publish(modalId, options);
  }

  hideModal(modalId: string): void {
    let options: any = {hide: true};
    this.pubsub.publish(modalId, options);
  }

  resetEventsSubscribers(eventsList: any[]): void {
    eventsList.forEach((eventName: string) => {
      if (eventName && this.pubsub.hasSubscribers(eventName)) {
        this.pubsub.dispose(eventName);
      }
    });
  }
}
