import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTravelersComponent } from './top-travelers.component';

describe('TopTravelersComponent', () => {
  let component: TopTravelersComponent;
  let fixture: ComponentFixture<TopTravelersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopTravelersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTravelersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
