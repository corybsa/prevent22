import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Forum } from 'src/app/models/forum/forum';
import { Helper } from 'src/app/models/helper';
import { ForumsService } from 'src/app/services/forums/forums.service';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { setAllForums } from 'src/app/state/forums/forums.actions';

@Component({
  selector: 'app-add-forum-flyout',
  templateUrl: './add-forum-flyout.component.html',
  styleUrls: ['./add-forum-flyout.component.css']
})
export class AddForumFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  forum = new Forum();

  constructor(
    private service: ForumsService,
    private toast: MessageService,
    private store: Store
  ) { }

  ngOnInit(): void {
    
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.subs.push(
        this.service.create(this.forum.BoardName, this.forum.BoardDescription).subscribe(
          forums => {
            Helper.showSuccess(this.toast, 'Forum created!');
            this.store.dispatch(setAllForums({ forums }));
            this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
          },
          err => Helper.showError(this.toast, err.error.message)
        )
      );
    }
  }
}
