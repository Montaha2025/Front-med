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

  private _rappels = signal<RappelResponse[]>([]);
  private _authError = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);

  public rappels = computed(() => this._rappels());
  public authError = computed(() => this._authError());
  public isLoading = computed(() => this._isLoading());

  constructor(private http: HttpClient) {}

  loadAllRappels(page: number = 0, size: number = 10): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<{ content: RappelResponse[] }>(`${this.apiUrl}?page=${page}&size=${size}`)
      .pipe(
        tap((response) => {
          this._rappels.set(response.content);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors du chargement des rappels');
          this._isLoading.set(false);
          return of({ content: [] });
        })
      )
      .subscribe();
  }

  createRappel(rappelRequest: RappelRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    // Backend renvoie void, donc on ne s’attend pas à un RappelResponse
    this.http
      .post<void>(this.apiUrl, rappelRequest)
      .pipe(
        tap(() => {
          // Recharge la liste après création car on a pas le rappel créé en retour
          this.loadAllRappels();
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la création de rappel');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  createRappelByPatient(patientId: number, rappelRequest: RappelRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .post<void>(`${this.apiUrl}/patients/${patientId}/create`, rappelRequest)
      .pipe(
        tap(() => {
          this.loadAllRappels();
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la création de rappel par patient');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  updateRappel(rappelId: number, rappelUpdateRequest: RappelUpdateRequest): void {
    this._isLoading.set(true);
    this._authError.set(null);
    // Backend renvoie void, on ne reçoit pas de rappel mis à jour
    this.http
      .put<void>(`${this.apiUrl}/${rappelId}`, rappelUpdateRequest)
      .pipe(
        tap(() => {
          this.loadAllRappels();
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la mise à jour de rappel');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  deleteRappel(rappelId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .delete<void>(`${this.apiUrl}/${rappelId}`)
      .pipe(
        tap(() => {
          this._rappels.update((rappels) => rappels.filter((rappel) => rappel.id !== rappelId));
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de la suppression de rappel');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  findRappelById(rappelId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    this.http
      .get<RappelResponse>(`${this.apiUrl}/Rappel/${rappelId}`)
      .pipe(
        tap(() => {
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors du chargement de rappel');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  assignRappelToPatient(patientId: number, rappelId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    // Backend attend PUT, pas POST
    this.http
      .put<void>(`${this.apiUrl}/patients/${patientId}/rappels/${rappelId}`, {})
      .pipe(
        tap(() => {
          this.loadAllRappels();
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de l’attribution de rappel au patient');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  assignRappelToMedecin(medecinId: number, rappelId: number): void {
    this._isLoading.set(true);
    this._authError.set(null);
    // Backend attend PUT, pas POST
    this.http
      .put<void>(`${this.apiUrl}/medecins/${medecinId}/rappels/${rappelId}`, {})
      .pipe(
        tap(() => {
          this.loadAllRappels();
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._authError.set(error?.error?.message || 'Erreur lors de l’attribution de rappel au médecin');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
  assignRappelToPrescription(prescriptionId: number, rappelId: number): void {
  this._isLoading.set(true);
  this._authError.set(null);
  this.http
    .put<void>(`${this.apiUrl}/prescriptions/${prescriptionId}/rappels/${rappelId}`, {})
    .pipe(
      tap(() => {
        this.loadAllRappels();
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de l’attribution de rappel à la prescription');
        this._isLoading.set(false);
        return of(null);
      })
    )
    .subscribe();
}

assignRappelToRendezVous(rendezVousId: number, rappelId: number): void {
  this._isLoading.set(true);
  this._authError.set(null);
  this.http
    .put<void>(`${this.apiUrl}/rendezvous/${rendezVousId}/rappels/${rappelId}`, {})
    .pipe(
      tap(() => {
        this.loadAllRappels();
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._authError.set(error?.error?.message || 'Erreur lors de l’attribution de rappel au rendez-vous');
        this._isLoading.set(false);
        return of(null);
      })
    )
    .subscribe();
}

}

