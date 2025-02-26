import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IClient } from '../../../models/client.model';

@Component({
  selector: 'app-invoice-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-dialog.component.html',
  styleUrl: './invoice-dialog.component.scss'
})
export class InvoiceDialogComponent implements OnInit {
  invoiceForm: FormGroup;
  clientData!: IClient;
  today: Date = new Date();
  @ViewChild('invoice') invoiceElement!: ElementRef;


  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: IClient | null, public dialogRef: MatDialogRef<InvoiceDialogComponent>) {
    this.invoiceForm = this.fb.group({
      items: this.fb.array([this.createItem()]),
    });
  }

  ngOnInit(): void {
    this.clientData = this.data!;
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  printInvoice() {
    const invoiceData = {
      client: this.clientData,
      today: new Date().toLocaleDateString(),
      items: this.invoiceForm.value.items,
      total: this.getTotal(),
    };

    const printContents = `
      <div class="container">
        <section class="jumbotron">
            <div class="left-side">
                <h2>Oferta për:</h2>
                <p>Emri: <b>${invoiceData.client.name}</b></p>
                <p>Mbiemri: <b>${invoiceData.client.surname}</b></p>
                <p>Telefoni: <b>${invoiceData.client.phone}</b></p>
            </div>
    
            <div class="right-side">
                <img src="assets/img/romebel-1.png" alt="Company Logo" class="company-logo" />
                <p><strong>Data:</strong> ${invoiceData.today}</p>
            </div>
        </section>
    
        <table class="table">
            <thead>
                <tr>
                    <th>Artikulli</th>
                    <th>Përshkrimi</th>
                    <th>Sasia</th>
                    <th>Çmimi</th>
                    <th>Gjithësej</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.qty} ${item.unit}</td>
                    <td>${Number(item.price).toFixed(2)} €</td>
                    <td>${(item.qty * item.price).toFixed(2)} €</td>
                  </tr>
                `).join('')}
                <tr>
                    <td colspan="3"></td>
                    <td class="total-label">Total :</td>
                    <td>${Number(invoiceData.total).toFixed(2)} €</td>
                </tr>
            </tbody>
        </table>
  
        <div class="signature">
            <div>
                <span>Nënshkrim</span><br><br><br>
                <span>_______________________</span>
            </div>
            <div>
                <span>Nënshkrim</span><br><br><br>
                <span>_______________________</span>
            </div>
        </div>
      </div>

       <!-- Footer Section -->
    <footer class="footer">
      <p><strong>Tel:</strong> 123123123</p>
      <p><strong>Email:</strong> company@gmail.com</p>
      <p><strong>Address:</strong> Tetovo1232</p>
    </footer>
    `;

    // Open a new print window
    const popupWin = window.open('', '_blank', 'width=900,height=600');

    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  padding: 10px;
              }
              .container {
                  padding: 20px;
              }
              .jumbotron {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  background-color: #f5f5f5;
                  padding: 20px;
                  border-radius: 5px;
              }
              .left-side h2 {
                  font-size: 24px;
              }
              .right-side {
                  text-align: right;
              }
              .company-logo {
                  width: 200px;
                  margin-bottom: 10px;
              }
              .table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
              }
              .table th, .table td {
                  border: 1px solid #000;
                  padding: 8px;
                  text-align: left;
              }
              .table th {
                  background-color: #f2f2f2;
              }
              .signature {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 40px;
              }

               .footer {
                margin-top: 40px;
                padding-top: 10px;
                border-top: 1px solid #ccc;
                text-align: center;
                font-size: 14px;
            }
            </style>
          </head>
          <body onload="window.print();">
            ${printContents}
          </body>
        </html>
      `);
      popupWin.document.close();
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      qty: [1, [Validators.required, Validators.min(1)]],
      unit: ['pcs', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  getTotal(): number {
    return this.items.controls.reduce((total, item) => {
      const qty = item.get('qty')?.value || 0;
      const price = item.get('price')?.value || 0;
      return total + qty * price;
    }, 0);
  }

}
