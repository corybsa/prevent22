import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVolunteerFlyoutComponent } from './add-volunteer-flyout.component';

describe('AddVolunteerFlyoutComponent', () => {
  let component: AddVolunteerFlyoutComponent;
  let fixture: ComponentFixture<AddVolunteerFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVolunteerFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVolunteerFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
