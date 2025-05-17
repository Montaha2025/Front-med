import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedecinLayoutComponent } from '../layouts/medecin-layout/medecin-layout.component'; // adapte le chemin
import { MedecinDashboardComponent } from './components/medecin-dashboard/medecin-dashboard.component';
import { MedecinProfileComponent } from './components/medecin-profile/medecin-profile.component';

const routes: Routes = [
  {
    path: '',
    component: MedecinLayoutComponent,
    children: [
      { path: 'dashboard', component: MedecinDashboardComponent },
      { path: 'profile', component: MedecinProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedecinRoutingModule { }
