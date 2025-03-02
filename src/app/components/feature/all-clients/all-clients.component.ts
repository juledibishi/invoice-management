import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DaoComunicatorService } from '../../../service/dao-comunicator.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { IClient } from '../../../models/client.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialogComponent } from '../client-dialog/client-dialog.component';
import { HelperService } from '../../../service/helper.service';
import { DeleteClientComponent } from '../delete-client/delete-client.component';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './all-clients.component.html',
  styleUrl: './all-clients.component.scss'
})
export class AllClientsComponent implements OnInit {
  router = inject(Router);
  helper = inject(HelperService);
  fb = inject(FormBuilder);
  dao = inject(DaoComunicatorService)
  clients: IClient[] = []
  clientId: string = '';
  searchText: string = '';
  paymentResult: string = '';
  debtResult: string = '';
  filterType: 'all' | 'debt' = 'all';
  selectedYear: string = '';
  filteredClients: IClient[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllClients();
    this.paymentCalculate()
    this.debtCalculate()
  }

  getAllClients() {
    this.dao.getClients().subscribe(client => {
      this.filteredClients = [];
      this.clients = client;
      this.filteredClients = [...client]
    })
  }

  editClient(clientId: string) {
    const clientData = this.clients.find(c => c.id === clientId)
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '70vw',
      data: clientData
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getAllClients();
    })
  }

  deleteClient(clientId: string) {
    const dialogRef = this.dialog.open(DeleteClientComponent, {
      data: clientId
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getAllClients();
    })
  }

  openInvoice(cliendId: string) {
    const clientData = this.clients.find(c => c.id === cliendId);
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      width: '90vw',
      data: clientData,
      autoFocus: false,
      height: '100%'
    })
  }

  addClient() {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '70vw'
    })

    dialogRef.afterClosed().subscribe(() => {
      this.getAllClients();
    })
  }

  paymentCalculate(): number {
    return this.filteredClients.reduce((total, client) => total + client.payment, 0);
  }

  debtCalculate(): number {
    return this.filteredClients.reduce((total, client) => total + client.debt, 0);
  }

  filterClients() {

    this.filteredClients = this.clients.filter(client => {
      const clientYear = new Date(client.date_created!).getFullYear();

      const year = (clientYear.toString() === this.selectedYear);

      const debt = this.filterType === 'all' ? client.debt >= 0 : client.debt > 0;

      const name = (client.name.toLowerCase().includes(this.searchText.toLowerCase()));

      if (this.selectedYear) {
        return year && debt && name;
      }
      return debt && name;
    });

    this.paymentCalculate();
    this.debtCalculate();
  }

  logout() {
    this.dao.logout();
    this.router.navigateByUrl('login')
  }

  admin() {
    this.router.navigateByUrl('user-data')
  }
}
