import { BaseInterface } from "./base-interface";
import { Medecin } from "./medecin";

export interface Disponibilite extends BaseInterface {
  jour: string;
  heureDebut: Date; 
  heureFin: Date;   
  medecin: Medecin;
}
export interface DisponibiliteRequest {
  jour: string;
  heureDebut: Date; 
  heureFin: Date;   
}

export interface DisponibiliteResponse {
  id: number;
  jour: string;
  heureDebut: Date; 
  heureFin: Date;   
}

export interface DisponibiliteUpdateRequest {
  jour: string;
  heureDebut: Date; 
  heureFin: Date;   
}


