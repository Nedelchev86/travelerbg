import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationsByUserComponent } from './destinations-by-user.component';

describe('DestinationsByUserComponent', () => {
  let component: DestinationsByUserComponent;
  let fixture: ComponentFixture<DestinationsByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationsByUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinationsByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
