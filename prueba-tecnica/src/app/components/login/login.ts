import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

        if (role === 'supervisor') {
          this.router.navigate(['/cancellations']);
          return;
        }

        console.error('Rol no permitido:', role);

        Swal.fire({
          icon: 'error',
          title: 'Rol no permitido',
          text: 'El usuario no tiene un rol válido para acceder al sistema.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#004481',
        });
      },

      error: (error) => {
        console.error('Error HTTP:', error.status);
        console.error('URL:', error.url);
        console.error('Error:', error.error);

        if (error.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error de acceso',
            text: 'Usuario o contraseña incorrectos.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#004481',
          });

          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al iniciar sesión.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#004481',
        });
      },
    });
  }
}
