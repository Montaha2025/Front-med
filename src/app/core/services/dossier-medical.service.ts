import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DossierMedical, DossierMedicalRequest } from '../models/dossier-medical';
import { Suivi } from '../models/suivi';
import { Prescription } from '../models/prescription';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DossierMedicalService {
  private apiUrl = `${environment.apiUrl}/api/dossierMedical`;

  dossierMedical = signal<DossierMedical | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Créer un dossier médical
  createDossierMedical(request: DossierMedicalRequest): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.post<DossierMedical>(`${this.apiUrl}/create`, request).pipe(
      tap((response) => {
        this.dossierMedical.set(response);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.error.set(error?.error?.message || 'Erreur lors de la création du dossier médical');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Ajouter un suivi dans un dossier médical
  ajouterSuiviDansDossier(dossierId: number, suivi: Suivi): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.post<void>(`${this.apiUrl}/${dossierId}/ajouterSuivi`, suivi).pipe(
      tap(() => {
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.error.set(error?.error?.message || 'Erreur lors de l’ajout du suivi');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  // Ajouter une prescription dans un dossier médical
  ajouterPrescriptionDansDossier(dossierId: number, prescription: Prescription): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.post<void>(`${this.apiUrl}/${dossierId}/ajouterPrescription`, prescription).pipe(
      tap(() => {
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.error.set(error?.error?.message || 'Erreur lors de l’ajout de la prescription');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }
}
