import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2ModalWindowComponent } from './ng2-modal-window.component';

describe('Ng2ModalWindowComponent', () => {
  let component: Ng2ModalWindowComponent;
  let fixture: ComponentFixture<Ng2ModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Ng2ModalWindowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2ModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
