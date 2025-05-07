import { RendezVous } from "./rendez-vous";
import { Patient } from "./patient";
import { Suivi } from "./suivi";
import { Reclamation } from "./reclamation";
import { Prescription } from "./prescription";
import { Rappel } from "./rappel";
import { Disponibilite } from "./disponibilite";
import { Utilisateur, UtilisateurResponse } from "./utilisateur";

export interface Medecin extends Utilisateur {
  specialite: string;
  description: string;
  rendezVous: RendezVous[];  
  patients: Patient[];  
  suivi: Suivi[];  
  reclamation: Reclamation[]; 
  prescription: Prescription[];  
  rappel: Rappel[];  
  disponibilite: Disponibilite[];  
}
export interface MedecinResponse extends UtilisateurResponse{
  specialite: string;
  description: string;
}






