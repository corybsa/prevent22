import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWarningFlyoutComponent } from './add-warning-flyout.component';

describe('AddWarningFlyoutComponent', () => {
  let component: AddWarningFlyoutComponent;
  let fixture: ComponentFixture<AddWarningFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWarningFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWarningFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
