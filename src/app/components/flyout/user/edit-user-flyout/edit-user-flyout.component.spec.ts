import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserFlyoutComponent } from './edit-user-flyout.component';

describe('EditUserFlyoutComponent', () => {
  let component: EditUserFlyoutComponent;
  let fixture: ComponentFixture<EditUserFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
