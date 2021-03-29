import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { Thread } from 'src/app/models/thread/thread';
import { ThreadsService } from 'src/app/services/forums/threads.service';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { setThread, setThreads } from 'src/app/state/threads/threads.actions';
import { selectThread } from 'src/app/state/threads/threads.selectors';

@Component({
  selector: 'app-edit-thread-flyout',
  templateUrl: './edit-thread-flyout.component.html',
  styleUrls: ['./edit-thread-flyout.component.css']
})
export class EditThreadFlyoutComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  thread = new Thread();

  constructor(
    private service: ThreadsService,
    private toast: MessageService,
    private store: Store
  ) {
    this.subs.push(
      this.store.select(selectThread).subscribe(thread => this.thread = Helper.copy(thread))
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.subs.push(
        this.service.update(
          this.thread.ThreadId,
          this.thread.BoardId,
          this.thread.ThreadName,
          this.thread.CreatedBy,
          this.thread.CreatedDate,
          !!this.thread.IsClosed
        ).subscribe(
          threads => {
            Helper.showSuccess(this.toast, 'Thread updated!');
            this.store.dispatch(setThread({ thread: null }));
            this.store.dispatch(setThreads({ threads }));
            this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
          },
          err => Helper.showError(this.toast, err.error.message)
        )
      );
    }
  }
}
