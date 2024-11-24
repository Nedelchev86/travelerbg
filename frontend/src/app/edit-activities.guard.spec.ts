import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { editActivitiesGuard } from './edit-activities.guard';

describe('editActivitiesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => editActivitiesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
