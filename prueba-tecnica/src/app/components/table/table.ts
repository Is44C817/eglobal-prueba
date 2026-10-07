import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import Swal from 'sweetalert2';

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

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible consultar las ventas.',
          confirmButtonText: 'Aceptar',
        });
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
        Swal.fire({
          icon: 'success',
          title: 'Venta registrada',
          text: 'La venta se registró correctamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#004481',
        }).then(() => {
          this.loadSales();
        });
      },

      error: (error: any) => {
        console.error('Error al registrar venta:', error);

        if (error.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo registrar',
            text: 'Los datos enviados no son válidos.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#004481',
          });

          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Ocurrió un error al registrar la venta. Código: ${error.status}`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#004481',
        });
      },
    });
  }
}
