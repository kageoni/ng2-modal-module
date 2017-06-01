import { TestBed, inject } from '@angular/core/testing';

import { Ng2ModalWindowService } from './ng2-modal-window.service';

describe('Ng2ModalWindowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Ng2ModalWindowService]
    });
  });

  it('should ...', inject([Ng2ModalWindowService], (service: Ng2ModalWindowService) => {
    expect(service).toBeTruthy();
  }));
});
