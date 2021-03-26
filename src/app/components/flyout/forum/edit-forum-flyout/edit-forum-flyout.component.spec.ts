import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditForumFlyoutComponent } from './edit-forum-flyout.component';

describe('EditForumFlyoutComponent', () => {
  let component: EditForumFlyoutComponent;
  let fixture: ComponentFixture<EditForumFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditForumFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditForumFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
