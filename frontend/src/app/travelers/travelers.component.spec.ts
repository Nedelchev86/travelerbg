import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraleversComponent } from './travelers.component';

describe('TraleversComponent', () => {
  let component: TraleversComponent;
  let fixture: ComponentFixture<TraleversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraleversComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TraleversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
