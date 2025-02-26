import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DaoComunicatorService } from '../../../service/dao-comunicator.service';
import { NgToastService } from 'ng-angular-popup';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../../models/user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  dao = inject(DaoComunicatorService)
  fb = inject(FormBuilder);


  userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
  })


  constructor(private toast: NgToastService, @Inject(MAT_DIALOG_DATA) public data: IUser | null, public dialogRef: MatDialogRef<EditUserComponent>) { }

  ngOnInit() {
    if (this.data) {
      this.userForm.patchValue({
        username: this.data.username,
        email: this.data.email
      })
    }
  }


  saveClient() {
    if (this.userForm.valid) {
      this.dao.updateUser(this.userForm.value.email!, this.userForm.value.username!).subscribe(res => {
        if (res.error) {
          this.toast.success(res.error.message);
        }
        else {
          this.toast.success('Përditsimi u bë me sukses!')
          this.dialogRef.close(res)

        }
      })
    }


  }
}
