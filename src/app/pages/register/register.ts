import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLayout } from '../../components/templates/auth-layout/auth-layout';
import { RegisterForm } from '../../components/organisms/register-form/register-form';

@Component({
  selector: 'app-register',
  imports: [AuthLayout, RegisterForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private router: Router) {}

  onRegister(): void {
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
