import { Injectable, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PatientResponse } from '../models/patient.model';
import { Page } from '../models/page.model';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/patients`;

  // Signals
  private _patientsPage = signal<Page<PatientResponse> | null>(null);
  private _selectedPatient = signal<PatientResponse | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Getters exposés
  patientsPage = computed(() => this._patientsPage());
  selectedPatient = computed(() => this._selectedPatient());
  isLoading = computed(() => this._isLoading());
  error = computed(() => this._error());

  constructor(private http: HttpClient) {}

  // Charger les patients par médecin avec pagination
  fetchPatientsByMedecin(medecinId: number, page = 0, size = 10): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<Page<PatientResponse>>(
        `${this.apiUrl}/medecin/${medecinId}/patients?page=${page}&size=${size}`
      )
      .pipe(
        tap((response) => {
          this._patientsPage.set(response);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._error.set(error?.error?.message || 'Erreur lors du chargement des patients');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  // Récupérer un patient par numéro de dossier
  fetchPatientByNumeroDossier(numeroDossier: string): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<PatientResponse>(`${this.apiUrl}/numero-dossier/${numeroDossier}`)
      .pipe(
        tap((response) => {
          this._selectedPatient.set(response);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._error.set(error?.error?.message || 'Patient introuvable');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  // Assigner un patient à un médecin
  assignPatientToMedecin(patientId: number, medecinId: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .put<PatientResponse>(
        `${this.apiUrl}/assign/${patientId}/medecin/${medecinId}`,
        {}
      )
      .pipe(
        tap((response) => {
          this._selectedPatient.set(response);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._error.set(error?.error?.message || 'Erreur lors de l\'assignation');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
}
