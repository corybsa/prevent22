import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { setUser } from 'src/app/state/user/user.actions';

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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.authService.login(this.userModel.username, this.userModel.password)
        .pipe(
          tap(user => this.store.dispatch(setUser({ user: User.getInstance(user) }))),
          catchError(err => {
            this.errorMessage = err.error.message;
            return new Observable(o => o.complete());
          })
        ).subscribe(user => {
          if(user) {
            this.router.navigate(['/']);
          }
        });
    }
  }
}
