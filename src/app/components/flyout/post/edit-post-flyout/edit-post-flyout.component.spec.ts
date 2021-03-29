import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostFlyoutComponent } from './edit-post-flyout.component';

describe('EditPostFlyoutComponent', () => {
  let component: EditPostFlyoutComponent;
  let fixture: ComponentFixture<EditPostFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPostFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
