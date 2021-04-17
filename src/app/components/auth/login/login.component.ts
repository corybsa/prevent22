import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { setCurrentUser } from 'src/app/state/user/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  windowHeight = window.innerHeight;
  userModel = {
    username: '',
    password: ''
  };
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router,
    private toast: MessageService
  ) { }

  ngOnInit(): void {
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.authService.login(this.userModel.username, this.userModel.password)
        .pipe(
          tap(user => this.store.dispatch(setCurrentUser({ user: User.getInstance(user) })))
        ).subscribe(
          user => {
            if(user) {
              this.router.navigate(['/']);
            }
          },
          err => Helper.showError(this.toast, err.error.message)
        );
    }
  }
}
