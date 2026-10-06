import { Component } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  role: string | null = null;

  constructor(private readonly auth: Auth) {
    this.role = this.auth.getRole();
  }

  isOperator(): boolean {
    return this.role === 'operador';
  }

  isSupervisor(): boolean {
    return this.role === 'supervisor';
  }
}
