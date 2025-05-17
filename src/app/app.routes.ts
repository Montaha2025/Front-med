import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './extrapages/page404/page404.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { UnauthorizedComponent } from './extrapages/unauthorized/unauthorized.component';

export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () =>
            import("./account/account.module").then((m) => m.AccountModule),
    },
    {
        path: "",
        component: LayoutComponent,
        loadChildren: () =>
            import("./pages/pages.module").then((m) => m.PagesModule),
        canActivate: [AuthGuard],
    },
    {
        path: "pages",
        loadChildren: () =>
            import("./extrapages/extrapages.module").then((m) => m.ExtrapagesModule),
        canActivate: [AuthGuard],
    },
    
    { path: "crypto-ico-landing", component: CyptolandingComponent },
    

    {
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  canActivate: [AuthGuard],
  data: { roles: ['ROLE_ADMIN'] }
},
{
  path: 'medecin',
  loadChildren: () => import('./medecin/medecin.module').then(m => m.MedecinModule),
  canActivate: [AuthGuard],
  data: { roles: ['ROLE_MEDECIN'] }
},
{
  path: 'patient',
  loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
  canActivate: [AuthGuard],
  data: { roles: ['ROLE_PATIENT'] }
},
{ path: 'unauthorized', component: UnauthorizedComponent },

 { path: "**", component: Page404Component }

      
];

