import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Medecin } from '../models/medecin';
import { Page } from '../models/page.interface';


@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/medecins`;

  private _medecins = signal<Medecin[]>([]);
  medecins = this._medecins;

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // 🔍 Trouver par spécialité
  findBySpecialite(specialite: string, page: number = 0, size: number = 10) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    this.http.get<Page<Medecin>>(`${this.apiUrl}/specialite/${specialite}`, { params })
      .pipe(
        tap(response => {
          this._medecins.set(response.content);
          this.isLoading.set(false);
        }),
        catchError(error => {
          this.errorMessage.set(error?.error?.message || 'Erreur lors du chargement des médecins');
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  // ✏️ Assigner une spécialité
  assignSpecialite(medecinId: number, specialite: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const params = new HttpParams().set('specialite', specialite);

    this.http.put(`${this.apiUrl}/${medecinId}/specialite`, null, { params })
      .pipe(
        tap(() => {
          this.isLoading.set(false);
          // Optionnel : recharger les données ou afficher un succès
        }),
        catchError(error => {
          this.errorMessage.set(error?.error?.message || 'Erreur lors de l’assignation de la spécialité');
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
}

