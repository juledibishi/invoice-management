import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { DaoComunicatorService } from '../../../service/dao-comunicator.service';
import { IUserMetaData } from '../../../models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';

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
  user: IUserMetaData = {} as IUserMetaData;
  fb = inject(FormBuilder);


  userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
  })

  userName!: string;
  userData!: any;
  constructor(public dialog: MatDialog) {

  }
  ngOnInit(): void {

    this.dao.supabase.auth.getUser().then(res => {

      this.userName = res.data.user?.user_metadata['username']
      this.userData = res.data.user?.user_metadata
      if (this.userData) {
        this.userForm.patchValue({
          username: this.userData['username'] || '',
          email: this.userData['email'] || false,
        })
      }
    });
  }

  updateUserInfo() {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '70vw',
      data: this.userData
    })

    dialogRef.afterClosed().subscribe(() => {
      this.dao.supabase.auth.getUser().then(res => {
        this.userForm.value.username = res.data.user?.user_metadata['username']
        this.userForm.value.email = res.data.user?.user_metadata['email']
      })
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
