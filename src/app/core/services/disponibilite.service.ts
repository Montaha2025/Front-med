import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  private _isLoading = signal<boolean>(false);
  private _authError = signal<string | null>(null);

  // Public computed getters
  disponibilites = computed(() => this._disponibilites());
  isLoading = computed(() => this._isLoading());
  authError = computed(() => this._authError());

  constructor(private http: HttpClient) {}

  // Load all disponibilites
  loadAllDisponibilites(page: number = 0, size: number = 10): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<{ content: DisponibiliteResponse[] }>(
        `${this.apiUrl}?page=${page}&size=${size}`
      )
      .pipe(
        tap((response) => {
          this._disponibilites.set(response.content); // Update the disponibilites list
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(
            error?.error?.message || 'Error loading disponibilites'
          );
          this._isLoading.set(false);
          return of([]); // Return empty array on error
        })
      )
      .subscribe();
  }

  // Create a new disponibilite
  createDisponibilite(disponibiliteRequest: DisponibiliteRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<DisponibiliteResponse>(this.apiUrl, disponibiliteRequest)
      .pipe(
        tap((newDisponibilite) => {
          this._disponibilites.update((disponibilites) => [
            ...disponibilites,
            newDisponibilite,
          ]);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(
            error?.error?.message || 'Error creating disponibilite'
          );
          this._isLoading.set(false);
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
    this._isLoading.set(true);
    this._authError.set(null);
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
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(
            error?.error?.message || 'Error updating disponibilite'
          );
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Delete a disponibilite
  deleteDisponibilite(disponibiliteId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .delete<void>(`${this.apiUrl}/${disponibiliteId}`)
      .pipe(
        tap(() => {
          this._disponibilites.update((disponibilites) =>
            disponibilites.filter(
              (disponibilite) => disponibilite.id !== disponibiliteId
            )
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(
            error?.error?.message || 'Error deleting disponibilite'
          );
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Get disponibilite by ID
  getDisponibiliteById(disponibiliteId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<DisponibiliteResponse>(`${this.apiUrl}/disponibilite/${disponibiliteId}`)
      .pipe(
        tap((disponibilite) => {
          // Logic to handle the single disponibilite if necessary
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(
            error?.error?.message || 'Error loading disponibilite'
          );
          this._isLoading.set(false);
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
    this._isLoading.set(true);
    this._authError.set(null);
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
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(
            error?.error?.message || 'Error assigning disponibilite to medecin'
          );
          this._isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }
}


