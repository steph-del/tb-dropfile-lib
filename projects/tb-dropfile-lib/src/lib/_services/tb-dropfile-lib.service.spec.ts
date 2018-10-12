import { TestBed, inject } from '@angular/core/testing';

import { TbDropfileLibService } from './tb-dropfile-lib.service';

describe('TbDropfileLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TbDropfileLibService]
    });
  });

  it('should be created', inject([TbDropfileLibService], (service: TbDropfileLibService) => {
    expect(service).toBeTruthy();
  }));
});
