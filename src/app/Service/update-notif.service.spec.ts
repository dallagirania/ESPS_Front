import { TestBed } from '@angular/core/testing';

import { UpdateNotifService } from './update-notif.service';

describe('UpdateNotifService', () => {
  let service: UpdateNotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateNotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
