import { BaseInterface } from "./base-interface";
import { Medecin } from "./medecin";

export interface Disponibilite extends BaseInterface {
  jour: string;
  heureDebut: Date; 
  heureFin: Date;   
  medecin: Medecin;
}
