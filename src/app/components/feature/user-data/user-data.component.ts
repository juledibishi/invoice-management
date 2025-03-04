import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { DaoComunicatorService } from '../../../service/dao-comunicator.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { IUser } from '../../../models/user.model';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss'
})
export class UserDataComponent {
  router = inject(Router)
  dao = inject(DaoComunicatorService)
  fb = inject(FormBuilder);

  userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
  })

  userData!: IUser;
  constructor(public dialog: MatDialog) {

  }
  ngOnInit(): void {

    this.dao.supabase.auth.getUser().then(res => {
      if (res.data.user?.user_metadata) {

        this.userData = res.data.user?.user_metadata as IUser;

        this.userForm.patchValue({
          username: this.userData.username,
          email: this.userData.email,
          phone: this.userData.phone,
        })
      }
    });
  }

  updateUserInfo() {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '70vw',
      data: this.userData
    })
    console.log(this.userData);

    dialogRef.afterClosed().subscribe(x => {
      this.userForm.value.username = x.data.user.user_metadata['username']
      this.userForm.value.email = x.data.user.user_metadata['email']
      this.userForm.value.phone = x.data.user.user_metadata['phone']
    })

  }

  logout() {
    this.dao.logout();
    this.router.navigateByUrl('login')
  }

  allClients() {
    this.router.navigateByUrl('all-clients')
  }
}
