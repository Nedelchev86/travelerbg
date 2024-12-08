import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { addHotelGuard } from './add-hotel.guard';

describe('addHotelGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => addHotelGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
