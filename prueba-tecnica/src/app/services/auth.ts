import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
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
