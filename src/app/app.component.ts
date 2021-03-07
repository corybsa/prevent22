import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  date = new Date().getFullYear();

  constructor(
    private authService: AuthService
  ) {}

  check() {
    this.authService.check().subscribe();
  }

  login() {
    this.authService.login('corybsa', '!@#$QWER1234qwer').subscribe();
  }
}
