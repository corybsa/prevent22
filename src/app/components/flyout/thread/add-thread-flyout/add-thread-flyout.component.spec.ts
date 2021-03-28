import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThreadFlyoutComponent } from './add-thread-flyout.component';

describe('AddThreadFlyoutComponent', () => {
  let component: AddThreadFlyoutComponent;
  let fixture: ComponentFixture<AddThreadFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddThreadFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThreadFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
