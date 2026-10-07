import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Sale } from '../../interfaces/sale';
import { Sales } from '../../services/sales';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-cancellation-form',
  standalone: true,
  imports: [FormsModule, Navbar, DecimalPipe],
  templateUrl: './cancellation-form.html',
  styleUrl: './cancellation-form.css',
})
export class CancellationForm {
  operation = {
    financialReference: '',
    card: '',
    approvalNumber: '',
    type: 'Cancelación' as 'Cancelación' | 'Devolución',
  };

  sale: Sale | null = null;

  searching = false;
  processing = false;

  constructor(
    private readonly salesService: Sales,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  onCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, '').substring(0, 16);

    input.value = value;
    this.operation.card = value;
  }

  onReferenceInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, '');

    input.value = value;
    this.operation.financialReference = value;
  }

  onApprovalInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, '');

    input.value = value;
    this.operation.approvalNumber = value;
  }

  searchOperation(): void {
    console.log('BOTÓN CONSULTAR PRESIONADO');
    console.log('Operación:', this.operation);

    if (!this.operation.financialReference || !this.operation.card) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Ingresa la referencia financiera y el número de tarjeta.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#004481',
      });

      return;
    }

    this.searching = true;
    this.sale = null;

    this.cdr.detectChanges();

    this.salesService.getSales().subscribe({
      next: (sales: Sale[]) => {
        console.log('GET /sales RESPONDIÓ:', sales);

        const maskedCard = this.maskCard(this.operation.card);

        console.log('Tarjeta enmascarada:', maskedCard);

        const foundSale = sales.find((sale) => {
          console.log('Comparando operación:', sale);

          return (
            sale.financialReference === this.operation.financialReference &&
            sale.card === maskedCard &&
            sale.type === 'Venta'
          );
        });

        console.log('OPERACIÓN ENCONTRADA:', foundSale);

        this.searching = false;

        if (!foundSale) {
          this.cdr.detectChanges();

          Swal.fire({
            icon: 'error',
            title: 'Operación no encontrada',
            text: 'No se encontró una venta con los datos proporcionados.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#004481',
          });

          return;
        }

        this.sale = foundSale;

        this.operation.approvalNumber = foundSale.approvalNumber ?? '';

        this.cdr.detectChanges();

        Swal.fire({
          icon: 'success',
          title: 'Operación encontrada',
          text: 'La operación está disponible para procesar.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#004481',
        });
      },

      error: (error: unknown) => {
        console.error('ERROR GET /sales:', error);

        this.searching = false;

        this.cdr.detectChanges();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible consultar la operación.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#004481',
        });
      },
    });
  }

  processOperation(): void {
    if (!this.sale) {
      return;
    }

    if (!this.operation.approvalNumber) {
      Swal.fire({
        icon: 'warning',
        title: 'Dato requerido',
        text: 'Ingresa el número de aprobación.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#004481',
      });

      return;
    }

    this.processing = true;

    this.cdr.detectChanges();

    this.salesService
      .updateSale(this.sale.id, {
        type: this.operation.type,
        approvalNumber: this.operation.approvalNumber,
      })
      .subscribe({
        next: () => {
          this.processing = false;

          this.cdr.detectChanges();

          Swal.fire({
            icon: 'success',
            title: `${this.operation.type} realizada`,
            text: 'La operación se procesó correctamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#004481',
          }).then(() => {
            this.resetForm();
          });
        },

        error: (error: any) => {
          this.processing = false;

          console.error('Error al procesar operación:', error);

          this.cdr.detectChanges();

          if (error.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Operación no válida',
              text: 'Los datos enviados no son válidos.',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#004481',
            });

            return;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No fue posible procesar la operación. Código: ${error.status}`,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#004481',
          });
        },
      });
  }

  resetForm(): void {
    this.operation = {
      financialReference: '',
      card: '',
      approvalNumber: '',
      type: 'Cancelación',
    };

    this.sale = null;

    this.cdr.detectChanges();
  }

  private maskCard(card: string): string {
    if (!card || card.length < 8) {
      return '****';
    }

    return `${card.substring(0, 4)}****${card.substring(card.length - 4)}`;
  }
}
