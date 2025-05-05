// import { Injectable } from '@angular/core';
// import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// // Auth Services
// import { AuthenticationService } from '../services/auth.service';
// import { AuthfakeauthenticationService } from '../services/authfake.service';
// import { environment } from '../../../environments/environment';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//     constructor(
//         private router: Router,
//         private authenticationService: AuthenticationService,
//         private authFackservice: AuthfakeauthenticationService
//     ) { }

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

//         if (environment.defaultauth === 'firebase') {
//             const currentUser = this.authenticationService.currentUser();
//             if (currentUser) {
//                 // logged in so return true
//                 return true;
//             }
//         } else {
//             const currentUser = this.authFackservice.currentUserValue;
//             if (currentUser) {
//                 // logged in so return true
//                 return true;
//             }
//             // check if user data is in storage is logged in via API.
//             if (localStorage.getItem('currentUser')) {
//                 return true;
//             }
//         }
//         // not logged in so redirect to login page with the return url
//         this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
//         return false;
//     }
// }



import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authenticationService.getToken();
    const rolesAttendus: string[] = route.data['roles'] || []; // Récupère les rôles attendus
    const roleUtilisateur: string = this.authenticationService.getUserRole(); // Récupère le rôle de l'utilisateur

    if (!token) {
      // Rediriger vers la page de login si aucun token
      this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (rolesAttendus.length && !rolesAttendus.includes(roleUtilisateur)) {
      // Rediriger si le rôle de l'utilisateur ne correspond pas aux rôles attendus
      this.router.navigate(['/unauthorized']); 
      return false;
    }

    return true;
  }
}




