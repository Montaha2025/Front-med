import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Medecin, MedecinResponse } from '../models/medecin';
import { Page } from '../models/page.interface';


@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/medecins`;

  private _medecins = signal<MedecinResponse[]>([]);

  // Private signals
private _isLoading = signal<boolean>(false);
private _errorMessage = signal<string | null>(null);

// Public computed getters
medecins = computed(() => this._medecins());
isLoading = computed(() => this._isLoading());
errorMessage = computed(() => this._errorMessage());


  constructor(private http: HttpClient) {}

  //  Trouver par spécialité
  findBySpecialite(specialite: string, page: number = 0, size: number = 10) {
    this._isLoading.set(true);
    this._errorMessage.set(null);

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    this.http.get<Page<MedecinResponse>>(`${this.apiUrl}/specialite/${specialite}`, { params })
      .pipe(
        tap(response => {
          this._medecins.set(response.content);
          this._isLoading.set(false);
        }),
        catchError(error => {
          this._errorMessage.set(error?.error?.message || 'Erreur lors du chargement des médecins');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  //  Assigner une spécialité
  assignSpecialite(medecinId: number, specialite: string) {
  
    this._isLoading.set(true);
    this._errorMessage.set(null);

    const params = new HttpParams().set('specialite', specialite);

    this.http.put(`${this.apiUrl}/${medecinId}/specialite`, null, { params })
      .pipe(
        tap(() => {
          this._isLoading.set(false);
          // Optionnel : recharger les données ou afficher un succès
        }),
        catchError(error => {
          this._errorMessage.set(error?.error?.message || 'Erreur lors de l’assignation de la spécialité');
          this._isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
}

