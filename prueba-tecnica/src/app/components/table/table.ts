import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { SalesForm } from '../sales-form/sales-form';
import { Sale } from '../../interfaces/sale';
import { Sales } from '../../services/sales';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [SalesForm, DecimalPipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  role: string | null = null;

  sales: Sale[] = [];

  constructor(
    private readonly auth: Auth,
    private readonly salesService: Sales,
  ) {
    this.role = this.auth.getRole();
  }

  isOperator(): boolean {
    return this.role === 'operador';
  }

  isSupervisor(): boolean {
    return this.role === 'supervisor';
  }

  addSale(sale: Sale): void {
    this.salesService.createSale(sale).subscribe({
      next: (createdSale) => {
        this.sales.push(createdSale);

        alert('Venta registrada correctamente');
      },

      error: (error) => {
        console.error('Error al registrar venta:', error);

        if (error.status === 400) {
          alert('No fue posible registrar la venta');
          return;
        }

        alert(`Error HTTP: ${error.status}`);
      },
    });
  }
}
