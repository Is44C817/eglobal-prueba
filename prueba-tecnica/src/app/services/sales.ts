import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Sale } from '../interfaces/sale';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class Sales {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient,
    private readonly auth: Auth,
  ) {}

  createSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/sales`, sale, {
      headers: this.getHeaders(),
    });
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/sales`, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
