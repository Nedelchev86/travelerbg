import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesLayoutComponent } from './activities-layout.component';

describe('ActivitiesLayoutComponent', () => {
  let component: ActivitiesLayoutComponent;
  let fixture: ComponentFixture<ActivitiesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
