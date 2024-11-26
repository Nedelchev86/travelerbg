import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelersDetailsComponent } from './travelers-details.component';

describe('TravelersDetailsComponent', () => {
  let component: TravelersDetailsComponent;
  let fixture: ComponentFixture<TravelersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelersDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
