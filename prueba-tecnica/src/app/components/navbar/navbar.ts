import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    private readonly router: Router,
    private readonly auth: Auth,
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  
}
