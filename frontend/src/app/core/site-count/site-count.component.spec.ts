import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCountComponent } from './site-count.component';

describe('SiteCountComponent', () => {
  let component: SiteCountComponent;
  let fixture: ComponentFixture<SiteCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
