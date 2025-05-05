import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, of, tap } from 'rxjs';
import { PrescriptionRequest, PrescriptionResponse } from '../models/prescription';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private apiUrl = `${environment.apiUrl}/api/v1/prescriptions`;

  // Signal to store the list of prescriptions
  private _prescriptions = signal<PrescriptionResponse[]>([]);
  public prescriptions = this._prescriptions;

  // Signal for loading and errors
  isLoading = signal<boolean>(false);
  authError = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Load all prescriptions
  loadAllPrescriptions(page: number = 0, size: number = 10): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .get<{ content: PrescriptionResponse[] }>(
        `${this.apiUrl}?page=${page}&size=${size}`
      )
      .pipe(
        tap((response) => {
          this._prescriptions.set(response.content); // Update the prescriptions list
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading prescriptions'
          );
          this.isLoading.set(false);
          return of([]); // Return empty array on error
        })
      )
      .subscribe();
  }

  // Create a new prescription
  createPrescription(prescriptionRequest: PrescriptionRequest): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<PrescriptionResponse>(this.apiUrl, prescriptionRequest)
      .pipe(
        tap((newPrescription) => {
          this._prescriptions.update((prescriptions) => [
            ...prescriptions,
            newPrescription,
          ]);
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error creating prescription'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Get prescription by ID
  getPrescriptionById(prescriptionId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .get<PrescriptionResponse>(`${this.apiUrl}/Prescription/${prescriptionId}`)
      .pipe(
        tap((prescription) => {
          // Logic to handle a single prescription if necessary
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error loading prescription'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Delete a prescription
  deletePrescription(prescriptionId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .delete<void>(`${this.apiUrl}/Prescription/${prescriptionId}`)
      .pipe(
        tap(() => {
          this._prescriptions.update((prescriptions) =>
            prescriptions.filter((prescription) => prescription.id !== prescriptionId)
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error deleting prescription'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign prescription to patient
  assignPrescriptionToPatient(patientId: number, prescriptionId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<PrescriptionResponse>(`${this.apiUrl}/${patientId}/prescriptions/${prescriptionId}`, {})
      .pipe(
        tap((assignedPrescription) => {
          this._prescriptions.update((prescriptions) =>
            prescriptions.map((prescription) =>
              prescription.id === assignedPrescription.id ? assignedPrescription : prescription
            )
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning prescription to patient'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }

  // Assign prescription to medecin
  assignPrescriptionToMedecin(medecinId: number, prescriptionId: number): void {
    this.isLoading.set(true);
    this.authError.set(null);
    this.http
      .post<PrescriptionResponse>(`${this.apiUrl}/${medecinId}/prescriptions/${prescriptionId}`, {})
      .pipe(
        tap((assignedPrescription) => {
          this._prescriptions.update((prescriptions) =>
            prescriptions.map((prescription) =>
              prescription.id === assignedPrescription.id ? assignedPrescription : prescription
            )
          );
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.authError.set(
            error?.error?.message || 'Error assigning prescription to medecin'
          );
          this.isLoading.set(false);
          return of(null); // Return null on error
        })
      )
      .subscribe();
  }
}

