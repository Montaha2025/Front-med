import { BaseInterface } from "./base-interface";
import { Patient } from "./patient";
import { Medecin } from "./medecin";
import { Prescription } from "./prescription";
import { Suivi } from "./suivi";

export interface DossierMedical extends BaseInterface {
  patient: Patient;
  medecin: Medecin;
  motifConsultation: string;
  dateCreation: Date;
  prescriptions: Prescription[];
  suivis: Suivi[];
}

export interface DossierMedicalRequest  {
  patient: Patient;
  medecin: Medecin;
  motifConsultation: string;

}


