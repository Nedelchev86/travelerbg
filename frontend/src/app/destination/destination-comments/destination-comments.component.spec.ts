import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationCommentsComponent } from './destination-comments.component';

describe('DestinationCommentsComponent', () => {
  let component: DestinationCommentsComponent;
  let fixture: ComponentFixture<DestinationCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationCommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinationCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
