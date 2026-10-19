import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLayout } from '../../components/templates/auth-layout/auth-layout';
import { LoginForm } from '../../components/organisms/login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [AuthLayout, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router) {}

  onLogin(): void {
    this.router.navigate(['/dashboard']);
  }

  goToRegister(): void {
    this.router.navigate(['/registro']);
  }
}
