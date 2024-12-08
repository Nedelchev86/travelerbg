import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isTravelerGuard } from './is-traveler.guard';

describe('isTravelerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isTravelerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
