import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelersLayoutComponent } from './travelers-layout.component';

describe('TravelersLayoutComponent', () => {
  let component: TravelersLayoutComponent;
  let fixture: ComponentFixture<TravelersLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelersLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelersLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
