import { BaseInterface } from "./base-interface";
import { Medecin } from "./medecin";
import { Patient } from "./patient";
import { Rappel } from "./rappel";
import { DossierMedical } from "./dossier-medical";

export interface Prescription extends BaseInterface {
  datePrescription: Date;
  medicament: string;
  dose: number;
  frequence: number;
  duree: number;
  medecin: Medecin;
  patient: Patient;
  rappel: Rappel[];
  dossierMedical: DossierMedical;
}

