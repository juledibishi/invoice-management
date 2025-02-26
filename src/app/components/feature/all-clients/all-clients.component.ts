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
    FilterPipe
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

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllClients();
  }

  getAllClients() {
    this.dao.getClients().subscribe(client => {
      this.clients = client;
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

  paymentCalculate() {
    return this.clients.reduce((total, client) => total + Number(client.payment), 0)
  }

  debtCalculate() {
    return this.clients.reduce((total, client) => total + Number(client.debt), 0)
  }

  logout() {
    this.dao.logout();
    this.router.navigateByUrl('login')
  }

  admin() {
    this.router.navigateByUrl('user-data')
  }
}
