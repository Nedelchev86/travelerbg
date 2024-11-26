import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isActivatedGuard } from './is-activated.guard';

describe('isActivatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isActivatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
