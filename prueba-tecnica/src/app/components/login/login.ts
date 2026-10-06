import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginRequest } from '../../interfaces/login-request';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginRequest: LoginRequest = {
    username: '',
    password: '',
  };

  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
  ) {}

  login(): void {
    this.auth.login(this.loginRequest).subscribe({
      next: (response) => {
        this.auth.saveToken(response.token);

        const role = this.auth.getRole();

        console.log('Role:', role);

        if (role === 'operador') {
          this.router.navigate(['/main']);
          return;
        }

        console.error('Rol no permitido:', role);
      },

      error: (error) => {
          console.error('Error completo:', error);
          console.error('Status:', error.status);
          console.error('URL:', error.url);
          console.error('Error:', error.error);

          alert(`Error HTTP: ${error.status}`);

        if (error.status === 400) {
          alert('Usuario o contraseña incorrectos');
          return;
        }

        alert('Ocurrió un error al iniciar sesión');
      },
    });
  }
}
