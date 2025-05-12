import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, of, tap } from 'rxjs';
import { ReclamationRequest, ReclamationResponse } from '../models/reclamation';

@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  private apiUrl = `${environment.apiUrl}/api/v1/reclamations`;

  // Private signals to store the data
  private _reclamations = signal<ReclamationResponse[]>([]);
  private _authError = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);

  // Public computed getters
  public reclamations = computed(() => this._reclamations());
  public authError = computed(() => this._authError());
  public isLoading = computed(() => this._isLoading());

  constructor(private http: HttpClient) {}

  // Load all reclamations
  loadAllReclamations(page: number = 0, size: number = 10): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<{ content: ReclamationResponse[] }>(`${this.apiUrl}?page=${page}&size=${size}`)
      .pipe(
        tap((response) => {
          this._reclamations.set(response.content); // Update the reclamations list
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors du chargement des réclamations');
          this._isLoading.set(false);
          return of([]); // Return empty array on error
        })
      )
      .subscribe();
  }

  // Create a new reclamation
  createReclamation(reclamationRequest: ReclamationRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<ReclamationResponse>(this.apiUrl, reclamationRequest)
      .pipe(
        tap((newReclamation) => {
          this._reclamations.update((reclamations) => [
            ...reclamations,
            newReclamation,
          ]);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la création de réclamation');
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign reclamation to a doctor
  assignReclamationToMedecin(medecinId: number, reclamationId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<ReclamationResponse>(
        `${this.apiUrl}/${medecinId}/reclamations/${reclamationId}`,
        {}
      )
      .pipe(
        tap((updatedReclamation) => {
          this._reclamations.update((reclamations) =>
            reclamations.map((r) =>
              r.id === updatedReclamation.id ? updatedReclamation : r
            )
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(
            error?.error?.message || 'Erreur lors de l’attribution de réclamation au médecin '
          );
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign reclamation to a patient
  assignReclamationToPatient(patientId: number, reclamationId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<ReclamationResponse>(
        `${this.apiUrl}/${patientId}/reclamations/${reclamationId}`,
        {}
      )
      .pipe(
        tap((updatedReclamation) => {
          this._reclamations.update((reclamations) =>
            reclamations.map((r) =>
              r.id === updatedReclamation.id ? updatedReclamation : r
            )
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(
            error?.error?.message || 'Erreur lors de l’attribution de réclamation au patient'
          );
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }
}
