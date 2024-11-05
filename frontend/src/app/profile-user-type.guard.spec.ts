import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { profileUserTypeGuard } from './profile-user-type.guard';

describe('profileUserTypeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => profileUserTypeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
