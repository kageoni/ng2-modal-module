ng2-modal-module
=====
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Ng2ModalWindowService Methods](#methods)
5. [ModalWindow Options](#options)
6. [Examples](#examples)
7. [Git repository](#git)
8. [Version](#version)

### <a name="description"></a>1. Description
`ng2-modal-module` or `ModalModule` is a module for angular2 which exposes the bootstrap modal component (no jQuery required!!!) 
with the service `ModalWindowService` which makes the component usage easier.  
It is based on [rx-pubsub](https://www.npmjs.com/package/rx-pubsub).  
  
### <a name="installation"></a>2. Installation
Install the module into your application and save it as a dev 
dependency in your `package.json` file  
```
npm install ng2-modal-module --save-dev
```
  
**WARNIGNG** Don't forget to include the bootstrap styles!

### <a name="usage"></a>3. Usage
In order to use the `RxPubSub` service you have to include/import 
it into your application:
```
import {ModalModule} from 'ng2-modal-module';
```
  
Add the module into the app's module `imports` section:
```typescript
import { ModalModule } from 'ng2-modal-module';

@NgModule({
  //...
  imports: [
	//...
	ModalModule // <<--- HERE
  ],
  //...
})
```
  
Include the `modal` component into your template:
```angular2html
<ng2-modal-window id="{{modalId}}"></ng2-modal-window>
```
where `modalId` is a unique ID of the modal component.

Call the modal component (display or hide it) using the `Ng2ModalWindowService`:
```typescript
import { Ng2ModalWindowService } from 'ng2-modal-module'

export class AppComponent {  
  modalId: string = 'modalId';  
  
  constructor(private modal: Ng2ModalWindowService) {  
  }  
  
  displayModal() {  
    this.modal.showModal(this.modalId, {  
      title: 'Modal title',  
      htmlContent: 'Modal content'  
    });  
  }  
}
```
  
  
### <a name="methods"></a>4. Ng2ModalWindowService Methods

#### showModal(modalId: string, options: any = {}): void
Display the `Ng2ModalWindowComponent`  
  
*Parameters:*  
**modalId** - Id of the modal window which should be displayed  
**options** - Options used to customize the displayed modal window
The options list is described here.  
  
*Return:*  
Method returns nothing - `void`.  
  
  
#### hideModal(modalId: string): void
Hide the `Ng2ModalWindowComponent`  
  
*Parameters:*  
**modalId** - Id of the modal window which should be hidden  
  
*Return:*  
Method returns nothing - `void`.  
  
  
#### resetEventsSubscribers(eventsList: any[]): void
Reset (remove) the events subscribers of the `Ng2ModalWindowComponent` 
actions buttons if such events are provided using the `options` parameter.  
  
*Parameters:*  
**eventsList** - List of events name which should be removed/unsubscribed  
  
*Return:*  
Method returns nothing - `void`.  
    
  
### <a name="options"></a>5. ModalWindow Options
|          Option         |   Type  | Default  |                                                                             Description                                                                             |                                Example                               |
|:------------------------|:--------|:---------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------|
| componentInputs         | Object  | NULL     | Properties list of the dynamically injected component into the modal's body                                                                                         | {title: 'new value of the title property of the injected component'} |
| componentSelector       | String  | NULL     | Selector of the component which should be injected  dynamically into the modal's body                                                                               | {componentSelector: 'test-component'}                                |
| customClass             | String  | NULL     | Custom class which will be attached to the modal window. Here can be passed the bootstraps classes which handle the size of the modal (`modal-lg`, `modal-sm` etc.) | {customClass: 'modal-lg'}                                            |
| hide                    | Boolean | NULL     | Forcibly hide the modal window when its value is `true`                                                                                                             | {hide: true}                                                         |
| htmlContent             | String  | Empty    | The HTML content which should be injected in the modal's body as innerHTML content (HTML tags are not escaped!)                                                     | {htmlContent: '&lt;strong&gt;test content&lt;/strong&gt;'}                       |
| overlayClick            | Boolean | true     | Enable/disable the click over the modal's overlay. If it's `true` then the click over the overlay hides/closes the modal window.                                    | {overlayClick: false} // disable the overlay click                   |
| show                    | Boolean | NULL     | Forcibly shows/display the modal window if its value is `true`                                                                                                      | {show: true}                                                         |
| title                   | String  | Empty    | Title of the modal window                                                                                                                                           | {title: 'Modal window title'}                                        |
| buttons.visible         | Boolean | true     | Display or hide the footer section with the action buttons (cancel/success). `true` -  buttons are visible `false` - buttons are hidden                             | {buttons: {visible: false}} // hide buttons                          |
| buttons.cancel.visible  | Boolean | true     | Display or hide the `cancel` button `true` - button is visible `false` - button is hidden                                                                           | {buttons:  {cancel: {visible: false}}} // hide cancel button         |
| buttons.cancel.label    | String  | 'Cancel' | Label of the `cancel` button                                                                                                                                        | {buttons: {cancel: {label: 'Close'}}}                                |
| buttons.cancel.event    | String  | NULL     | Name of the event which will be triggered (using rx-pubsub) when the `cancel` button is clicked                                                                     | {buttons: {cancel: {event: 'cancel-event'}}}                         |
| buttons.success.visible | Boolean | true     | Display or hide the `success` button `true` - button is visible `false` - button is hidden                                                                          | {buttons: {success: {visible: false}}} // hide success button        |
| buttons.success.label   | String  | 'Save'   | Label of the `success` button                                                                                                                                       | {buttons: {success: {label: 'Save changes'}}}                        |
| buttons.success.event   | String  | NULL     | Name of the event which will be triggered (using rx-pubsub) when the `success` button is clicked                                                                    | {buttons: {cancel: {event: 'success-event'}}}                        |
  
  
### <a name="examples"></a>6. Examples
Before using the `Ng2ModalWindowComponent` don't forget to inject the `Ng2ModalWindowService` as a dependency into the component/service constructor:
```typescript
import { Ng2ModalWindowService } from 'ng2-modal-module'
//...
modalId: string = 'test-modal-window';  
constructor(private pubsub: RxPubSub, private modal: Ng2ModalWindowService) {}
```
  
`RxPubSub` service will be required when you'll try to listen the click events of the `cancel` and `success` buttons.  
  
1. display simple modal window:
```typescript
this.modal.showModal(this.modalId, {
  title: 'Modal title',
  htmlContent: 'Modal content'
});
```

2. display modal with the disabled overlay, HTML content and custom class (large modal window)
```typescript
this.modal.showModal(this.modalId, {
  title: 'Modal title',
  htmlContent: '<b>test bold</b> and simple text',
  customClass: 'modal-lg',
  overlayClick: false
});
```
  
3. display modal window without footer (action buttons are hidden).
```typescript
this.modal.showModal(this.modalId, {
  title: 'Modal title',
  htmlContent: 'modal content',
  buttons: {
    visible: false
  }
});
```
  
4. display modal without the success button:
```typescript
this.modal.showModal(this.modalId, {
  title: 'Modal title',
  htmlContent: 'modal content',
  buttons: {
    success: {visible: false}
  }
});
```
  
5. inject a custom component into the modal's body/content
```typescript
this.modal.showModal(this.modalId, {
  title: 'Modal title',
  componentSelector: 'app-test'
});
```
where `app-test` is the selector of the component.  
**WARNING!** To make it dynamically injectable, the component `app-test`
should be included in the `entryComponents: []` list of the `@NgModule(...)`;
  
6. inject a custom component into the modal's body/content and pass some custom properties to it
```typescript
this.modal.showModal(this.modalId, {
  title: 'Modal title',
  componentSelector: 'app-test',
  componentInputs: {componentTitle: 'CUSTOM TITLE'}
});
```
where `componentTitle` is a public property of the component `app-test`.
  
7. register custom events for the actions buttons of the modal window and subscribe to them
```typescript
// events names  
let successEventName = 'successEvent';  
let cancelEventName = 'cancelEvent';  
  
// remove previously added subscriber and publisher  
this.modal.resetEventsSubscribers([successEventName, cancelEventName]);  
  
// pass the events name to the modal window component  
this.modal.showModal(this.modalId, {  
  title: 'Modal title',  
  htmlContent: 'listen actions events',  
  buttons: {  
    cancel: { event: cancelEventName },  
    success: { event: successEventName }  
  }  
});  
  
// subscribe to events 
this.pubsub.subscribe(successEventName, (data) => {  
  console.log('successEventName triggered!', data);  
  // hide modal  
  this.modal.hideModal(this.modalId);  
});  
this.pubsub.subscribe(cancelEventName, (data) => {  
  console.log('cancelEventName triggered!', data);  
});
```
Before registering new events listeners, is suggested to remove them if they are already subscribed 
to the same events:
 ```typescript
this.modal.resetEventsSubscribers([successEventName, cancelEventName]);
```
  
8. hide already visible modal window
```typescript
this.modal.hideModal(this.modalId); 
```
  
  
### <a name="git"></a>7. Git repository
[https://github.com/kageoni/ng2-modal-module](https://github.com/kageoni/ng2-modal-module)
  
  
### <a name="version"></a>8. Version
0.1.11
