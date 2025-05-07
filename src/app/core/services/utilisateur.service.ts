import { computed, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Utilisateur, UtilisateurRequest, UtilisateurResponse } from '../models/utilisateur';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { ChangeMotDePasseRequest } from '../models/change-mot-de-passe-request';
import { UtilisateurUpdateRequest } from '../models/utilisateur-update-request';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/utilisateurs`;
  


// Private signals
private _utilisateurs = signal<Utilisateur[]>([]);
private _utilisateur = signal<UtilisateurResponse | null>(null);
private _authError = signal<string | null>(null);
private _isLoading = signal<boolean>(false);

// Public computed getters
utilisateurs = computed(() => this._utilisateurs());
utilisateur = computed(() => this._utilisateur());
authError = computed(() => this._authError());
isLoading = computed(() => this._isLoading());


  constructor(private http: HttpClient) { }
  
   // Charger tous les utilisateurs
  loadUtilisateurs(page: number = 0, size: number = 10) {
    this._isLoading.set(true);
    this._authError.set(null);
  
    this.http.get<{ content: Utilisateur[] }>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
      tap((response) => {
        this._utilisateurs.set(response.content);
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de la récupération des utilisateurs');
        this._isLoading.set(false);
        return of([]);
      })
    ).subscribe();
  }
  


  
  // Créer un nouvel utilisateur
  createUtilisateur(request: UtilisateurRequest) {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http.post<UtilisateurResponse>(`${this.apiUrl}/create`, request).pipe(
      tap((response) => {
        this._utilisateurs.update((utilisateurs) => [...utilisateurs, response]); //Si succès : l’ajoute dans _utilisateurs
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de la création de l\'utilisateur'); //Sinon : affiche l'erreur dans authError
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Mettre à jour un utilisateur
  updateUtilisateur(id: number, request: UtilisateurUpdateRequest) {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http.put(`${this.apiUrl}/${id}`, request).pipe(
      tap(() => {
        this._utilisateurs.update((utilisateurs) =>
          utilisateurs.map((utilisateur) => utilisateur.id === id ? { ...utilisateur, ...request } : utilisateur)
        );
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Supprimer un utilisateur
  deleteUtilisateur(id: number) {
    this._isLoading.set(true);
    this._authError.set(null);
    //Supprime un utilisateur via DELETE /utilisateurs/{id}.
    this.http.delete(`${this.apiUrl}/${id}`).pipe(
    
      tap(() => {
        this._utilisateurs.update((utilisateurs) => utilisateurs.filter((utilisateur) => utilisateur.id !== id)); //Met à jour _utilisateurs en retirant cet utilisateur.
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de la suppression de l\'utilisateur');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  } 
  // récuperer un utilisateur spécifique


findUtilisateurById(id: number) {
  this._isLoading.set(true);
  this._authError.set(null);

  this.http.get<UtilisateurResponse>(`${this.apiUrl}/${id}`).pipe(
    tap((response) => {
      this._utilisateur.set(response);
      this._isLoading.set(false);
    }),
    catchError((error) => {
      this._authError.set(error?.error?.message || 'Utilisateur introuvable');
      this._utilisateur.set(null);
      this._isLoading.set(false);
      return of(null);
    })
  ).subscribe();
}

  // Changer le mot de passe de l'utilisateur
changeMotDePasse(request: ChangeMotDePasseRequest) {
  this._isLoading.set(true);
  this._authError.set(null);

  // Appel HTTP PUT pour changer le mot de passe
  this.http.put(`${this.apiUrl}/changer-mot-de-passe`, request).pipe(
    tap(() => {
      
      this._isLoading.set(false);
    }),
    catchError((error) => {
      this._authError.set(error?.error?.message || 'Erreur lors du changement de mot de passe');
      this._isLoading.set(false);
      return of(null);
    })
  ).subscribe();
}


  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }


}
