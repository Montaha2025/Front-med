import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component'; 
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // Layout commun à toutes les routes admin
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // redirection par défaut
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
