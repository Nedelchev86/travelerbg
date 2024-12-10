import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validHotelIdGuard } from './valid-hotel-id.guard';

describe('validHotelIdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validHotelIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
