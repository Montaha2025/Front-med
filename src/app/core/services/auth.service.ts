import { Injectable, signal } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { environment } from 'src/environments/environment'; 
import { catchError, tap } from 'rxjs/operators'; 
import { Observable, of } from 'rxjs'; 
import { AuthenticationResponse } from '../models/AuthenticationResponse'; 
import { AuthenticationRequest } from '../models/AuthenticationRequest'; 

// Le décorateur Injectable permet de rendre ce service injectable dans d'autres parties de l'application
@Injectable({
  providedIn: 'root' 
})
export class AuthenticationService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getUserRole(): string | null {
    return localStorage.getItem('roles'); // ou 'role', selon ton backend
  }
  
  saveUserRoles(roles: any): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }
  
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  
  // Déclaration de l'URL de l'API à utiliser pour les requêtes d'authentification
  private readonly apiUrl = `${environment.apiUrl}/api/v1/auth`;

  // Déclaration des signals pour la gestion d'état dans le service
  authResponse = signal<AuthenticationResponse | null>(null); // Signal pour stocker la réponse de l'authentification
  authError = signal<string | null>(null); // Signal pour stocker les erreurs d'authentification
  isLoading = signal<boolean>(false); // Signal pour indiquer si une requête est en cours de chargement

  constructor(private http: HttpClient) {} 

 // Méthode de login : prend une requête d'authentification et effectue la connexion
 login(request: AuthenticationRequest): Observable<AuthenticationResponse | null> {
  this.isLoading.set(true); 
  this.authError.set(null); 

  return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, request).pipe(
    tap((response) => {
      this.authResponse.set(response); 
      this.isLoading.set(false); 
      localStorage.setItem('token', response.token); 
    }),
    catchError((error) => {
      this.authError.set(error?.error?.message || 'Erreur lors de la connexion'); 
      this.isLoading.set(false); 
      return of(null); // Retourne un Observable avec null en cas d'erreur
    })
  );}

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    this.authResponse.set(null); 
    localStorage.removeItem('token'); 
  }

  // Méthode pour vérifier si l'utilisateur est authentifié (en fonction de la présence du token)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); 
  }
}





