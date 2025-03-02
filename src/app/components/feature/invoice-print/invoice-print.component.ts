import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IClient } from '../../../models/client.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-print',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.scss']
})
export class InvoicePrintComponent implements OnInit {
  @Input() invoiceForm!: FormGroup;
  @Input() clientData!: IClient;
  today: Date = new Date();

  ngOnInit(): void { }

  get items() {
    return this.invoiceForm.get('items') as any;
  }

  getTotal(): number {
    return this.items.controls.reduce((total: number, item: any) => {
      const qty = item.get('qty')?.value || 0;
      const price = item.get('price')?.value || 0;
      return total + qty * price;
    }, 0);
  }
}
