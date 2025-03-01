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
import { FilterPipe } from "../../../pipes/filter.pipe";
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { FilterDebtPipe } from "../../../pipes/filter-debt.pipe";
import { FilterByYearPipe } from "../../../pipes/filter-by-year.pipe";
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
    MatSelectModule,
    FilterPipe,
    FilterDebtPipe,
    FilterByYearPipe
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
  clientId!: string;
  searchText!: string;
  paymentResult!: string;
  debtResult!: string;
  filterType: 'all' | 'debt' | 'paid' = 'all';
  selectedYear: string = 'all';
  filteredClients: any[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllClients();
    const currentYear = new Date().getFullYear().toString();
    this.selectedYear = currentYear;

  }

  getAllClients() {
    this.dao.getClients().subscribe(client => {
      this.clients = client;
      this.filterClientsByYear();
    })
  }

  editClient(clientId: string) {
    const clientData = this.clients.find(c => c.id === clientId)
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '70vw',
      data: clientData
    })
    dialogRef.afterClosed().subscribe(() => {

      this.dao.getClients().subscribe(client => {
        this.clients = client;
      })
    })
  }

  deleteClient(clientId: string) {
    const dialogRef = this.dialog.open(DeleteClientComponent, {
      data: clientId
    })
    dialogRef.afterClosed().subscribe(() => {
      this.dao.getClients().subscribe(client => {
        this.clients = client;
      })
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
      this.dao.getClients().subscribe(client => {
        this.clients = client;
      })
    })
  }

  paymentCalculate(): number {
    return this.filteredClients.reduce((total, client) => total + parseFloat(client.payment), 0);
  }

  debtCalculate(): number {
    return this.filteredClients.reduce((total, client) => total + parseFloat(client.debt), 0);
  }

  onYearChange() {
    this.filterClientsByYear();
  }

  filterClientsByYear() {
    if (this.selectedYear === 'all') {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(client => {
        const clientYear = new Date(client.created_at!).getFullYear();
        return clientYear.toString() === this.selectedYear;
      });
    }
  }

  get clientCount(): number {
    return this.filteredClients.length;
  }

  logout() {
    this.dao.logout();
    this.router.navigateByUrl('login')
  }

  admin() {
    this.router.navigateByUrl('user-data')
  }
}
