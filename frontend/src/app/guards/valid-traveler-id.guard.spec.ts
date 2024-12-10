import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validTravelerIdGuard } from './valid-traveler-id.guard';

describe('validTravelerIdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validTravelerIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
