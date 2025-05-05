import { Injectable, signal } from '@angular/core';
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
  private _utilisateurs = signal<Utilisateur[]>([]);  // Liste des utilisateurs
  utilisateurs = this._utilisateurs;

  // Signal pour la gestion des erreurs
  authError = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) { }
  
   // Charger tous les utilisateurs
   loadUtilisateurs(page: number = 0, size: number = 10) {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http.get<{ content: Utilisateur[] }>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
      tap((response) => {
        this._utilisateurs.set(response.content);  // Met à jour la liste des utilisateurs
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.authError.set(error?.error?.message || 'Erreur lors de la récupération des utilisateurs');
        this.isLoading.set(false);
        return of([]);
      })
    ).subscribe();
  }
  
  // Créer un nouvel utilisateur
  createUtilisateur(request: UtilisateurRequest) {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http.post<UtilisateurResponse>(`${this.apiUrl}/create`, request).pipe(
      tap((response) => {
        this._utilisateurs.update((utilisateurs) => [...utilisateurs, response]);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.authError.set(error?.error?.message || 'Erreur lors de la création de l\'utilisateur');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Mettre à jour un utilisateur
  updateUtilisateur(id: number, request: UtilisateurUpdateRequest) {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http.put(`${this.apiUrl}/${id}`, request).pipe(
      tap(() => {
        this._utilisateurs.update((utilisateurs) =>
          utilisateurs.map((utilisateur) => utilisateur.id === id ? { ...utilisateur, ...request } : utilisateur)
        );
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.authError.set(error?.error?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Supprimer un utilisateur
  deleteUtilisateur(id: number) {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._utilisateurs.update((utilisateurs) => utilisateurs.filter((utilisateur) => utilisateur.id !== id));
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.authError.set(error?.error?.message || 'Erreur lors de la suppression de l\'utilisateur');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  } 
  // Changer le mot de passe de l'utilisateur
changeMotDePasse(request: ChangeMotDePasseRequest) {
  this.isLoading.set(true);
  this.authError.set(null);

  // Appel HTTP PUT pour changer le mot de passe
  this.http.put(`${this.apiUrl}/changer-mot-de-passe`, request).pipe(
    tap(() => {
      // On peut ici gérer le changement d'état ou d'autres actions si besoin
      this.isLoading.set(false);
    }),
    catchError((error) => {
      this.authError.set(error?.error?.message || 'Erreur lors du changement de mot de passe');
      this.isLoading.set(false);
      return of(null);
    })
  ).subscribe();
}


  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }




}
