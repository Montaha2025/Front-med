import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, of, tap } from 'rxjs';
import { SuiviRequest, SuiviResponse } from '../models/suivi';

@Injectable({
  providedIn: 'root',
})
export class SuiviService {
  private apiUrl = `${environment.apiUrl}/api/v1/suivis`;

  // Signal pour stocker la liste des suivis
  private _suivis = signal<SuiviResponse[]>([]);
  public suivis = this._suivis; // Public pour accès à la liste des suivis

  // Signal pour l'état de chargement et les erreurs
  isLoading = signal<boolean>(false); // Signal pour savoir si c'est en chargement
  authError = signal<string | null>(null); // Signal pour afficher les erreurs

  constructor(private http: HttpClient) {}

  // Charger tous les suivis par patient
  loadSuivisByPatientId(patientId: number, page: number = 0, size: number = 10): void {
    this.isLoading.set(true);  // Définir en état de chargement
    this.authError.set(null);   // Réinitialiser l'erreur
    this.http
      .get<{ content: SuiviResponse[] }>(
        `${this.apiUrl}/patients/${patientId}/suivis?page=${page}&size=${size}`
      )
      .pipe(
        tap((response) => {
          this._suivis.set(response.content); // Mettre à jour les suivis avec le résultat
          this.isLoading.set(false); // Fin du chargement
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading suivis'
          );
          this.isLoading.set(false); // Fin du chargement
          return of([]); // Retourner un tableau vide en cas d'erreur
        })
      )
      .subscribe(); // Souscrire à l'Observable
  }

  // Charger tous les suivis par médecin
  loadSuivisByMedecinId(medecinId: number, page: number = 0, size: number = 10): void {
    this.isLoading.set(true);  // Définir en état de chargement
    this.authError.set(null);   // Réinitialiser l'erreur
    this.http
      .get<{ content: SuiviResponse[] }>(
        `${this.apiUrl}/medecins/${medecinId}/suivis?page=${page}&size=${size}`
      )
      .pipe(
        tap((response) => {
          this._suivis.set(response.content); // Mettre à jour les suivis avec le résultat
          this.isLoading.set(false); // Fin du chargement
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading suivis for doctor'
          );
          this.isLoading.set(false); // Fin du chargement
          return of([]); // Retourner un tableau vide en cas d'erreur
        })
      )
      .subscribe(); // Souscrire à l'Observable
  }

  // Créer un suivi
  createSuivi(request: SuiviRequest): void {
    this.isLoading.set(true);  // Mettre en état de chargement
    this.authError.set(null);   // Réinitialiser l'erreur
    this.http
      .post<SuiviResponse>(this.apiUrl, request)
      .pipe(
        tap((newSuivi) => {
          this._suivis.update((suivis) => [...suivis, newSuivi]); // Ajouter le nouveau suivi
          this.isLoading.set(false); // Fin du chargement
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error creating suivi'
          );
          this.isLoading.set(false); // Fin du chargement
          return of(null); // Retourner null en cas d'erreur
        })
      )
      .subscribe(); // Souscrire à l'Observable
  }

  // Mettre à jour un suivi
  updateSuivi(suiviId: number, request: SuiviRequest): void {
    this.isLoading.set(true);  // Mettre en état de chargement
    this.authError.set(null);   // Réinitialiser l'erreur
    this.http
      .put<SuiviResponse>(`${this.apiUrl}/${suiviId}`, request)
      .pipe(
        tap((updatedSuivi) => {
          this._suivis.update((suivis) =>
            suivis.map((suivi) =>
              suivi.id === updatedSuivi.id ? updatedSuivi : suivi
            )
          );
          this.isLoading.set(false); // Fin du chargement
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error updating suivi'
          );
          this.isLoading.set(false); // Fin du chargement
          return of(null); // Retourner null en cas d'erreur
        })
      )
      .subscribe(); // Souscrire à l'Observable
  }

  // Supprimer un suivi
  deleteSuivi(suiviId: number): void {
    this.isLoading.set(true);  // Mettre en état de chargement
    this.authError.set(null);   // Réinitialiser l'erreur
    this.http
      .delete<void>(`${this.apiUrl}/${suiviId}`)
      .pipe(
        tap(() => {
          this._suivis.update((suivis) =>
            suivis.filter((suivi) => suivi.id !== suiviId)
          ); // Supprimer le suivi de la liste
          this.isLoading.set(false); // Fin du chargement
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error deleting suivi'
          );
          this.isLoading.set(false); // Fin du chargement
          return of(null); // Retourner null en cas d'erreur
        })
      )
      .subscribe(); // Souscrire à l'Observable
  }

  // Assigner un suivi à un médecin
  assignSuiviToMedecin(suiviId: number, medecinId: number): void {
    this.isLoading.set(true);  // Mettre en état de chargement
    this.authError.set(null);   // Réinitialiser l'erreur
    this.http
      .post<SuiviResponse>(
        `${this.apiUrl}/${suiviId}/medecin/${medecinId}`,
        {}
      )
      .pipe(
        tap((updatedSuivi) => {
          this._suivis.update((suivis) =>
            suivis.map((suivi) =>
              suivi.id === updatedSuivi.id ? updatedSuivi : suivi
            )
          );
          this.isLoading.set(false); // Fin du chargement
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning suivi to medecin'
          );
          this.isLoading.set(false); // Fin du chargement
          return of(null); // Retourner null en cas d'erreur
        })
      )
      .subscribe(); // Souscrire à l'Observable
  }

  // Assigner un suivi à un patient
  assignSuiviToPatient(suiviId: number, patientId: number): void {
    this.isLoading.set(true);  // Mettre en état de chargement
    this.authError.set(null);   // Réinitialiser l'erreur
    this.http
      .post<SuiviResponse>(
        `${this.apiUrl}/${suiviId}/patient/${patientId}`,
        {}
      )
      .pipe(
        tap((updatedSuivi) => {
          this._suivis.update((suivis) =>
            suivis.map((suivi) =>
              suivi.id === updatedSuivi.id ? updatedSuivi : suivi
            )
          );
          this.isLoading.set(false); // Fin du chargement
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning suivi to patient'
          );
          this.isLoading.set(false); // Fin du chargement
          return of(null); // Retourner null en cas d'erreur
        })
      )
      .subscribe(); // Souscrire à l'Observable
  }
}


