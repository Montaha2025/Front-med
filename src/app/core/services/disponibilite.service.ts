import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, of, tap } from 'rxjs';
import { DisponibiliteRequest, DisponibiliteResponse, DisponibiliteUpdateRequest } from '../models/disponibilite';

@Injectable({
  providedIn: 'root',
})
export class DisponibiliteService {
  private apiUrl = `${environment.apiUrl}/api/v1/disponibilites`;

  // Signal to store the list of disponibilites
  private _disponibilites = signal<DisponibiliteResponse[]>([]);
  public disponibilites = this._disponibilites;

  // Signal for loading and errors
  isLoading = signal<boolean>(false);
  authError = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Load all disponibilites
  loadAllDisponibilites(page: number = 0, size: number = 10): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .get<{ content: DisponibiliteResponse[] }>(
        `${this.apiUrl}?page=${page}&size=${size}`
      )
      .pipe(
        tap((response) => {
          this._disponibilites.set(response.content); // Update the disponibilites list
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading disponibilites'
          );
          this.isLoading.set(false);
          return of([]); // Return empty array on error
        })
      )
      .subscribe();
  }

  // Create a new disponibilite
  createDisponibilite(disponibiliteRequest: DisponibiliteRequest): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<DisponibiliteResponse>(this.apiUrl, disponibiliteRequest)
      .pipe(
        tap((newDisponibilite) => {
          this._disponibilites.update((disponibilites) => [
            ...disponibilites,
            newDisponibilite,
          ]);
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error creating disponibilite'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Update a disponibilite
  updateDisponibilite(
    disponibiliteId: number,
    disponibiliteUpdateRequest: DisponibiliteUpdateRequest
  ): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .put<void>(`${this.apiUrl}/${disponibiliteId}`, disponibiliteUpdateRequest)
      .pipe(
        tap(() => {
          this._disponibilites.update((disponibilites) =>
            disponibilites.map((disponibilite) =>
              disponibilite.id === disponibiliteId
                ? { ...disponibilite, ...disponibiliteUpdateRequest }
                : disponibilite
            )
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error updating disponibilite'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Delete a disponibilite
  deleteDisponibilite(disponibiliteId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .delete<void>(`${this.apiUrl}/${disponibiliteId}`)
      .pipe(
        tap(() => {
          this._disponibilites.update((disponibilites) =>
            disponibilites.filter(
              (disponibilite) => disponibilite.id !== disponibiliteId
            )
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error deleting disponibilite'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Get disponibilite by ID
  getDisponibiliteById(disponibiliteId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .get<DisponibiliteResponse>(`${this.apiUrl}/disponibilite/${disponibiliteId}`)
      .pipe(
        tap((disponibilite) => {
          // Logic to handle the single disponibilite if necessary
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading disponibilite'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign disponibilite to medecin
  assignDisponibiliteToMedecin(
    medecinId: number,
    disponibiliteId: number
  ): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<DisponibiliteResponse>(`${this.apiUrl}/${medecinId}/disponibilites/${disponibiliteId}`, {})
      .pipe(
        tap((assignedDisponibilite) => {
          this._disponibilites.update((disponibilites) =>
            disponibilites.map((disponibilite) =>
              disponibilite.id === assignedDisponibilite.id
                ? assignedDisponibilite
                : disponibilite
            )
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning disponibilite to medecin'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }
}

