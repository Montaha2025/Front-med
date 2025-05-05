import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, of, tap } from 'rxjs';
import { ReclamationRequest, ReclamationResponse } from '../models/reclamation';

@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  private apiUrl = `${environment.apiUrl}/api/v1/reclamations`;

  // Signal to store the list of reclamations
  private _reclamations = signal<ReclamationResponse[]>([]);
  public reclamations = this._reclamations;

  // Signal for loading and errors
  isLoading = signal<boolean>(false);
  authError = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Load all reclamations
  loadAllReclamations(page: number = 0, size: number = 10): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .get<{ content: ReclamationResponse[] }>(
        `${this.apiUrl}?page=${page}&size=${size}`
      )
      .pipe(
        tap((response) => {
          this._reclamations.set(response.content); // Update the reclamations list
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading reclamations'
          );
          this.isLoading.set(false);
          return of([]); // Return empty array on error
        })
      )
      .subscribe();
  }

  // Create a new reclamation
  createReclamation(reclamationRequest: ReclamationRequest): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<ReclamationResponse>(this.apiUrl, reclamationRequest)
      .pipe(
        tap((newReclamation) => {
          this._reclamations.update((reclamations) => [
            ...reclamations,
            newReclamation,
          ]);
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error creating reclamation'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign reclamation to a doctor
  assignReclamationToMedecin(medecinId: number, reclamationId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
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
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning reclamation to doctor'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign reclamation to a patient
  assignReclamationToPatient(patientId: number, reclamationId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
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
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning reclamation to patient'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }
}
