import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationResponse } from '../models/AuthenticationResponse';
import { Observable, catchError, finalize, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _token = signal<string | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  token = this._token;
  error = this._error;
  loading = this._loading;

  isAuthenticated = computed(() => this._token() !== null);

  constructor(private http: HttpClient) {
    // Charger le token depuis le localStorage au démarrage
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      this._token.set(storedToken);
    }
    effect(() => {
      console.log('Authentifié ?', this.isAuthenticated());
    });
  }
  getToken(): string | null {
  return this._token();
}


  login(email: string, motDePasse: string): Observable<AuthenticationResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<AuthenticationResponse>('http://localhost:8082/api/v1/auth/login', {
      email,
      motDePasse,
    }).pipe(
      map((res) => {
        this._token.set(res.token);
        localStorage.setItem('jwtToken', res.token); // Sauvegarder le token dans localStorage
        return res;
      }),
      catchError((error) => {
        this._error.set('Identifiants invalides');
        return [] as AuthenticationResponse[]; // Return empty array on error to keep the flow consistent
      }),
      finalize(() => this._loading.set(false))
    );
  }

  logout() {
    this._token.set(null); // Effacer le Token en Mémoire
    localStorage.removeItem('jwtToken'); // Supprimer le Token de localStorage
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload); // base64 decode
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Erreur de décodage du token', e);
      return null;
    }
  }

  getRoleFromToken(): string | null {
    const token = this._token();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }

  register(data: {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    age: number;
    telephone: string;
    adresse: string;
  }): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>('http://localhost:8082/api/v1/auth/signup', data);
  }
  

getIdFromToken(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  // Décode le token
  const decoded: any = this.decodeToken(token);
  
  // Récupère l'ID depuis le champ 'id'
  return decoded?.id ?? null;
}


  isAuthenticated$ = toObservable(this.isAuthenticated);
}







