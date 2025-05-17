import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, of, tap } from 'rxjs';
import { SuiviRequest, SuiviResponse } from '../models/suivi';

@Injectable({
  providedIn: 'root',
})
export class SuiviService {
  private apiUrl = `${environment.apiUrl}/api/v1/suivis`;

  // Signals
  private _suivis = signal<SuiviResponse[]>([]);
  private _isLoading = signal<boolean>(false);
  private _authError = signal<string | null>(null);

  // Computed public getters
  suivis = computed(() => this._suivis());
  isLoading = computed(() => this._isLoading());
  authError = computed(() => this._authError());

  constructor(private http: HttpClient) {}

  loadSuivisByPatientId(patientId: number, page: number = 0, size: number = 10): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<{ content: SuiviResponse[] }>(`${this.apiUrl}/patients/${patientId}/suivis?page=${page}&size=${size}`)
      .pipe(
        tap((response) => {
          this._suivis.set(response.content);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors du chargement des suivis');
          this._isLoading.set(false);
          return of([]);
        })
      )
      .subscribe();
  }

  loadSuivisByMedecinId(medecinId: number, page: number = 0, size: number = 10): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<{ content: SuiviResponse[] }>(`${this.apiUrl}/medecins/${medecinId}/suivis?page=${page}&size=${size}`)
      .pipe(
        tap((response) => {
          this._suivis.set(response.content);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors du chargement des suivis du médecin');
          this._isLoading.set(false);
          return of([]);
        })
      )
      .subscribe();
  }

  createSuivi(request: SuiviRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<SuiviResponse>(this.apiUrl, request)
      .pipe(
        tap((newSuivi) => {
          this._suivis.update((suivis) => [...suivis, newSuivi]);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la création du suivi');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  updateSuivi(suiviId: number, request: SuiviRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .put<SuiviResponse>(`${this.apiUrl}/suivi/${suiviId}`, request) // Ajout de /suivi/
      .pipe(
        tap((updatedSuivi) => {
          this._suivis.update((suivis) =>
            suivis.map((suivi) => (suivi.id === updatedSuivi.id ? updatedSuivi : suivi))
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la mise à jour de suivi');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  deleteSuivi(suiviId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .delete<void>(`${this.apiUrl}/suivi/${suiviId}`) // Ajout de /suivi/
      .pipe(
        tap(() => {
          this._suivis.update((suivis) => suivis.filter((suivi) => suivi.id !== suiviId));
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la suppression de suivi');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  assignSuiviToMedecin(suiviId: number, medecinId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .put<SuiviResponse>(`${this.apiUrl}/${suiviId}/medecin/${medecinId}`, {}) // PUT au lieu de POST
      .pipe(
        tap((updatedSuivi) => {
          this._suivis.update((suivis) =>
            suivis.map((suivi) => (suivi.id === updatedSuivi.id ? updatedSuivi : suivi))
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de l’attribution du suivi au médecin');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  assignSuiviToPatient(suiviId: number, patientId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .put<SuiviResponse>(`${this.apiUrl}/${suiviId}/assign/patient/${patientId}`, {}) // PUT + ajout /assign/
      .pipe(
        tap((updatedSuivi) => {
          this._suivis.update((suivis) =>
            suivis.map((suivi) => (suivi.id === updatedSuivi.id ? updatedSuivi : suivi))
          );
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de l’attribution du suivi au patient');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
assignImcToSuivi(suiviId: number, imcValue: number): void {
  this._isLoading.set(true);
  this._authError.set(null);
  this.http
    .put<SuiviResponse>(`${this.apiUrl}/${suiviId}/assign/imc`, { imc: imcValue })
    .pipe(
      tap((updatedSuivi) => {
        this._suivis.update((suivis) =>
          suivis.map((suivi) => (suivi.id === updatedSuivi.id ? updatedSuivi : suivi))
        );
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de l’attribution de l’IMC');
        this._isLoading.set(false);
        return of(null);
      })
    )
    .subscribe();
}

assignRythmeToSuivi(suiviId: number, rythmeValue: number): void {
  this._isLoading.set(true);
  this._authError.set(null);
  this.http
    .put<SuiviResponse>(`${this.apiUrl}/${suiviId}/assign/rythme`, { rythme: rythmeValue })
    .pipe(
      tap((updatedSuivi) => {
        this._suivis.update((suivis) =>
          suivis.map((suivi) => (suivi.id === updatedSuivi.id ? updatedSuivi : suivi))
        );
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de l’attribution du rythme');
        this._isLoading.set(false);
        return of(null);
      })
    )
    .subscribe();
}

assignTensionToSuivi(suiviId: number, tensionValue: number): void {
  this._isLoading.set(true);
  this._authError.set(null);
  this.http
    .put<SuiviResponse>(`${this.apiUrl}/${suiviId}/assign/tension`, { tension: tensionValue })
    .pipe(
      tap((updatedSuivi) => {
        this._suivis.update((suivis) =>
          suivis.map((suivi) => (suivi.id === updatedSuivi.id ? updatedSuivi : suivi))
        );
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de l’attribution de la tension');
        this._isLoading.set(false);
        return of(null);
      })
    )
    .subscribe();
}




}


