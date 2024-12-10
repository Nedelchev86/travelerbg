import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validDestinationIdGuard } from './valid-destination-id.guard';

describe('validDestinationIdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validDestinationIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
