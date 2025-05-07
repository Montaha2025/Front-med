import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, of, tap } from 'rxjs';
import { RendezVousRequest, RendezVousResponse, RendezVousUpdateRequest } from '../models/rendez-vous';
import { Page } from '../models/page.interface';

@Injectable({
  providedIn: 'root',
})
export class RendezVousService {
  private apiUrl = `${environment.apiUrl}/api/v1/rendezvous`;

  // Private signals to store data
  private _rendezVous = signal<RendezVousResponse | null>(null);
  private _rendezVousList = signal<Page<RendezVousResponse> | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public computed getters
  public rendezVous = computed(() => this._rendezVous());
  public rendezVousList = computed(() => this._rendezVousList());
  public isLoading = computed(() => this._isLoading());
  public error = computed(() => this._error());

  constructor(private http: HttpClient) {}

  // Create Rendez-vous
  createRendezVous(request: RendezVousRequest): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.post<void>(this.apiUrl, request).pipe(
      tap(() => this._isLoading.set(false)),
      catchError((err) => {
        this._error.set(err?.error?.message || 'Erreur lors de la création du rendez-vous');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Get Rendez-vous by ID
  getRendezVousById(id: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.get<RendezVousResponse>(`${this.apiUrl}/${id}`).pipe(
      tap((data) => {
        this._rendezVous.set(data);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        this._error.set(err?.error?.message || 'Rendez-vous non trouvé');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Update Rendez-vous
  updateRendezVous(id: number, request: RendezVousUpdateRequest): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.put<void>(`${this.apiUrl}/${id}`, request).pipe(
      tap(() => this._isLoading.set(false)),
      catchError((err) => {
        this._error.set(err?.error?.message || 'Erreur lors de la mise à jour');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Delete Rendez-vous
  deleteRendezVous(id: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this._isLoading.set(false)),
      catchError((err) => {
        this._error.set(err?.error?.message || 'Erreur lors de la suppression');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Generate link for Rendez-vous
  genererLien(id: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.put<RendezVousResponse>(`${this.apiUrl}/rendezvous/${id}/generer-lien`, {}).pipe(
      tap((data) => {
        this._rendezVous.set(data);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        this._error.set(err?.error?.message || 'Erreur lors de la génération du lien');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Get all Rendez-vous with pagination
  getAllRendezVous(page: number = 0, size: number = 10): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.get<Page<RendezVousResponse>>(`${this.apiUrl}/rendezvous?page=${page}&size=${size}`).pipe(
      tap((data) => {
        this._rendezVousList.set(data);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        this._error.set(err?.error?.message || 'Erreur lors du chargement');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Assign Rendez-vous to a patient
  assignToPatient(rendezvousId: number, patientId: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.put<RendezVousResponse>(`${this.apiUrl}/rendezvous/${rendezvousId}/assign-to-patient/${patientId}`, {}).pipe(
      tap((data) => {
        this._rendezVous.set(data);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        this._error.set(err?.error?.message || 'Erreur lors de l\'assignation au patient');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Assign Rendez-vous to a doctor
  assignToMedecin(rendezvousId: number, medecinId: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.put<RendezVousResponse>(`${this.apiUrl}/rendezvous/${rendezvousId}/assign-to-medecin/${medecinId}`, {}).pipe(
      tap((data) => {
        this._rendezVous.set(data);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        this._error.set(err?.error?.message || 'Erreur lors de l\'assignation au médecin');
        this._isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }
}


