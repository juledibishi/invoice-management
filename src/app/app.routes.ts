import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { UserDataComponent } from './components/feature/user-data/user-data.component';
import { authGuard } from './components/auth/auth.guard';
import { RegisterComponent } from './components/auth/register/register.component';
import { AllClientsComponent } from './components/feature/all-clients/all-clients.component';
import { InvoicePrintComponent } from './components/feature/invoice-print/invoice-print.component';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'user-data', component: UserDataComponent, canActivate: [authGuard] },
    { path: 'all-clients', component: AllClientsComponent, canActivate: [authGuard] },
    { path: 'invoice-print', component: InvoicePrintComponent },
    { path: "**", redirectTo: 'login', pathMatch: 'full' },
];
