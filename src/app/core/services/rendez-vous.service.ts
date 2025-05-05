import { Injectable, signal } from '@angular/core';
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

  rendezVous = signal<RendezVousResponse | null>(null);
  rendezVousList = signal<Page<RendezVousResponse> | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  createRendezVous(request: RendezVousRequest): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.post<void>(this.apiUrl, request).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Erreur lors de la création du rendez-vous');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  getRendezVousById(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<RendezVousResponse>(`${this.apiUrl}/${id}`).pipe(
      tap((data) => {
        this.rendezVous.set(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Rendez-vous non trouvé');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  updateRendezVous(id: number, request: RendezVousUpdateRequest): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.put<void>(`${this.apiUrl}/${id}`, request).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Erreur lors de la mise à jour');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  deleteRendezVous(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Erreur lors de la suppression');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  genererLien(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.put<RendezVousResponse>(`${this.apiUrl}/rendezvous/${id}/generer-lien`, {}).pipe(
      tap((data) => {
        this.rendezVous.set(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Erreur lors de la génération du lien');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  getAllRendezVous(page: number = 0, size: number = 10): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<Page<RendezVousResponse>>(`${this.apiUrl}/rendezvous?page=${page}&size=${size}`).pipe(
      tap((data) => {
        this.rendezVousList.set(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Erreur lors du chargement');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  assignToPatient(rendezvousId: number, patientId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.put<RendezVousResponse>(`${this.apiUrl}/rendezvous/${rendezvousId}/assign-to-patient/${patientId}`, {}).pipe(
      tap((data) => {
        this.rendezVous.set(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Erreur lors de l\'assignation au patient');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  assignToMedecin(rendezvousId: number, medecinId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.put<RendezVousResponse>(`${this.apiUrl}/rendezvous/${rendezvousId}/assign-to-medecin/${medecinId}`, {}).pipe(
      tap((data) => {
        this.rendezVous.set(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.error.set(err?.error?.message || 'Erreur lors de l\'assignation au médecin');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }
}

