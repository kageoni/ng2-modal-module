import {
  Component, ComponentRef, ElementRef, Input, OnDestroy, OnInit, ViewChild,
  ViewContainerRef
} from '@angular/core';
import { RxPubSub } from "rx-pubsub";
import { Subscription } from "rxjs/Subscription";
import { XDomUtil } from "xdom-util";
import { ComponentInjector } from "component-injector";
var extend = require('smart-extend');

@Component({
  selector: 'ng2-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class ModalWindowComponent implements OnInit, OnDestroy {
  @ViewChild('modalWindow') modalWindow: ElementRef;
  @ViewChild('injectContainer', {read: ViewContainerRef}) injectContainer: ViewContainerRef;
  @Input() animationClass: string = 'fade';
  protected showModalClass: string = 'in';
  protected bodyOpenModalClass: string = 'modal-open';
  protected eventSubscriber: Subscription;
  protected injectedComponentRef: ComponentRef<any>;
  protected defaultProperties: any = {
    title: '',
    show: false,
    hide: false,
    componentSelector: false,
    componentInputs: false,
    htmlContent: '',
    overlayClick: true,
    customClass: '',
    buttons: {
      visible: true,
      cancel: {
        visible: true,
        label: 'Cancel',
        event: false
      },
      success: {
        visible: true,
        label: 'Save',
        event: false
      }
    }
  };
  properties: any = {};
  protected eventName: string;

  constructor(protected pubsub: RxPubSub, protected componentInjector: ComponentInjector) {
  }

  @Input() set id(eventName: string) {
    if (eventName) {
      this.eventName = eventName;
      // remove previous subscription and create new one
      this.unsubscribe();
      this.subscribeToEvent();
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe();
    this.resetInjectedComponent();
  }

  cancelAction(): void {
    if (this.properties.buttons.cancel.event) {
      this.pubsub.publish(this.properties.buttons.cancel.event, true);
    }
    this.hide();
  }

  successAction(): void {
    if (this.properties.buttons.success.event) {
      this.pubsub.publish(this.properties.buttons.success.event, true);
    }
    else {
      this.hide();
    }
  }

  overlayClick(): void {
    if (this.properties.overlayClick) {
      this.cancelAction();
    }
  }

  protected show(): void {
    // add class to modal DOM element to make it visible
    let modalDom = this.modalWindow.nativeElement;
    if (!XDomUtil.hasClass(modalDom, this.showModalClass)) {
      XDomUtil.addClass(modalDom, this.showModalClass);
    }

    // add class to modal body to disable the scrolling
    let body = document.querySelector('body');
    if (!XDomUtil.hasClass(body, this.bodyOpenModalClass)) {
      XDomUtil.addClass(body, this.bodyOpenModalClass);
    }
  }

  protected hide(): void {
    let element = this.modalWindow.nativeElement;
    XDomUtil.removeClass(element, this.showModalClass);

    let body = document.querySelector('body');
    XDomUtil.removeClass(body, this.bodyOpenModalClass);
  }


  protected subscribeToEvent(): void {
    this.eventSubscriber = this.pubsub.subscribe(this.eventName, (data: any) => {
      this.initModal(data);
    });
  }

  protected initModal(properties: any): void {
    if (properties.show) {
      // remove previously injected component
      this.resetInjectedComponent();
      // reset the properties
      this.setProperties(properties);
      // inject component
      if (this.properties.componentSelector) {
        this.injectedComponentRef = this.injectComponent(this.properties.componentSelector);
        // set the components properties
        this.setComponentProperties();
      }
      // display the modal
      this.show();
      // reset modal event subscriber
      this.resetModalEventSubscriber();
    }
    else if (properties.hide) {
      // remove previously injected component
      this.resetInjectedComponent();
      // reset the properties
      this.setProperties(properties);
      // hide the modal
      this.hide();
      // reset modal event subscriber
      this.resetModalEventSubscriber();
    }
  }

  protected unsubscribe(): void {
    if (this.eventSubscriber) {
      this.pubsub.unsubscribe(this.eventSubscriber);
    }
  }

  protected injectComponent(componentSelector: string): ComponentRef<any> {
    let result: ComponentRef<any>;
    if (componentSelector) {
      result = this.componentInjector.inject(this.injectContainer, componentSelector);
    }

    return result;
  }

  protected setComponentProperties(): void {
    if (this.properties.componentInputs && this.injectedComponentRef) {
      this.componentInjector.setProperties(this.injectedComponentRef, this.properties.componentInputs);
    }
  }

  private resetInjectedComponent(): void {
    if (this.injectedComponentRef) {
      this.componentInjector.remove(this.injectedComponentRef);
      this.injectedComponentRef = null;
    }
  }

  private setProperties(properties: any): void {
    this.properties = extend.deep({}, this.defaultProperties, properties);
  }

  private resetModalEventSubscriber(): void {
    // reset modal show/hide display
    this.pubsub.publish(this.eventName, {});
  }

}
