import { BaseInterface } from "./base-interface";
import { Medecin } from "./medecin";
import { RendezVous } from "./rendez-vous";
import { Reclamation } from "./reclamation";
import { Prescription } from "./prescription";
import { Suivi } from "./suivi";
import { Rappel } from "./rappel";
import { Utilisateur, UtilisateurResponse } from "./utilisateur";

export interface Patient extends Utilisateur {
  dateNaissance: Date;
  numeroDossier: string;
  sexe: string;
  medecins: Medecin[];
  rendezVous: RendezVous[];
  reclamation: Reclamation[];
  prescription: Prescription[];
  suivi: Suivi[];
  rappel: Rappel[];
}
export interface PatientResponse extends UtilisateurResponse{
  dateNaissance: Date;
  numeroDossier: string;
  sexe: string;


}


