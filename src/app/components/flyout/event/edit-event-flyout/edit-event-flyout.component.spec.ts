import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventFlyoutComponent } from './edit-event-flyout.component';

describe('EditEventFlyoutComponent', () => {
  let component: EditEventFlyoutComponent;
  let fixture: ComponentFixture<EditEventFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
