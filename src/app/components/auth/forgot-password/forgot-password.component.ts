import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Helper } from 'src/app/models/helper';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  windowHeight = window.innerHeight;
  email: string;

  constructor(
    private service: UsersService,
    private toast: MessageService
  ) { }

  ngOnInit(): void {
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.service.resetPasswordRequest(this.email).subscribe(
        () => Helper.showSuccess(this.toast, 'Look out for an email from us!'),
        err => Helper.showError(this.toast, err.error.message)
      );
    }
  }
}
