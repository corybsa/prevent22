import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventFlyoutComponent } from './add-event-flyout.component';

describe('AddEventFlyoutComponent', () => {
  let component: AddEventFlyoutComponent;
  let fixture: ComponentFixture<AddEventFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
