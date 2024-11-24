import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { editHotelGuard } from './edit-hotel.guard';

describe('editHotelGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => editHotelGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
