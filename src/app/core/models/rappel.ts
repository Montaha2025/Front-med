import { BaseInterface } from "./base-interface";
import { Prescription } from "./prescription";
import { Patient } from "./patient";
import { Medecin } from "./medecin";
import { RendezVous } from "./rendez-vous";

export interface Rappel extends BaseInterface {
  dateRappel: Date;
  message: string;
  etat: string;
  prescription: Prescription;
  patient: Patient;
  medecin: Medecin;
  rendezVous: RendezVous;
}

