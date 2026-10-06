import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Table } from '../../components/table/table';

@Component({
  selector: 'app-main',
  imports: [Navbar, Table],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {

}
