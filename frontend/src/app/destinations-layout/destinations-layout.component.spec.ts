import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationsLayoutComponent } from './destinations-layout.component';

describe('DestinationsLayoutComponent', () => {
  let component: DestinationsLayoutComponent;
  let fixture: ComponentFixture<DestinationsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinationsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
