import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCommentsComponent } from './hotel-comments.component';

describe('HotelCommentsComponent', () => {
  let component: HotelCommentsComponent;
  let fixture: ComponentFixture<HotelCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelCommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
