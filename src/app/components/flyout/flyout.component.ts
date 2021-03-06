import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { combineLatest, Subscription } from "rxjs";
import { Flyout } from "src/app/models/flyout/flyout";
import { FlyoutContent } from "src/app/models/flyout/flyout-content";
import { FlyoutStatus } from "src/app/models/flyout/flyout-status";
import { Helper } from "src/app/models/helper";
import { User } from "src/app/models/user/user";
import { navFlyoutBack, setFlyoutStatus } from "src/app/state/flyout/flyout.actions";
import { selectFlyout } from "src/app/state/flyout/flyout.selectors";
import { selectCurrentUser } from "src/app/state/user/user.selectors";

declare const $: any;
declare const window: any;

@Component({
  selector: 'app-flyout',
  styleUrls: ['./flyout.component.css'],
  templateUrl: './flyout.component.html'
})
export class FlyoutComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  status: FlyoutStatus;
  title: string;
  showBack: boolean;
  content: FlyoutContent;
  user: User;

  dirty: boolean;

  isMobile: boolean;

  storeFlyout: Flyout;

  constructor(
    private router: Router,
    private store: Store
  ) {
    this.isMobile = Helper.isMobile();

    this.subscriptions.push(
      combineLatest([
        this.store.select(selectCurrentUser),
        this.store.select(selectFlyout)
      ]).subscribe(([user, flyout]) => {
        if (flyout === null) {
          return;
        }

        this.storeFlyout = flyout;
        this.status = flyout.status;
        this.title = flyout.title;
        this.content = flyout.content;
        this.showBack = flyout.showBack;

        this.user = user;

        if (this.status === FlyoutStatus.Open) {
          $('app-flyout').stop().show().animate({ right: 0 }, 400);
          $('.flyout-body').scrollTop(0);
          $('html').css('overflow', 'hidden');
        } else {
          let width = window.innerWidth * -0.45;

          if (window.innerWidth <= 425) {
            width = window.innerWidth * -1;
          }

          $('app-flyout').stop().animate({ right: width }, 400, function () {
            $('app-flyout').hide();
          });

          $('html').css('overflow', 'overlay');
        }
      })
    );

    this.subscriptions.push(
      this.router.events.subscribe((val) => {
        if (this.status === FlyoutStatus.Open) {
          this.closeFlyout();
        }
      })
    );
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  closeFlyout() {
    if(this.storeFlyout.onClose) {
      this.storeFlyout.onClose();
    }

    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
  }

  navigateBack() {
    this.store.dispatch(navFlyoutBack());
  }
}
