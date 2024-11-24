import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { editDestinationGuard } from './edit-destination.guard';

describe('editDestinationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => editDestinationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
