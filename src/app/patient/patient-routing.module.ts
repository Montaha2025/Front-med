import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientLayoutComponent } from '../layouts/patient-layout/patient-layout.component'; // adapte le chemin
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { PatientProfileComponent } from './components/patient-profile/patient-profile.component';

const routes: Routes = [
  {
    path: '',
    component: PatientLayoutComponent,
    children: [
      { path: 'dashboard', component: PatientDashboardComponent },
      { path: 'profile', component: PatientProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }

