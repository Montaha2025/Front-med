import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, of, tap } from 'rxjs';
import { RappelRequest, RappelResponse, RappelUpdateRequest } from '../models/rappel';

@Injectable({
  providedIn: 'root',
})
export class RappelService {
  private apiUrl = `${environment.apiUrl}/api/v1/rappels`;

  // Private signals to store the data
  private _rappels = signal<RappelResponse[]>([]);
  private _authError = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);

  // Public computed getters
  public rappels = computed(() => this._rappels());
  public authError = computed(() => this._authError());
  public isLoading = computed(() => this._isLoading());

  constructor(private http: HttpClient) {}

  // Load all rappels
  loadAllRappels(page: number = 0, size: number = 10): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<{ content: RappelResponse[] }>(`${this.apiUrl}?page=${page}&size=${size}`)
      .pipe(
        tap((response) => {
          this._rappels.set(response.content); // Update the rappels list
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors du chargement des rappels');
          this._isLoading.set(false);
          return of([]); // Return empty array on error
        })
      )
      .subscribe();
  }

  // Create a new rappel
  createRappel(rappelRequest: RappelRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<RappelResponse>(this.apiUrl, rappelRequest)
      .pipe(
        tap((newRappel) => {
          this._rappels.update((rappels) => [...rappels, newRappel]);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la création de rappel');
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Update an existing rappel
  updateRappel(rappelId: number, rappelUpdateRequest: RappelUpdateRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .put<RappelResponse>(`${this.apiUrl}/${rappelId}`, rappelUpdateRequest)
      .pipe(
        tap((updatedRappel) => {
          this._rappels.update((rappels) =>
            rappels.map((rappel) =>
              rappel.id === updatedRappel.id ? updatedRappel : rappel
            )
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la mise à jour de rappel');
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Delete a rappel
  deleteRappel(rappelId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .delete<void>(`${this.apiUrl}/${rappelId}`)
      .pipe(
        tap(() => {
          this._rappels.update((rappels) =>
            rappels.filter((rappel) => rappel.id !== rappelId)
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la suppression de rappel');
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Find a rappel by ID
  findRappelById(rappelId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<RappelResponse>(`${this.apiUrl}/Rappel/${rappelId}`)
      .pipe(
        tap((rappel) => {
          // Logic to handle a single rappel if necessary
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors du chargement de rappel');
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign rappel to patient
  assignRappelToPatient(patientId: number, rappelId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<RappelResponse>(`${this.apiUrl}/${patientId}/rappels/${rappelId}`, {})
      .pipe(
        tap((assignedRappel) => {
          this._rappels.update((rappels) =>
            rappels.map((rappel) =>
              rappel.id === assignedRappel.id ? assignedRappel : rappel
            )
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de l’attribution de rappel au patient');
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign rappel to medecin
  assignRappelToMedecin(medecinId: number, rappelId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<RappelResponse>(`${this.apiUrl}/medecins/${medecinId}/rappels/${rappelId}`, {})
      .pipe(
        tap((assignedRappel) => {
          this._rappels.update((rappels) =>
            rappels.map((rappel) =>
              rappel.id === assignedRappel.id ? assignedRappel : rappel
            )
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de l’attribution de rappel au médecin');
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }
}

