import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsLayoutComponent } from './hotels-layout.component';

describe('HotelsLayoutComponent', () => {
  let component: HotelsLayoutComponent;
  let fixture: ComponentFixture<HotelsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
