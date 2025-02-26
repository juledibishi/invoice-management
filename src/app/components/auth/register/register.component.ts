import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { DaoComunicatorService } from '../../../service/dao-comunicator.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  fb = inject(FormBuilder)
  router = inject(Router);
  http = inject(HttpClient);
  authService = inject(AuthService);
  dao = inject(DaoComunicatorService)


  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });


  constructor(private toast: NgToastService) { }

  register() {
    const rawForm = this.form.getRawValue();

    this.dao.register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe((result) => {
        if (result.error) {
          this.toast.danger(result.error.message)
        } else {
          this.toast.success('Regjistrimi u bë me sukses!')
          this.router.navigateByUrl('login')
        }
      })
  }
}
