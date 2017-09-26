import { PubSubDistinct } from 'pubsub-distinct';

export class Ng2ModalWindow {

  static showModal(modalId: string, options: any = {}): void {
    options.show = true;
    options.hide = null;
    PubSubDistinct.publishDistinct(modalId, options);
  }

  static hideModal(modalId: string): void {
    let options: any = {hide: true};
    PubSubDistinct.publishDistinct(modalId, options);
  }

  static resetEventsSubscribers(eventsList: any[]): void {
    eventsList.forEach((eventName: string) => {
      if (eventName && PubSubDistinct.hasSubscribers(eventName)) {
        PubSubDistinct.dispose(eventName);
      }
    });
  }

  static subscribe(eventName: string, callback: (data?: any) => any): void {
    PubSubDistinct.subscribe(eventName, callback);
  }
}
