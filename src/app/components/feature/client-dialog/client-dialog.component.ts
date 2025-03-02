import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DaoComunicatorService } from '../../../service/dao-comunicator.service';
import { NgToastService } from 'ng-angular-popup';
import { HelperService } from '../../../service/helper.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllClientsComponent } from '../all-clients/all-clients.component';
import { IClient } from '../../../models/client.model';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.scss'
})
export class ClientDialogComponent implements OnInit {
  fb = inject(FormBuilder);
  dao = inject(DaoComunicatorService)
  helper = inject(HelperService)

  clientForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    debt: [0, Validators.required],
    payment: [0, Validators.required],
    surname: ['', Validators.required],
    phone: ['', Validators.required],
    date_created: ['', Validators.required]
  })

  constructor(private toast: NgToastService, @Inject(MAT_DIALOG_DATA) public data: IClient | null, public dialogRef: MatDialogRef<ClientDialogComponent>) { }
  ngOnInit() {
    if (this.data) {
      this.clientForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        debt: this.data.debt,
        payment: this.data.payment,
        surname: this.data.surname,
        phone: this.data.phone,
        date_created: this.data.date_created
      })
    }
  }

  addClient() {
    const rawForm = this.clientForm.getRawValue();
    if (this.clientForm.valid) {
      this.dao.saveClient(rawForm).then(() => {
        this.dialogRef.close(rawForm)
        this.toast.success('Klienti u regjistrua me sukses!')
      })
    }
  }

  editClient() {
    if (this.clientForm.valid) {

      const updateClient = {
        ...this.data,
        ...this.clientForm.getRawValue()
      }

      this.dao.updateClient(updateClient).then(({ data, error }) => {
        if (error) {
          console.error('Error updating client:', error);
          this.toast.warning('Ndodhi një gabim gjatë përditësimit të klientit!');
        } else {
          this.toast.success('Klienti u përditësua me sukses!');
          this.dialogRef.close(data);
        }
      })
    }


  }
}
