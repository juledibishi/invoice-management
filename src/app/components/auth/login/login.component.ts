import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { DaoComunicatorService } from '../../../service/dao-comunicator.service';
import { NgToastService } from 'ng-angular-popup'
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  dao = inject(DaoComunicatorService)


  loginForm = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(private toast: NgToastService) { }

  login() {
    const rawForm = this.loginForm.getRawValue();

    this.dao.login(rawForm.email, rawForm.password)
      .subscribe((result) => {
        if (result.error) {
          this.toast.danger('Email ose fjalëkalimi janë të pasakta!');
        } else {
          if (rawForm.email === 'bujaminmustafi0@gmail.com') {
            this.dao.tableName.set('BujaminClient')
            localStorage.setItem('client', 'BujaminClient')
          }
          if (rawForm.email === 'nuri.ramadani2025@gmail.com') {
            this.dao.tableName.set('NuriClient')
            localStorage.setItem('client', 'NuriClient')
          }
          if (rawForm.email === 'juled.ibishi@gmail.com') {
            this.dao.tableName.set('JuledClient')
            localStorage.setItem('client', 'JuledClient')
          }
          this.router.navigateByUrl('user-data')
        }
      })
  }
}
