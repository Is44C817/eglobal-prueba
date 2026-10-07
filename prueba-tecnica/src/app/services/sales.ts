import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';

import { Sale } from '../interfaces/sale';
import { Auth } from './auth';
import { Encryption } from './encryption';

@Injectable({
  providedIn: 'root',
})
export class Sales {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient,
    private readonly auth: Auth,
    private readonly encryption: Encryption,
  ) {}

  createSale(sale: Sale): Observable<Sale> {
    return from(
      Promise.all([
        this.encryption.encrypt(sale.card),
        this.encryption.encrypt(sale.expiration),
        this.encryption.encrypt(sale.cvv),
      ]),
    ).pipe(
      switchMap(([card, expiration, cvv]) => {
        const encryptedSale = {
          ...sale,
          card,
          expiration,
          cvv,

          cardMasked: this.maskCard(sale.card),
          expirationDisplay: sale.expiration,
          cvvMasked: '***',
        };

        return this.http.post<Sale>(`${this.apiUrl}/sales`, encryptedSale, {
          headers: this.getHeaders(),
        });
      }),
    );
  }

  getSales(): Observable<Sale[]> {
    return this.http
      .get<Sale[]>(`${this.apiUrl}/sales`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((sales) =>
          sales.map((sale) => ({
            ...sale,

            card: sale.cardMasked ?? sale.card,
            expiration: sale.expirationDisplay ?? sale.expiration,
            cvv: sale.cvvMasked ?? '***',
          })),
        ),
      );
  }

  private maskCard(card: string): string {
    if (!card || card.length < 8) {
      return '****';
    }

    return `${card.substring(0, 4)}****${card.substring(card.length - 4)}`;
  }

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
