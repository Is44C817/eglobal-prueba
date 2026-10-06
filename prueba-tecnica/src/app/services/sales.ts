import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Sale } from '../interfaces/sale';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class Sales {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  createSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/sales`, sale);
  }
}
