



import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authenticationService.getToken();
    const rolesAttendus: string[] = route.data['roles'] || [];  // Récupère les rôles attendus
    const roleUtilisateur = this.authenticationService.getRoleFromToken() || '';
  
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




