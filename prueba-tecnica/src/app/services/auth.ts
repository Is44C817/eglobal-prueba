import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'http://localhost:3000';
  private readonly platformId = inject(PLATFORM_ID);

  private readonly users = [
    {
      username: 'operador@operador.com',
      password: '123456',
    },
    {
      username: 'supervisor@supervisor.com',
      password: '123456',
    },
  ];

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    const user = this.users.find(
      (item) => item.username === request.username && item.password === request.password,
    );

    if (!user) {
      return throwError(() => ({
        status: 400,
        error: {
          message: 'Usuario o contraseña incorrectos',
        },
      }));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  saveToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem('token');
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem('token');
  }

  getRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      return decodedPayload.role;
    } catch {
      return null;
    }
  }
}
