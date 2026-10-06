import { Component, EventEmitter, Output, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sale } from '../../interfaces/sale';
@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sales-form.html',
  styleUrl: './sales-form.css',
})
export class SalesForm {
  @Output() saleCreated = new EventEmitter<Sale>();

  private readonly platformId = inject(PLATFORM_ID);

  sale = {
    name: '',
    amount: null as number | null,
    card: '',
    expiration: '',
    cvv: '',
  };

  registerSale(): void {
    if (
      !this.sale.name ||
      !this.sale.amount ||
      !this.sale.card ||
      !this.sale.expiration ||
      !this.sale.cvv
    ) {
      return;
    }

    const newSale: Sale = {
      id: this.generateId(),
      type: 'Venta',
      amount: this.sale.amount,
      name: this.sale.name,
      card: this.maskCard(this.sale.card),
      expiration: this.sale.expiration,
      cvv: this.sale.cvv,
      date: this.getCurrentDate(),
    };

    this.saleCreated.emit(newSale);

    this.sale = {
      name: '',
      amount: null,
      card: '',
      expiration: '',
      cvv: '',
    };
  }

  private generateId(): string {
    if (!isPlatformBrowser(this.platformId)) {
      return '001';
    }

    const currentId = Number(localStorage.getItem('lastSaleId') ?? '0');

    const nextId = currentId + 1;

    localStorage.setItem('lastSaleId', nextId.toString());

    return nextId.toString().padStart(3, '0');
  }

  private getCurrentDate(): string {
    const date = new Date();

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  private maskCard(card: string): string {
    return `${card.substring(0, 4)}****${card.substring(12)}`;
  }
}
