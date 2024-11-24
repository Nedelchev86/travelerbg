import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitieDetailsComponent } from './activitie-details.component';

describe('ActivitieDetailsComponent', () => {
  let component: ActivitieDetailsComponent;
  let fixture: ComponentFixture<ActivitieDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitieDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
