import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddForumFlyoutComponent } from './add-forum-flyout.component';

describe('AddForumFlyoutComponent', () => {
  let component: AddForumFlyoutComponent;
  let fixture: ComponentFixture<AddForumFlyoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddForumFlyoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddForumFlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
