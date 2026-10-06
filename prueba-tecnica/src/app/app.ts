import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { Main } from './interfaces/main/main';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Login, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('prueba-tecnica');
}
