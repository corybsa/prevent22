import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelVolunteerFlyoutComponent } from './cancel-volunteer-flyout.component';

describe('CancelVolunteerFlyoutComponent', () => {
  let component: CancelVolunteerFlyoutComponent;
  let fixture: ComponentFixture<CancelVolunteerFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelVolunteerFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelVolunteerFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
