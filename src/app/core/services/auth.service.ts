import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthenticationResponse } from '../models/AuthenticationResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  getToken(): string | null {
    return this._token();
  }
  
 
  private _token = signal<string | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  token = this._token;
  error = this._error;
  
  loading = this._loading;
  isAuthenticated = computed(() => this._token() !== null);

  constructor(private http: HttpClient) {
    effect(() => {
      console.log('Authentifié ?', this.isAuthenticated());
    });
  }

  login(email: string, motDePasse: string) {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .post<AuthenticationResponse>('http://localhost:8082/api/v1/auth/login', {
        email,
        motDePasse,
      })
      .subscribe({
        next: (res) => {
          this._token.set(res.token);
        },
        error: () => {
          this._error.set('Identifiants invalides');
        },
        complete: () => this._loading.set(false),
      });
  }

  logout() {
    this._token.set(null);
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
  

  isAuthenticated$ = toObservable(this.isAuthenticated);
}






