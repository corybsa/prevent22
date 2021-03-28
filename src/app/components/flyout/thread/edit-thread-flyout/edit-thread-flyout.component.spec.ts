import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThreadFlyoutComponent } from './edit-thread-flyout.component';

describe('EditThreadFlyoutComponent', () => {
  let component: EditThreadFlyoutComponent;
  let fixture: ComponentFixture<EditThreadFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditThreadFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditThreadFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
