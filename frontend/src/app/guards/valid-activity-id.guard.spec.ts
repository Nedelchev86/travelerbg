import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validActivityIdGuard } from './valid-activity-id.guard';

describe('validActivityIdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validActivityIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
