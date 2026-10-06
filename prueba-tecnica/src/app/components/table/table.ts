import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Auth } from '../../services/auth';
import { SalesForm } from '../sales-form/sales-form';
import { Sale } from '../../interfaces/sale';
import { Sales } from '../../services/sales';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [SalesForm, DecimalPipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnInit {
  role: string | null = null;

  sales: Sale[] = [];

  constructor(
    private readonly auth: Auth,
    private readonly salesService: Sales,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.role = this.auth.getRole();
  }

  ngOnInit(): void {
    this.loadSales();
  }

  private loadSales(): void {
    this.salesService.getSales().subscribe({
      next: (sales: Sale[]) => {
        this.sales = [...sales];
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Error al consultar ventas:', error);
      },
    });
  }

  isOperator(): boolean {
    return this.role === 'operador';
  }

  isSupervisor(): boolean {
    return this.role === 'supervisor';
  }

  addSale(sale: Sale): void {
    this.salesService.createSale(sale).subscribe({
      next: () => {
        alert('Venta registrada correctamente');
        this.loadSales();
      },
      error: (error: any) => {
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
