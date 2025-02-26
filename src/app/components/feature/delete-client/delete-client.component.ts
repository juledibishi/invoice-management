import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { IClient } from '../../../models/client.model';
import { DaoComunicatorService } from '../../../service/dao-comunicator.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-delete-client',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatButtonModule,],
  templateUrl: './delete-client.component.html',
  styleUrl: './delete-client.component.scss'
})
export class DeleteClientComponent {
  dao = inject(DaoComunicatorService)

  constructor(private toast: NgToastService,
    public dialogRef: MatDialogRef<DeleteClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IClient
  ) { }

  onConfirm(): void {
    if (this.data) {
      this.dao.deleteClient(this.data).then(() => {
        this.dialogRef.close(true);
        this.toast.success('Klienti u fshij me sukses!')
      })
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
