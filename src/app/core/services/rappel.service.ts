import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, of, tap } from 'rxjs';
import { RappelRequest, RappelResponse, RappelUpdateRequest } from '../models/rappel';

@Injectable({
  providedIn: 'root',
})
export class RappelService {
  private apiUrl = `${environment.apiUrl}/api/v1/rappels`;

  // Signal to store the list of rappels
  private _rappels = signal<RappelResponse[]>([]);
  public rappels = this._rappels;

  // Signal for loading and errors
  isLoading = signal<boolean>(false);
  authError = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Load all rappels
  loadAllRappels(page: number = 0, size: number = 10): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .get<{ content: RappelResponse[] }>(
        `${this.apiUrl}?page=${page}&size=${size}`
      )
      .pipe(
        tap((response) => {
          this._rappels.set(response.content); // Update the rappels list
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading rappels'
          );
          this.isLoading.set(false);
          return of([]); // Return empty array on error
        })
      )
      .subscribe();
  }

  // Create a new rappel
  createRappel(rappelRequest: RappelRequest): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<RappelResponse>(this.apiUrl, rappelRequest)
      .pipe(
        tap((newRappel) => {
          this._rappels.update((rappels) => [...rappels, newRappel]);
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error creating rappel'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Update an existing rappel
  updateRappel(rappelId: number, rappelUpdateRequest: RappelUpdateRequest): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .put<RappelResponse>(`${this.apiUrl}/${rappelId}`, rappelUpdateRequest)
      .pipe(
        tap((updatedRappel) => {
          this._rappels.update((rappels) =>
            rappels.map((rappel) =>
              rappel.id === updatedRappel.id ? updatedRappel : rappel
            )
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error updating rappel'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Delete a rappel
  deleteRappel(rappelId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .delete<void>(`${this.apiUrl}/${rappelId}`)
      .pipe(
        tap(() => {
          this._rappels.update((rappels) =>
            rappels.filter((rappel) => rappel.id !== rappelId)
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error deleting rappel'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Find a rappel by ID
  findRappelById(rappelId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .get<RappelResponse>(`${this.apiUrl}/Rappel/${rappelId}`)
      .pipe(
        tap((rappel) => {
          // Logic to handle a single rappel if necessary
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading rappel'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign rappel to patient
  assignRappelToPatient(patientId: number, rappelId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<RappelResponse>(`${this.apiUrl}/${patientId}/rappels/${rappelId}`, {})
      .pipe(
        tap((assignedRappel) => {
          this._rappels.update((rappels) =>
            rappels.map((rappel) =>
              rappel.id === assignedRappel.id ? assignedRappel : rappel
            )
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning rappel to patient'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign rappel to medecin
  assignRappelToMedecin(medecinId: number, rappelId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<RappelResponse>(`${this.apiUrl}/medecins/${medecinId}/rappels/${rappelId}`, {})
      .pipe(
        tap((assignedRappel) => {
          this._rappels.update((rappels) =>
            rappels.map((rappel) =>
              rappel.id === assignedRappel.id ? assignedRappel : rappel
            )
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning rappel to medecin'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }
}
