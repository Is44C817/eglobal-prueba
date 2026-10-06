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

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');

    this.sale.name = input.value;
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value;

    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');

    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join('')}`;
    }

    if (parts[1]?.length > 2) {
      value = `${parts[0]}.${parts[1].substring(0, 2)}`;
    }

    input.value = value;

    this.sale.amount = value ? Number(value) : null;
  }

  onCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, '').substring(0, 16);

    input.value = value;
    this.sale.card = value;
  }

  onExpirationInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '').substring(0, 4);

    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }

    input.value = value;
    this.sale.expiration = value;
  }

  onCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, '').substring(0, 3);

    input.value = value;
    this.sale.cvv = value;
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

   getCurrentDate(): string {
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
